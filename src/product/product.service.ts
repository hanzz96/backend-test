import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>
    ) { }

    async create(product: Product, user: User): Promise<Product> {
        const {serialNumber} = product;

        const productExist = await this.productModel.findOne({serialNumber});
        
        if(productExist){
            throw new ConflictException(`Serial number already exist, on product ${productExist.name}`);
        }

        const data = Object.assign(product, {createdBy: user.username});

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
        return this.productModel.findByIdAndDelete(id)
    }
}
