import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { WarrantyclaimService } from './warrantyclaim.service';
import { USER_ROLE } from 'src/auth/utils/user.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { WarrantyClaim } from './schemas/warrantyclaim.schema';
import { CreateWarrantyClaimDto } from './dto/create-warrantyclaim.dto';

@Controller('warrantyclaim')
export class WarrantyclaimController {
    
    constructor(private warrantyService: WarrantyclaimService) { }

    @Get()
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async findByCustomer(@Req() req): Promise<WarrantyClaim[]> {
        if(req.user.role == USER_ROLE.STAFF) {
            return this.warrantyService.findAll();
        }
        
        return this.warrantyService.findByUserCustomer(req.user._id);
    }

    
    @Get(
        ':id'
    )
    @Roles(USER_ROLE.STAFF, USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async getProduct(@Param('id') id: string): Promise<WarrantyClaim> {
        const data = await this.warrantyService.findOne(id);
        return data;
    }

    
    @Post()
    @UseGuards(AuthGuard())
    @Roles(USER_ROLE.CUSTOMER)
    @UseGuards(AuthGuard(), RolesGuard)
    async create(@Body() warrantyClaim: CreateWarrantyClaimDto, @Req() req): Promise<{ message: string , data: WarrantyClaim }> {
        const res = await this.warrantyService.create(warrantyClaim, req.user);
        return res;
    }
}
