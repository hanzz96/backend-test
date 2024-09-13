import { Body, Controller, Get, Post, Req, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { Roles } from './decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { USER_ROLE } from './utils/user.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
        const result = await this.authService.signUp(signUpDto);
        return result;
    }

    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string, expiresIn: number }> {
        return this.authService.login(loginDto);
    }
    
    @Get('info')
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    infoUser(@Req() req): Promise<{ info: User }> {
        console.log(req.user, req.headers.authorization);
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.info(token);
    }
}
