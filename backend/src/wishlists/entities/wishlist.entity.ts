import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
