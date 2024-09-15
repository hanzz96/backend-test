import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { WarrantyClaim, WarrantyClaimDocument } from 'src/warranty/schemas/warrantyclaim.schema';
import { CacheLockException } from 'src/_exception/cache_lock.exception';
import { CacheService } from 'src/_common/cache.service';
import { CACHE_KEYS } from 'src/_util/util.const';
import { USER_ROLE } from 'src/auth/utils/user.enum';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
        @InjectModel(WarrantyClaim.name)
        private warrantyClaimModel: Model<WarrantyClaimDocument>,
        private readonly cacheManager: CacheService
    ) { }

    async create(product: Product, user: User): Promise<Product> {
        const { name, serialNumber } = product;

        const productExist = await this.productModel.findOne({ name: name, serialNumber: serialNumber });

        if (productExist) {
            let message = `Product already exist`;
            throw new ConflictException(message);
        }

        const data = Object.assign(product, { createdBy: user._id });

        const newProduct = await this.productModel.create(data);
        return newProduct;
    }

    async findAll(user: User): Promise<Product[]> {
        if(user.role === USER_ROLE.STAFF){
            return this.productModel.find();
        }
        else{
            return this.productModel.find({},'-serialNumber');
        }
    }

    async findOne(id: string, user: User): Promise<Product> {

        const product = await this.productModel.findById(id);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if(user.role === USER_ROLE.CUSTOMER){
            return await this.productModel.findById(id, '-serialNumber');
        }
        return product;

    }

    async updateById(id: string, product: Product): Promise<Product> {

        return this.productModel.findByIdAndUpdate(id, product, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Product> {
        try {

            this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            const hasClaims = await this.warrantyClaimModel.findOne({
                productId: new Types.ObjectId(id),
            });

            if (hasClaims) {
                throw new ConflictException('Cannot delete product because there are existing warranty claims.');
            }

            this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            return this.productModel.findByIdAndDelete(id)
        } catch (error) {
            if (error! instanceof CacheLockException) {
                this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            }
            throw error;
        }

    }
}
