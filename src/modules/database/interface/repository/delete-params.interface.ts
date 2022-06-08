import { PartialEntity } from './partial-entity.interface';

export interface DeleteParams<Entity> {
  where: PartialEntity<Entity>;
}
