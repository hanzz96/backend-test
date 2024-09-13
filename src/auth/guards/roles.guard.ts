import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_ROLE } from "src/auth/utils/user.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles){
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // return matchRoles(requiredRoles, user?.role);
        return requiredRoles.some((role) => user.role === role);
    }
}

function matchRoles(requiredRoles: USER_ROLE[], userRole: USER_ROLE){
    return requiredRoles.some((role) => userRole === role);
}