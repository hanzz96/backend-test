import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { USER_ROLE } from "src/utils/user.enum";
import { User } from "./user.schema";

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  serialNumber: string;

  @Prop({ required: true })
  warrantyPeriodDay: number; // in days

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);