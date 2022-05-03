import { DynamicModule, Global, Module } from '@nestjs/common';

import { DATABASE_OPTIONS } from './database.constants';

import { DatabaseOptions } from './interface/database-options.interface';

import { DatabaseService } from './database.service';

@Global()
@Module({})
export class DatabaseModule {
  public static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_OPTIONS,
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
