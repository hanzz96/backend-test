import { Module } from '@nestjs/common';
import { WarrantyclaimService } from './warrantyclaim.service';
import { WarrantyclaimController } from './warrantyclaim.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { WarrantyClaimSchema } from './schemas/warrantyclaim.schema';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from 'src/_common/cache.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'WarrantyClaim', schema: WarrantyClaimSchema }]),
    ProductModule,
    CacheModule.register()
  ],
  controllers: [WarrantyclaimController],
  providers: [WarrantyclaimService, CacheService],
  exports: [WarrantyclaimService]
})
export class WarrantyclaimModule {}

