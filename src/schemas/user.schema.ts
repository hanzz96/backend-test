import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { USER_ROLE } from "src/utils/user.enum";

@Schema({
    timestamps: true
})
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: USER_ROLE })
    role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);