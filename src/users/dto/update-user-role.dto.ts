import { IsEnum, IsIn, IsNotEmpty } from "class-validator";
import { UserRole } from "@prisma/client";

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRole)
    @IsIn([UserRole.MANAGER, UserRole.MEMBER], {
        message: "role must be either Manager or Member"
    })
    role: UserRole;
}