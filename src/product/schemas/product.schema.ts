import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Exclude, Expose } from "class-transformer";
import { USER_ROLE } from "src/auth/utils/user.enum";
import { ApiProperty } from "@nestjs/swagger";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product{

  @ApiProperty({
    example: 'Product Name',
    description: 'Name of the product'
  })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Serial number of the product'
  })
  @Prop({ required: true })
  serialNumber: string;

  @ApiProperty({
    example: 365,
    description: 'Warranty period in days(just information), not functional'
  })
  @Prop({ required: true })
  warrantyPeriodDay: number; // in days

  @ApiProperty({
    example: 'User ID',
    description: 'ID of the user staff who created the product'
  })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;
  
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

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 1, serialNumber: 1 }, { unique: true });