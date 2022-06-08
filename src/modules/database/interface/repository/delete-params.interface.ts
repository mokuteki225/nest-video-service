import { Where } from './where.interface';

export interface DeleteParams<T> {
  where: Where<T>;
}
