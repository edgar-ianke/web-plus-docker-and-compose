import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

export default () => ({
  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'edgar',
    password: process.env.DB_PASSWORD || 'edgar',
    database: process.env.DB_NAME || 'kupipodaridai',
    entities: [User, Wish, Offer, Wishlist],
    synchronize: true,
  },
  jwt_secret: process.env.JWT_SECRET || 'some-secret-key',
});
