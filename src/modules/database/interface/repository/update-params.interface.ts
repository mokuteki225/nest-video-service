import { PartialEntity } from './partial-entity.interface';

export interface UpdateParams<Entity> {
  where: PartialEntity<Entity>;
  returning?: boolean;
}
