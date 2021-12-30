import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      id: 1,
      name: 'arkan',
      username: 'ark',
      password: '123456',
    },
    {
      id: 2,
      name: 'zhafari',
      username: 'zha',
      password: '123456',
    },
  ];

  async findOne(username: string): Promise<UserDto | undefined> {
    return this.users.find((el) => el.username === username);
  }
}
