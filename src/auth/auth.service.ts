import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  // Core Logic

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { username, password } = authLoginDto;

    const user = await this.usersService.findByUsername({ username: username });

    if (!user) {
      throw new NotFoundException("USER NOT FOUND")
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async createRefreshToken(user: any) {
    const ms = require('basic-ms');
    const expiredAt = new Date();
    expiredAt.toLocaleDateString();
    expiredAt.setSeconds(
      expiredAt.getSeconds() + ms(process.env.JWT_REFRESH_EXPIRE) / 1000,
    );

    const _token = uuidv4();
    const token = await this.prisma.user_token.create({
      data: {
        token: _token,
        expiryDate: expiredAt,
        userId: user,
      },
    });

    return token.token;
  }

  // Main controller

  async refreshToken(data: { token: string }) {
    const refresh_token = await this.prisma.user_token.findUnique({
      where: {
        token: data.token,
      },
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: refresh_token.userId,
      },
    });
    if (!refresh_token) throw new NotFoundException('refresh token not founds');

    const verify = refresh_token.expiryDate.getTime() < new Date().getTime();
    if (verify) throw new ForbiddenException('refresh token expired');

    const payload = {
      id: refresh_token.userId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: data.token,
      user: user,
    };
  }

  async login(authLoginDto: AuthLoginDto) {
    console.log(authLoginDto)
    const user = await this.validateUser(authLoginDto);
    delete user.password;

    const payload = {
      id: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.createRefreshToken(user.id),
      user: user,
    };
  }

  async logout(data: { refresh_token: string }) {
    const token = await this.prisma.user_token.delete({
      where: {
        token: data.refresh_token,
      },
    });

    return { message: 'token revoked' };
  }
}
