import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';

export class CreateWarrantyClaimDto {

  @ApiProperty({
    example: 'Serial Number',
    description: 'Serial number of the product'
  })
  @IsNotEmpty()
  @IsString()
  readonly serialNumber: string;

  @ApiProperty({
    example: 'Product ID',
    description: 'ID of the product that the warranty claim is for'
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly productId: Product;

  @ApiProperty({
    example: 'Issue Description',
    description: 'Description of the issue'
  })
  @IsNotEmpty()
  @IsString()
  readonly issueDescription: string;

  @ApiProperty({
    example: 'Customer ID',
    description: 'ID of the customer who made the warranty claim'
  })
  @IsNotEmpty()
  readonly customerId: User;
  
  @IsEmpty({message: 'cannot pass resolvedAt'})
  readonly resolvedAt: Date;
  
  @IsEmpty({message: 'cannot pass staffId'})
  readonly staffId: User;
  
  @IsEmpty({message: 'cannot pass status'})
  readonly status: string;

  
  @IsEmpty({message: 'cannot pass createdAt'})
  readonly createdAt: Date;
  @IsEmpty({message: 'cannot pass updatedAt'})
  readonly updatedAt: Date;

}