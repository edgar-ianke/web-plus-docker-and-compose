import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ValidateIf((o) => o.username !== undefined)
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsEmail()
  @ValidateIf((o) => o.email !== undefined)
  email: string;

  password: string;

  @IsOptional()
  @IsUrl()
  @ValidateIf((o) => o.avatar !== undefined)
  avatar?: string;

  @IsOptional()
  about?: string;
}
