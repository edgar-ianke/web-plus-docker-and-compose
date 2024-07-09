import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @Min(1)
  price: number;

  @Column({ type: 'float', default: 0.0 })
  raised: number;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ default: 0 })
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
