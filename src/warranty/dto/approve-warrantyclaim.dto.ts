import { IsDate, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';
import { WARRANTY_CLAIM_STATUS } from '../utils/approval.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveWarrantyClaimDto {
  
  @ApiProperty({
    example: 'approved',
    description: 'Status of the warranty claim'
  })
  @IsNotEmpty()
  @IsEnum(WARRANTY_CLAIM_STATUS, { message: 'Please enter a valid approval status' })
  readonly status: string;

  
  @IsEmpty({message: 'cannot pass createdAt'})
  readonly createdAt: Date;
  @IsEmpty({message: 'cannot pass updatedAt'})
  readonly updatedAt: Date;

}