import { Where } from './where.interface';

export interface UpdateParams<T> {
  where: Where<T>;
  returning: boolean;
}
