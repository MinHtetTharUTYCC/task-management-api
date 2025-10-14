import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { exclude } from 'src/utils/exclude';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class ManagerProfileService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getMyProfile(id: string) {
        try {
            const user = await this.databaseService.user.findUnique({
                where: { id },
                include: {
                    projectsOwned: {
                        take: 5,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    comments: {
                        take: 5,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            })

            if (!user) {
                throw new NotFoundException("User not found")
            }

            return exclude(user, ['password'])

        } catch (error) {
            handlePrismaError(error, "Failed to get profile")
        }
    }


}
