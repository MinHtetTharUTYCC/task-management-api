import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // No roles required, allow access
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.role || !requiredRoles.includes(user.role)) {
            // return false; // User role not authorized
            throw new ForbiddenException(`Access denied: ${user?.role || 'No Role'} role cannot access this resource`);
        }

        return true;
    }


}