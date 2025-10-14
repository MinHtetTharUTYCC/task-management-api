import { UserRole } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator";

export class GetUsersDto {
    @IsOptional()
    @IsIn([UserRole.MANAGER, UserRole.MEMBER], {
        message: "role must be either Manager or Member"
    })
    role?: UserRole;

    @IsOptional()
    @IsIn(['desc', "asc"])
    sortBy?: "desc" | "asc"


}