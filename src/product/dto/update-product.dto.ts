import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsString, Min} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
/**
 * expected payload from frontend
 */
export class UpdateProductDto {

  @ApiProperty({
    example: 'Product Name',
    description: 'Update Name of the product'
  })  
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Update Serial number of the product'
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly serialNumber: string;

  @ApiProperty({
    example: 365,
    description: 'Update Warranty period in days'
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  readonly warrantyPeriodDay: number;

  @IsEmpty({message: 'cannot pass userId'})
  readonly createdBy: User;
  @IsEmpty({message: 'cannot pass createdAt'})
  readonly createdAt: Date;
  @IsEmpty({message: 'cannot pass updatedAt'})
  readonly updatedAt: Date;
}