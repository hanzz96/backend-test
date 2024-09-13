import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WarrantyClaim, WarrantyClaimDocument } from './schemas/warrantyclaim.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { WARRANTY_CLAIM_STATUS } from './utils/approval.enum';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class WarrantyclaimService {
    constructor(
        @InjectModel(WarrantyClaim.name)
        private warrantyClaimModel: Model<WarrantyClaimDocument>,
        private productService: ProductService
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

    async create(warrantyClaim: WarrantyClaim, user: User): Promise<{ message: string, data: WarrantyClaim }> {
        const { productId, serialNumber } = warrantyClaim;
        
        const findProduct = await this.productService.findOne(productId.toString());
        
        if(!findProduct){
            throw new NotFoundException("Product not found, please contact staff");
        }

        const getClaim = await this.warrantyClaimModel.findOne({ productId: new Types.ObjectId(productId.toString()) });
        
        if (getClaim) {
            if (getClaim.customerId.toString() !== user._id.toString()) {
                throw new NotFoundException('Warranty claim is used by other customer, please contact staff for more information');
            }
            else if (getClaim.status === WARRANTY_CLAIM_STATUS.PENDING) {
                throw new NotFoundException('Warranty Claim Still on Pending..');
            }
            else if(getClaim.serialNumber !== serialNumber) {
                throw new NotFoundException('Serial Number not match');
            }
        }

        const data = Object.assign(warrantyClaim, { customerId: user._id, productId: new Types.ObjectId(productId.toString()) });

        const newWarrantyClaim = await this.warrantyClaimModel.create(data);

        return { message: 'Warranty Claim created successfully', data: newWarrantyClaim };
    }
}
