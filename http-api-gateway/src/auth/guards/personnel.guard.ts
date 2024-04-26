import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PersonnelGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('user', user);
    if (user.personnelId) return true;
    return false;
  }
}
