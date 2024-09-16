import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { WarrantyclaimService } from './warrantyclaim.service';
import { USER_ROLE } from 'src/auth/utils/user.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { WarrantyClaim } from './schemas/warrantyclaim.schema';
import { CreateWarrantyClaimDto } from './dto/create-warrantyclaim.dto';
import { ApproveWarrantyClaimDto } from './dto/approve-warrantyclaim.dto';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags, getSchemaPath } from '@nestjs/swagger';

@Controller('warrantyclaim')
export class WarrantyclaimController {

    constructor(private warrantyService: WarrantyclaimService) { }

    @ApiTags('Warranty Claim')
    @ApiResponse({
        status: 200, description: 'Get all warranty claims, if user is staff, get all claims, if user is customer, get claims by user. if customer cannot see serial number original from product',
        schema: {
            properties: {
                claims: {
                    type: 'array',
                    items: { $ref: getSchemaPath(WarrantyClaim) }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiSecurity('bearer')
    @Get()
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async findByCustomer(@Req() req): Promise<{ claims: WarrantyClaim[] }> {
        let listClaims = [];
        if (req.user.role == USER_ROLE.STAFF) {
            listClaims = await this.warrantyService.findAll();
            return { claims: listClaims };
        }
        listClaims = await this.warrantyService.findByUserCustomer(req.user._id);
        return { claims: listClaims };
    }

    @ApiTags('Warranty Claim')
    @ApiResponse({
        status: 200, description: 'Get warranty claim by id of user', schema: {
            properties: {
                claim: { $ref: getSchemaPath(WarrantyClaim) }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Warranty Claim not found' })
    @ApiSecurity('bearer')
    @Get(
        ':id'
    )
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async getClaimById(@Param('id') id: string, @Req() req): Promise<{ claim: WarrantyClaim }> {
        const data = await this.warrantyService.findOne(id, req.user);
        return { claim: data };
    }

    @ApiTags('Warranty Claim')
    @ApiResponse({
        status: 200, description: 'Create warranty claim', schema: {
            properties: {
                message: { type: 'string' },
                data: { $ref: getSchemaPath(WarrantyClaim) }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized, Customer only' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Product not found|Warranty Claim is used by other customer|Warranty Claim for this product still on Pending..|Serial Number not match' })
    @ApiSecurity('bearer')
    @Post()
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async create(@Body() warrantyClaim: CreateWarrantyClaimDto, @Req() req): Promise<{ message: string, data: WarrantyClaim }> {
        const res = await this.warrantyService.create(warrantyClaim, req.user);
        return { message: 'Warranty claim created successfully', data: res };
    }

    @ApiTags('Warranty Claim')
    @ApiResponse({
        status: 200, description: 'Action warranty claim', schema: {
            properties: {
                message: { type: 'string' },
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized, staff only' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Warranty Claim not found|Warranty Claim already approved|Warranty Claim already rejected' })
    @ApiResponse({ status: 409, description: 'Warranty Claim is being processed by other staff | or the product is trying to be deleted concurrently' })
    @ApiSecurity('bearer')
    @Put('approval/:id')
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.STAFF)
    @UseGuards(AuthGuard(), RolesGuard)
    async actionClaim(@Param('id') id: string, @Body() warrantyClaim: ApproveWarrantyClaimDto, @Req() req): Promise<{ message: string }> {

        await this.warrantyService.actionClaim(id, warrantyClaim, req.user);
        return { message: 'Warranty claim action successfully' };
    }
}
