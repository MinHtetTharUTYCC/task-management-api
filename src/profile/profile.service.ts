import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { RequestUser } from 'src/auth/request-user.interface';
import { DatabaseService } from 'src/database/database.service';
import { AdminProfileService } from './admin-profile/admin-profile.service';
import { MemberProfileService } from './member-profile/member-profile.service';
import { ManagerProfileService } from './manager-profile/manager-profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { exclude } from 'src/utils/exclude';

@Injectable()
export class ProfileService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly adminProfileService: AdminProfileService,
        private readonly managerProfileService: ManagerProfileService,
        private readonly memberProfileService: MemberProfileService,

    ) { }

    // all users
    async getMyProfile(user: RequestUser) {
        switch (user.role as UserRole) {
            case "ADMIN":
                return this.adminProfileService.getMyProfile(user.sub)
            case "MANAGER":
                return this.managerProfileService.getMyProfile(user.sub)
            case "MEMBER":
                return this.memberProfileService.getMyProfile(user.sub)
            default:
                throw new ForbiddenException("You cannot access to this resource")
        }

    }


    //all users
    async updateMyProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<{ username: string }> {
        try {
            const conflict = await this.databaseService.user.findFirst({
                where: {
                    username: updateProfileDto.username,
                    NOT: { id }
                }
            })

            if (conflict) {
                throw new ConflictException("Username already taken. Please try another one.");
            }

            const updatedUser = await this.databaseService.user.update({
                where: { id },
                data: updateProfileDto,
                select: {
                    username: true,
                }
            })

            return { username: updatedUser.username };

        } catch (error) {
            handlePrismaError(error, "Failed to update username")
        }
    }

    async visitProfile(id: string, user: RequestUser) {
        switch (user.role as UserRole) {
            case "ADMIN":
                if (id === user.sub) {
                    return this.getMyProfile(user);
                } else {
                    return this.visitUserProfile(id)
                }
            case "MANAGER":
                if (id === user.sub) {
                    return this.getMyProfile(user);
                } else {
                    return this.visitUserProfile(id)
                }
            case "MEMBER":
                if (id === user.sub) {
                    return this.getMyProfile(user);
                } else {
                    return this.visitUserProfile(id)
                }
            default:
                throw new ForbiddenException("You cannot access to this resource")
        }

    }

    async visitUserProfile(id: string) {
        try {
            const targetUser = await this.databaseService.user.findUnique({
                where: { id },
                select: { role: true },
            })

            if (!targetUser) {
                throw new NotFoundException("User not found")
            }

            const include: Prisma.UserInclude = {};

            if (targetUser.role === "MANAGER") {
                include.projectsOwned = {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc'
                    }
                };
                include.tasksCreated = {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc'
                    }
                };
            } else if (targetUser.role === 'MEMBER') {
                include.projectsParticipating = {
                    take: 5,
                    orderBy: {
                        joinedAt: 'desc'
                    }
                };
                include.tasksAssinged = {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc'
                    }
                };
            }

            const visitUser = await this.databaseService.user.findUnique({
                where: { id },
                include,
            })
            if (!visitUser) {
                throw new NotFoundException("User not found")
            }

            return exclude(visitUser, ['password'])

        } catch (error) {
            handlePrismaError(error, "Failed to get profile")
        }

    }

}
