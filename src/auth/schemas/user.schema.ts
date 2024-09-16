import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { USER_ROLE } from "src/auth/utils/user.enum";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema({
    timestamps: true
})
export class User extends Document{
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

    @ApiProperty({
        example: 'johndoe',
        description: 'Username of the user'
    })
    @Prop({ required: true, unique: true })
    username: string;

    @ApiProperty({
        example: 'johndoe',
        description: 'Hash Passwrod of the user'
    })
    @Prop({ required: true , select: false})
    password: string;

    @ApiProperty({
        example: 'staff',
        description: 'Role of the user'
    })
    @Prop({ required: true, enum: USER_ROLE })
    role: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);