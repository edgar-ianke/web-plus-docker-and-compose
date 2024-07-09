import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, userId) {
    const items = await this.wishesService.findByIds(createWishlistDto.itemsId);
    const user = await this.usersService.findOne(userId);
    const wishlist = await this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });
    return await this.wishlistsRepository.save(wishlist);
  }
  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['items', 'owner'],
    });
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, userId) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('У вас нет прав на данную операцию');
    }
    await this.wishlistsRepository.update(id, updateWishlistDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const wishlist = await this.findOne(id);
    return this.wishlistsRepository.remove(wishlist);
  }
}
