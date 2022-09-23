import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | undefined> {
    const user = await this.userService.findOne(username);

    if (user && user.password === password) {
      const result = { username: user.username, manager: user.manager };
      return result;
    }
    return null;
  }

  async login(user: IUser) {
    const payload = { username: user.username, manager: user.manager };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
