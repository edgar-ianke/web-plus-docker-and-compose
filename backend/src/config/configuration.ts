import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

export default () => ({
  database: {
    type: 'postgres' as const,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'edgar',
    password: process.env.POSTGRES_PASSWORD || 'edgar',
    database: process.env.POSTGRES_DB || 'kupipodaridai',
    entities: [User, Wish, Offer, Wishlist],
    synchronize: true,
  },
  jwt_secret: process.env.JWT_SECRET || 'some-secret-key',
});
