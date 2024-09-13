import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { USER_ROLE } from 'src/auth/utils/user.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Product } from './schemas/product.schema';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async findAll(): Promise<{ products: Product[] }> {
        return {products  : await this.productService.findAll() };
    }

    @Post()
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async create(@Body() product: CreateProductDto, @Req() req): Promise<{ message: string , product: Product}> {
        const res = await this.productService.create(product, req.user);
        return { message: 'Product created successfully', product: res };
    }

    @Get(
        ':id'
    )
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async getProduct(@Param('id') id: string): Promise<{ product: Product }> {
        const product = await this.productService.findOne(id);
        return { product: product };
    }

    @Put(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<{ message: string, updated_product: Product }> {
        const updated = await this.productService.updateById(id, product);
        return { message: 'Product updated successfully', updated_product: updated };
    }

    @Delete(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
        await this.productService.deleteById(id);
        return { message: `Product has been deleted successfully` };
    }
}
