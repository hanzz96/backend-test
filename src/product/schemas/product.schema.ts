import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import * as MongooseDelete from 'mongoose-delete';
import { Expose } from "class-transformer";
import { USER_ROLE } from "src/auth/utils/user.enum";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true , trim: true})
  name: string;

  @Prop({ required: true })
  @Expose({ groups: [USER_ROLE.STAFF] })
  serialNumber: string;

  @Prop({ required: true })
  warrantyPeriodDay: number; // in days

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product).plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });
ProductSchema.index({ name: 1, serialNumber: 1 }, { unique: true });