import { IsNumber, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  name: string;

  @IsUrl()
  image: string;

  @IsNumber({}, { each: true })
  itemsId: number[];
}
