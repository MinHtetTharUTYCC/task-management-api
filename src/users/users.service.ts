import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetUsersDto } from './dto/get-users.dto';
import { NotificationType, User, UserRole } from '@prisma/client';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { exclude } from 'src/utils/exclude';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly notificationService: NotificationsService
    ) { }

    //Admin
    async getAllUsers(getUsersDto: GetUsersDto): Promise<Omit<User, 'password'>[]> {
        try {
            const users = await this.databaseService.user.findMany({
                where: {
                    role: getUsersDto.role
                        ?
                        getUsersDto.role
                        : {
                            not: 'ADMIN',
                        }
                },
                orderBy: {
                    createdAt: getUsersDto.sortBy ?? "desc",
                }
            });

            const usersWithoutPwd = users.map(user => exclude(user, ['password']))
            console.log("www:", usersWithoutPwd)
            return usersWithoutPwd;

        } catch (error) {
            throw new InternalServerErrorException("Failed to get users")

        }
    }

    // Admin
    async updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<UserRole> {
        try {
            const existingUser = await this.databaseService.user.findUnique({
                where: {
                    id
                },
                select: { id: true }
            });
            if (!existingUser) {
                throw new NotFoundException("User not found")
            }

            const result = await this.databaseService.$transaction(async (tx) => {
                await tx.user.update({
                    where: { id },
                    data: updateUserRoleDto
                })

                const notification = await this.notificationService.createNotification({
                    message: `Admin changed your role to ${updateUserRoleDto.role}`,
                    type: NotificationType.ROLE_CHANGED,
                    link: `/profile/${existingUser.id}`,
                    userId: existingUser.id
                })

                return { role: updateUserRoleDto.role, notification }
            });

            await this.notificationService.createNotification(result.notification)

            return result.role;

        } catch (error) {
            handlePrismaError(error, "Failed to get users")
        }
    }

}
