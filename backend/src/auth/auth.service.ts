import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByName(username);
    if (user) {
      const matched = await this.hashService.comparePasswords(
        password,
        user.password,
      );
      if (matched) {
        delete user.password;
        return user;
      } else {
        throw new UnauthorizedException('Неверные логин или пароль');
      }
    }
    throw new UnauthorizedException('Неверные логин или пароль');
  }
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
