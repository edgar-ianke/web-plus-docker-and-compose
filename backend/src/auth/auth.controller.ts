import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const userEmail = await this.usersService.findByEmail(createUserDto.email);
    const userName = await this.usersService.findByName(createUserDto.username);
    if (userEmail || userName) {
      throw new BadRequestException('Пользователь уже существует');
    }
    const user = await this.usersService.create(createUserDto);

    return this.authService.login(user);
  }
}
