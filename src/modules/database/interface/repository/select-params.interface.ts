import { PartialEntity } from './partial-entity.interface';

export interface SelectParams<Entity> {
  limit?: number;
  offset?: number;
  where?: PartialEntity<Entity>;
}
