import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WarrantyClaim, WarrantyClaimDocument } from './schemas/warrantyclaim.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { WARRANTY_CLAIM_STATUS } from './utils/approval.enum';
import { ProductService } from 'src/product/product.service';
import { ApproveWarrantyClaimDto } from './dto/approve-warrantyclaim.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from 'src/_common/cache.service';
import { CacheLockException } from 'src/_exception/cache_lock.exception';
import { CACHE_KEYS } from 'src/_util/util.const';

@Injectable()
export class WarrantyclaimService {
    constructor(
        @InjectModel(WarrantyClaim.name)
        private warrantyClaimModel: Model<WarrantyClaimDocument>,
        private productService: ProductService,
        private readonly cacheManager: CacheService
    ) { }

    async findAll(): Promise<WarrantyClaim[]> {

        return this.warrantyClaimModel.find().populate({
            path: 'productId',
            select: 'name warrantyPeriodDay createdAt serialNumber'
        })
            .populate({
                path: 'customerId',
                select: 'username role'
            })
            .exec();
    }

    async findByUserCustomer(userCustomerId: string): Promise<WarrantyClaim[]> {
        return this.warrantyClaimModel.find({ customerId: userCustomerId });
    }

    async findOne(id: string): Promise<WarrantyClaim> {
        const warrancyClaim = await this.warrantyClaimModel.findById(id);

        if (!warrancyClaim) {
            throw new NotFoundException('Warranty Claim not found');
        }

        return warrancyClaim;
    }

    async create(warrantyClaim: WarrantyClaim, user: User): Promise<WarrantyClaim> {

        const { productId, serialNumber } = warrantyClaim;
        try {
            this.cacheManager.silentLockCache(`${CACHE_KEYS.PRODUCT}${productId}`, user.username, 5000, `Data is being processed now by ${user.username}, please try refresh page`);
            await this.productService.findOne(productId.toString());

            const getClaim = await this.warrantyClaimModel.findOne({ productId: new Types.ObjectId(productId.toString()) });

            if (getClaim) {
                if (getClaim.customerId.toString() !== user._id.toString()) {
                    throw new NotFoundException('Warranty claim is used by other customer, please contact staff for more information');
                }
                else if (getClaim.status === WARRANTY_CLAIM_STATUS.PENDING) {
                    throw new NotFoundException('Warranty Claim for this product still on Pending..');
                }
                else if (getClaim.serialNumber !== serialNumber) {
                    throw new NotFoundException('Serial Number not match');
                }
            }

            const data = Object.assign(warrantyClaim, { customerId: user._id, productId: new Types.ObjectId(productId.toString()) });

            const newWarrantyClaim = await this.warrantyClaimModel.create(data);

            return newWarrantyClaim;
        } catch (error) {
            throw error;
        }
        finally {
            this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${productId}`);
        }
    }

    async actionClaim(id: string, warrantyClaim: ApproveWarrantyClaimDto, user: User): Promise<WarrantyClaim> {
        try {

            const { status } = warrantyClaim;

            this.cacheManager.lockCache(`${CACHE_KEYS.CLAIM}${id}`, user.username, 5000, `Data is being processed now by ${user.username}, please try refresh page`);

            const findWarrantyClaim = await this.warrantyClaimModel.findById(id);

            if (!findWarrantyClaim) {
                throw new NotFoundException('Warranty Claim not found');
            }

            if (findWarrantyClaim.status !== WARRANTY_CLAIM_STATUS.PENDING) {
                throw new NotFoundException(`Warranty Claim already ${findWarrantyClaim.status}`);
            }

            const data = Object.assign(warrantyClaim, { staffId: user._id, status: status, resolvedAt: (new Date()).toISOString() });

            const newWarrantyClaim = await this.warrantyClaimModel.findOneAndUpdate(data);

            this.cacheManager.unlockCache(`${CACHE_KEYS.CLAIM}${id}`);

            return newWarrantyClaim;
        } catch (error) {
            if (error! instanceof CacheLockException) {
                this.cacheManager.unlockCache(`${CACHE_KEYS.CLAIM}${id}`);
            }
            throw error;
        }
    }
}
