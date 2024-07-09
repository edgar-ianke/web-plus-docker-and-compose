import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId) {
    const user = await this.usersService.findOne(userId);
    const item = await this.wishesService.findOne(createOfferDto.itemId);
    if (item.owner.id === userId) {
      throw new BadRequestException(
        'Нельзя скидываться на собственные подарки',
      );
    }
    const itemRaised = item.raised + createOfferDto.amount;
    if (itemRaised > item.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    await this.wishesService.update(item.id, { raised: itemRaised });
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user,
      item,
    });
    return await this.offersRepository.save(offer);
  }

  async findAll() {
    return await this.offersRepository.find({ relations: ['user', 'item'] });
  }

  async findOne(id: number) {
    return await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
  }
}
