import { DatabaseOptions } from './database-options.interface';

export interface DatabaseOptionsFactory {
  createDatabaseOptions(): Promise<DatabaseOptions> | DatabaseOptions;
}
