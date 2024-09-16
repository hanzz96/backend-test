import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';
import { WARRANTY_CLAIM_STATUS } from '../utils/approval.enum';
import { ApiProperty } from '@nestjs/swagger';

export type WarrantyClaimDocument = WarrantyClaim & Document;

@Schema({ timestamps: true })
export class WarrantyClaim {
  @ApiProperty({
    example: 'User ID',
    description: 'ID of the user customer who created the warranty claim'
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: User;

  @ApiProperty({
    example: 'Product ID',
    description: 'ID of the product that the warranty claim is for'
  })
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Product;

  @ApiProperty({
    example: 'Serial Number',
    description: 'Serial number of the product'
  })
  @Prop({ required: true, trim: true })
  serialNumber: string;

  @ApiProperty({
    example: 'Issue Description',
    description: 'Description of the issue'
  })
  @Prop({ required: true })
  issueDescription: string;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the warranty claim'
  })
  @Prop({ default: 'pending', enum: WARRANTY_CLAIM_STATUS })
  status: string;

  @ApiProperty({
    example: 'User ID',
    description: 'ID of the staff who is handling the warranty claim'
  })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  staffId: User;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Resolved at, default is null if approved/rejected will set to current date'
  })
  @Prop({ default: null })
  resolvedAt: Date;

  
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at'
  })
  updatedAt: Date;

}

export const WarrantyClaimSchema = SchemaFactory.createForClass(WarrantyClaim);