import { Body, Controller, Get, Param, Patch, Query, ValidationPipe } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/auth.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedUserResponse } from './dto/user-response.dto';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Auth('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Get all users', description: "Return all users for admin" })
    @ApiResponse({ status: 200, description: "Users retrieved", type: PaginatedUserResponse })
    async getAllUsers(@Query(ValidationPipe) getUsersDto: GetUsersDto, @ReqUser() user: RequestUser): Promise<PaginatedUserResponse> {
        return this.usersService.getAllUsers(getUsersDto, user.sub)
    }

    @Auth('ADMIN')
    @Patch(':id')
    async updateUserRole(@Param() id: string, @Body(ValidationPipe) updateUserRoleDto: UpdateUserRoleDto) {
        await this.usersService.updateUserRole(id, updateUserRoleDto)

    }

}
