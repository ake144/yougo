import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Res, 
  Req, 
  HttpCode, 
  HttpStatus, 
  UnauthorizedException,
  UseGuards,
  Param
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const COOKIE_NAME = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(loginDto);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { user };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.verify(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.verify(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const newToken = await this.authService.refreshToken(user.id);
    
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, newToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { ok: true };
  }

  @Get('validate/:userId')
  async validateUser(@Param('userId') userId: string) {
    const user = await this.authService.validateUser(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user };
  }
} 