import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: User },
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  findTop() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne(+id);
    if (req.user.id !== wish.owner.id) {
      throw new HttpException(
        'У вас нет прав на данную операцию',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const wish = await this.wishesService.findOne(+id);
    if (req.user.id !== wish.owner.id) {
      throw new HttpException(
        'У вас нет прав на данную операцию',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.wishesService.remove(+id);
  }
  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return this.wishesService.copyWish(+id, req.user.id);
  }
}
