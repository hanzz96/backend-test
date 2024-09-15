import { Module } from '@nestjs/common';
import { WarrantyclaimService } from './warrantyclaim.service';
import { WarrantyclaimController } from './warrantyclaim.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { WarrantyClaimSchema } from './schemas/warrantyclaim.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from 'src/_common/cache.service';
import { ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'WarrantyClaim', schema: WarrantyClaimSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    CacheModule.register()
  ],
  controllers: [WarrantyclaimController],
  providers: [WarrantyclaimService, CacheService],
  exports: [WarrantyclaimService]
})
export class WarrantyclaimModule {}

