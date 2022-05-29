export interface UpdateParams<T> {
  where: Partial<T>;
  returning: boolean;
}
