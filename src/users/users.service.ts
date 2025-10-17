import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetUsersDto } from './dto/get-users.dto';
import { NotificationType, Prisma, UserRole } from '@prisma/client';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaginatedUserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly notificationService: NotificationsService
    ) { }

    //Admin
    async getAllUsers(getUsersDto: GetUsersDto, userId: string): Promise<PaginatedUserResponse> {
        const { page = 1, pageSize = 10, role, sortBy } = getUsersDto;
        const skip = (page - 1) * pageSize;

        const where: Prisma.UserWhereInput = {
            ...(role ? { role: getUsersDto.role } : { role: { not: 'ADMIN' } }),
            ...{ id: { not: userId } }
        }

        try {
            const [users, total] = await Promise.all([
                this.databaseService.user.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: {
                        createdAt: sortBy ?? "desc",
                    }
                }),
                this.databaseService.user.count({ where })
            ]);

            return {
                users,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch (error) {
            throw new InternalServerErrorException("Failed to get users");
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
