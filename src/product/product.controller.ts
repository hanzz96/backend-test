import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { USER_ROLE } from 'src/auth/utils/user.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Product } from './schemas/product.schema';
import { User } from 'src/auth/schemas/user.schema';
import { ApiResponse, ApiSecurity, ApiTags, getSchemaPath } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }


    @ApiTags('Products')
    @ApiResponse({ status: 200, description: 'list of products, if customer, it will not show serial number of product', type: Product, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiSecurity('bearer')

    @Get()
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async findAll(@Req() req): Promise<{ products: Product[] }> {
        return { products: await this.productService.findAll(req.user) };
    }

    @ApiTags('Products')
    @ApiResponse({
        status: 201, description: 'Product created successfully', schema: {
            properties: {
                message: { type: 'string' },
                product: { $ref: getSchemaPath(Product) }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized, Staff only' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiSecurity('bearer')

    @Post()
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async create(@Body() product: CreateProductDto, @Req() req): Promise<{ message: string, product: Product }> {
        const res = await this.productService.create(product, req.user);
        return { message: 'Product created successfully', product: res };
    }

    @ApiTags('Products')
    @ApiResponse({ status: 200, description: 'Product information by Id', type: Product })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiSecurity('bearer')
    @Get(
        ':id'
    )
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async getProduct(@Param('id') id: string, @Req() req): Promise<{ product: Product }> {
        const product = await this.productService.findOne(id, req.user);
        return { product: product };
    }

    @ApiTags('Products')
    @ApiResponse({
        status: 200, description: 'Update Product successfully', schema: {
            properties: {
                message: { type: 'string' },
                updatedProduct: { $ref: getSchemaPath(Product) }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized, Staff only' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiSecurity('bearer')
    @Put(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<{ message: string, updatedProduct: Product }> {
        const updated = await this.productService.updateById(id, product);
        return { message: 'Product updated successfully', updatedProduct: updated };
    }

    @ApiTags('Products') 
    @ApiResponse({
        status: 200, description: 'Delete Product successfully', schema: {
            properties: {
                message: { type: 'string' },
                deletedProduct: { $ref: getSchemaPath(Product) }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized, Staff only' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ApiResponse({ status: 409, description: 'Cannot delete product because there are existing warranty claims.|Data is being used now in claim processing' })
    @ApiSecurity('bearer')
    @Delete(
        ':id'
    )
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async deleteProduct(@Param('id') id: string): Promise<{ message: string, deletedProduct: Product }> {
        const product = await this.productService.deleteById(id);
        return { message: `Product ${product.name} with serial number ${product.serialNumber} has been deleted successfully`, deletedProduct: product };
    }
}
