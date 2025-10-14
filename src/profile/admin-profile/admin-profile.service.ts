import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RequestUser } from 'src/auth/request-user.interface';
import { DatabaseService } from 'src/database/database.service';
import { exclude } from 'src/utils/exclude';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class AdminProfileService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getMyProfile(id: string) {
        try {
            const user = await this.databaseService.user.findUnique({
                where: { id },
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
