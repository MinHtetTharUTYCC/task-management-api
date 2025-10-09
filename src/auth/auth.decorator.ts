import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { RoleGuard } from "./role.guard";
import { AuthGuard } from "./auth.guard";

export function Auth(...roles: string[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RoleGuard)
    )
}