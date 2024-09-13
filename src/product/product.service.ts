import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import MongooseDelete = require("mongoose-delete");
import { Product, ProductDocument } from './schemas/product.schema';
import { WarrantyClaim, WarrantyClaimDocument } from 'src/warranty/schemas/warrantyclaim.schema';
import { CacheLockException } from 'src/_exception/cache_lock.exception';
import { CacheService } from 'src/_common/cache.service';
import { CACHE_KEYS } from 'src/_util/util.const';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: MongooseDelete.SoftDeleteModel<ProductDocument>,
        @InjectModel(WarrantyClaim.name)
        private warrantyClaimModel: Model<WarrantyClaimDocument>,
        private readonly cacheManager: CacheService
    ) { }

    async create(product: Product, user: User): Promise<Product> {
        const { name, serialNumber } = product;

        const productExist = await this.productModel.findOneWithDeleted({ name: name, serialNumber: serialNumber });

        if (productExist) {
            let message = `Product already exist`;

            if (productExist.deletedAt) {
                message += ` and it was already deleted at ${productExist.deletedAt} , Please restore it by contact admin`;
            }

            throw new ConflictException(message);
        }

        const data = Object.assign(product, { createdBy: user._id });

        const newProduct = await this.productModel.create(data);
        return newProduct;
    }

    async findAll(): Promise<Product[]> {
        // console.log('masuk');
        return this.productModel.find();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findById(id);

        if (!product) {
            throw new NotFoundException('Product not found');
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
        /**
         * Check if there are warranty claims exists, assuming if there are warranty transaction, product SHOULDN NOT be deleted
         */

        try {

            this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            const hasClaims = await this.warrantyClaimModel.exists({
                productId: new Types.ObjectId(id),
            });

            if (hasClaims) {
                throw new ConflictException('Cannot delete product because there are pending or approved warranty claims.');
            }

            this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            return this.productModel.deleteById(id)
        } catch (error) {
            if (error! instanceof CacheLockException) {
                this.cacheManager.unlockCache(`${CACHE_KEYS.PRODUCT}${id}`);
            }
            throw error;
        }

        // return this.productModel.findByIdAndDelete(id);
    }
}
