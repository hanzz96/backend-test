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
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Post()
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async create(@Body() product: CreateProductDto, @Req() req): Promise<Product> {
        const res = await this.productService.create(product, req.user);
        return res;
    }

    @Get(
        ':id'
    )
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async getProduct(@Param('id') id: string): Promise<Product> {
        const product = await this.productService.findOne(id);
        return product;
    }

    @Put(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<Product> {
        const updated = await this.productService.updateById(id, product);
        return updated;
    }

    @Delete(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async deleteProduct(@Param('id') id: string): Promise<Product> {
        const product = await this.productService.deleteById(id);
        return product;
    }
}
