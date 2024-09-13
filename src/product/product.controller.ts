import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body() product: CreateProductDto, @Req() req): Promise<Product> {
        const res = await this.productService.create(product, req.user);
        return res;
    }

    @Get(
        ':id'
    )
    async getProduct(@Param('id') id: string): Promise<Product> {
        const product = await this.productService.findOne(id);
        return product;
    }

    @Put(
        ':id'
    )
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<Product> {
        const updated = await this.productService.updateById(id, product);
        return updated;
    }

    @Delete(
        ':id'
    )
    async deleteProduct(@Param('id') id: string): Promise<Product> {
        const product = await this.productService.deleteById(id);
        return product;
    }
}
