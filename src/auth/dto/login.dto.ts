import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../utils/user.enum';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

}