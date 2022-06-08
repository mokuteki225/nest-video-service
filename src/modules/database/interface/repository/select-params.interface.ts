import { Where } from './where.interface';

export interface SelectParams<T> {
  limit?: number;
  offset?: number;
  where?: Where<T>;
}
