export interface SelectParams<T> {
  limit?: number;
  offset?: number;
  where?: Partial<T>;
}
