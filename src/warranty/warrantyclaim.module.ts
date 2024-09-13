import { Module } from '@nestjs/common';
import { WarrantyclaimService } from './warrantyclaim.service';
import { WarrantyclaimController } from './warrantyclaim.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { WarrantyClaimSchema } from './schemas/warrantyclaim.schema';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'WarrantyClaim', schema: WarrantyClaimSchema }]),
    ProductModule
  ],
  controllers: [WarrantyclaimController],
  providers: [WarrantyclaimService],
  exports: [WarrantyclaimService]
})
export class WarrantyclaimModule {}

