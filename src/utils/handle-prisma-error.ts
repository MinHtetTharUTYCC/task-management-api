import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";


export function handlePrismaError(error: any, contextMessage = "Operation failed"): never {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                throw new ConflictException(`${contextMessage}: Duplicate field value`);
            case 'P2025':
                throw new NotFoundException(`${contextMessage}: Record not found`);
            default:
                throw new BadRequestException(`${contextMessage}: ${error.message}`);
        }
    }

    // so, Known NestJS exceptions (rethrow them)
    if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
    ) {
        throw error;
    }

    //fallback - unknown error
    throw new InternalServerErrorException(`${contextMessage}`);

}