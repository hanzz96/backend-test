import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';
import { WARRANTY_CLAIM_STATUS } from '../utils/approval.enum';

export class ApproveWarrantyClaimDto {
  
  @IsMongoId()
  @IsNotEmpty()
  readonly productId: Product;
  
  @IsNotEmpty()
  @IsEnum(WARRANTY_CLAIM_STATUS, { message: 'Please enter a valid approval status' })
  readonly status: string;

}