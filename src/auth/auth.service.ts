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
  ) {}

  // Core Logic

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { username, password } = authLoginDto;

    const user = await this.usersService.findByUsername({ username: username });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async createRefreshToken(user: any) {
    const ms = require('basic-ms');
    const expiredAt = new Date();
    expiredAt.toLocaleDateString('id-ID');
    expiredAt.setSeconds(
      expiredAt.getSeconds() + ms(process.env.JWT_REFRESH_EXPIRE),
    );

    const _token = uuidv4();
    let token = await this.prisma.user_token.findUnique({
      where: {
        userId: user,
      },
    });

    if (!token) {
      token = await this.prisma.user_token.create({
        data: {
          token: _token,
          expiryDate: expiredAt,
          userId: user,
        },
      });
    } else {
      token = await this.prisma.user_token.update({
        where: { userId: user },
        data: { token: _token, expiryDate: expiredAt },
      });
    }

    return token.token;
  }

  // Main controller

  async refreshToken(data: { token: string }) {
    const refresh_token = await this.prisma.user_token.findUnique({
      where: {
        token: data.token,
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
      refresh_token: await this.createRefreshToken(refresh_token.userId),
    };
  }

  async login(authLoginDto: AuthLoginDto) {
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
    console.log(data.refresh_token);
    const token = await this.prisma.user_token.delete({
      where: {
        token: data.refresh_token,
      },
    });

    console.log(token);
  }
}
