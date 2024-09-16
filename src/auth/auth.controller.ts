import { Body, Controller, Get, Post, Req, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { Roles } from './decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { USER_ROLE } from './utils/user.enum';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiTags('Auth')
    @ApiResponse({
        status: 201, description: 'A Message User successfully signed up', schema: {
            properties: {
                message: {
                    type: 'string'
                }
            }
        }
    })
    @ApiResponse({
        status: 409, description: 'User already exists', schema: {
            properties: {
                message: {
                    type: 'string'
                },
                error: {
                    type: 'string'
                }
            }
        }
    })
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
        const result = await this.authService.signUp(signUpDto);
        return result;
    }
    
    @ApiTags('Auth')
    @ApiResponse({
        status: 200, description: 'A Message User successfully logged in', schema: {
            properties: {
                token: {
                    type: 'string'
                },
                expiresIn: {
                    type: 'number'
                }
            }
        }
    })
    @ApiResponse({
        status: 401, description: 'Invalid username or password', schema: {
            properties: {
                message: {
                    type: 'string'
                }
            }
        }
    })
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string, expiresIn: number }> {
        return this.authService.login(loginDto);
    }

    @ApiTags('Auth')
    @ApiResponse({
        status: 200, description: 'User information', type: User
    })
    @Get('info')
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    infoUser(@Req() req): Promise<{ info: User }> {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.info(token);
    }
}
