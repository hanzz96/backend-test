import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsString} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
/**
 * expected payload from frontend
 */
export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly serialNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly warrantyPeriodDay: number;

  @IsEmpty({message: 'cannot pass userId'})
  readonly createdBy: User;
}