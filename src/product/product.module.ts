import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductSchema } from './schemas/product.schema';
import { WarrantyclaimModule } from 'src/warranty/warrantyclaim.module';
import { WarrantyClaimSchema } from 'src/warranty/schemas/warrantyclaim.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'WarrantyClaim', schema: WarrantyClaimSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
