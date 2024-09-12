import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUp(signUpDto ): Promise<{token : string }> {
        const { username, email, password, role } = signUpDto;
        
        const hashPassword = await bcrypt.hash(password, 10);
        
        const newUser = await this.userModel.create({
            username,
            password: hashPassword,
            role: role
        });

        const token = this.jwtService.sign({ id: newUser._id });

        return { token };
    }
}
