import { Body, Controller, Get, Param, Patch, Query, ValidationPipe } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/auth.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Auth('ADMIN')
    @Get()
    async getAllUsers(@Query(ValidationPipe) getUsersDto: GetUsersDto) {
        return this.usersService.getAllUsers(getUsersDto)
    }

    @Auth('ADMIN')
    @Patch(':id')
    async updateUserRole(@Param() id: string, @Body(ValidationPipe) updateUserRoleDto: UpdateUserRoleDto) {
        await this.usersService.updateUserRole(id, updateUserRoleDto)

    }

}
