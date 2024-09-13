import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUp(signUpDto: SignUpDto ): Promise<{message : string }> {
        const { username, password, role } = signUpDto;
        
        const hashPassword = await bcrypt.hash(password, 10);
        
        await this.userModel.create({
            username,
            password: hashPassword,
            role: role
        });

        return { message: 'Success' };
    }

    async login(loginDto: LoginDto): Promise<{ token: string, expiresIn: number }> {
        const { username, password } = loginDto;

        const user = await this.userModel.findOne({ username : username }).select('+password');

        if (!user) {
            throw new UnauthorizedException('Invalid username');
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid Password');
        }

        const token = this.jwtService.sign({ id: user._id });
        const expiresIn = this.jwtService.decode(token)['exp'];

        return { token, expiresIn };
    }

    async info(token: string): Promise<{ info: User }> {
        const decoded = this.jwtService.decode(token);
        const user = await this.userModel.findById(decoded.id);
        return {info: user};
    }
}
