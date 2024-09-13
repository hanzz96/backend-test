import { IsEmail, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';

export class CreateWarrantyClaimDto {
  @IsNotEmpty()
  @IsString()
  readonly serialNumber: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly productId: Product;

  @IsNotEmpty()
  @IsString()
  readonly issueDescription: string;

  @IsNotEmpty()
  readonly customerId: User;
  
  @IsEmpty({message: 'cannot pass resolvedAt'})
  readonly resolvedAt: Date;
  
  @IsEmpty({message: 'cannot pass staffId'})
  readonly staffId: User;
  
  @IsEmpty({message: 'cannot pass status'})
  readonly status: string;

}