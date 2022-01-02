import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data.password, salt);

    data.password = hash;

    const user = this.prisma.user.create({
      data,
    });

    return user;
  }

  async findAll() {
    const user = this.prisma.user.findMany();

    return user;
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = this.prisma.user.findUnique({
      where,
      include: {
        Arus_kas: true,
        company: true,
      },
    });

    return user;
  }

  async findByUsername(where: Prisma.UserWhereUniqueInput) {
    const user = this.prisma.user.findUnique({
      where,
    });

    return user;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    const user = this.prisma.user.update({
      where,
      data,
    });

    return user;
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    const user = this.prisma.user.delete({
      where,
    });

    return user;
  }
}
