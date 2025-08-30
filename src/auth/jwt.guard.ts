import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.verify(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user to request for use in controllers
    request.user = user;
    return true;
  }
} 