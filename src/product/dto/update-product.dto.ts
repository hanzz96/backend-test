import { IsEmpty, IsNotEmpty, IsString} from 'class-validator';
import { User } from 'src/schemas/user.schema';
/**
 * expected payload from frontend
 */
export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly serialNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly warrantyPeriodDay: number;

  @IsEmpty({message: 'cannot pass userId'})
  readonly createdBy: User;
}