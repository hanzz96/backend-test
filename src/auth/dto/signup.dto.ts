import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../utils/user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  
  @ApiProperty({
    example: 'what was your username',
    description: 'username unique'
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: 'yourpasswordwaswhat',
    description: 'whatever it is minimum 6 characters'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  
  @IsNotEmpty()
  @IsEnum(USER_ROLE, { message: 'Please enter a valid role' })
  readonly role: USER_ROLE;
}