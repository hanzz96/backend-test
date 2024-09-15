import { Transform } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString, Min} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
/**
 * expected payload from frontend
 */
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly serialNumber: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  readonly warrantyPeriodDay: number;

  @IsEmpty({message: 'cannot pass userId'})
  readonly createdBy: User;
}