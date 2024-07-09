import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const password = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const user = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    return this.userRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async findByName(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findMany(input: string) {
    return await this.userRepository.find({
      where: [{ username: input }, { email: input }],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const newPassword = await this.hashService.hashPassword(
        updateUserDto.password,
      );

      updateUserDto.password = newPassword;
    }
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          throw new ConflictException('Логин или почта уже заняты');
        }
      }
    }

    return this.findOne(id);
  }

  async removeOne(id: number) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async getUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'offers', 'wishlists'],
    });
    return user.wishes;
  }
}
