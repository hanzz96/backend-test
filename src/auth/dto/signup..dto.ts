import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../../utils/user.enum';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(USER_ROLE, { message: 'Please enter a valid role' })
  readonly role: USER_ROLE;
}