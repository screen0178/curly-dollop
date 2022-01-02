import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('signout/:refresh_token')
  async logout(@Param() token: { refresh_token: string }) {
    return this.authService.logout(token);
  }

  @Post('refresh/:token')
  async refresh(@Param() token: { token: string }) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async test() {
    return { login: 'success' };
  }
}
