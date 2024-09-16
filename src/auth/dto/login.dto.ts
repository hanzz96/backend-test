import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../utils/user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'johan',
    description: 'username unique'
  })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'yourpassword',
    description: 'whatever it is minimum 6 characters'
  })
  readonly password: string;

}