import { ModuleMetadata, Type } from '@nestjs/common';

import { DatabaseOptions } from './database-options.interface';
import { DatabaseOptionsFactory } from './database-options-factory.interface';

export interface DatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<DatabaseOptionsFactory>;
  useClass?: Type<DatabaseOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<DatabaseOptions> | DatabaseOptions;
}
