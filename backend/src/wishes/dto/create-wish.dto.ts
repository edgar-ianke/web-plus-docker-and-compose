import {
  IsNotEmpty,
  IsNumber,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateWishDto {
  @MinLength(1)
  @MaxLength(250)
  @ValidateIf((o) => o.name !== undefined)
  name: string;

  @IsUrl()
  @ValidateIf((o) => o.link !== undefined)
  link: string;

  @IsUrl()
  @ValidateIf((o) => o.image !== undefined)
  image: string;

  @IsNumber()
  @ValidateIf((o) => o.price !== undefined)
  price: number;

  @MinLength(1)
  @MaxLength(1024)
  @ValidateIf((o) => o.description !== undefined)
  description: string;
}
