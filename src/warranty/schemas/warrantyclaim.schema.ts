import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';
import { WARRANTY_CLAIM_STATUS } from '../utils/approval.enum';

export type WarrantyClaimDocument = WarrantyClaim & Document;

@Schema({ timestamps: true })
export class WarrantyClaim {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: User;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Product;

  @Prop({ required: true, trim: true })
  serialNumber: string;

  @Prop({ required: true })
  issueDescription: string;

  @Prop({ default: 'pending', enum: WARRANTY_CLAIM_STATUS })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  staffId: User;

  @Prop({ default: null })
  resolvedAt: Date;
}

export const WarrantyClaimSchema = SchemaFactory.createForClass(WarrantyClaim);