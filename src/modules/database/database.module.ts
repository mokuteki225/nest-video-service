import { DynamicModule, Global, Module } from '@nestjs/common';

import { DATABASE_OPTIONS } from './database.constants';

import { DatabaseOptions } from './interface/database-options.interface';
import { DatabaseFeature } from './interface/database-feature.interface';
import { DatabaseModuleAsyncOptions } from './interface/database-module-async-options.interface';

import { createDatabaseProviders } from './providers/database.provider';

import { DatabaseService } from './providers/database.service';

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

  public static forRootAsync(
    options: DatabaseModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }

  public static forFeature(feature: DatabaseFeature): DynamicModule {
    const providers = createDatabaseProviders(feature);

    return {
      module: DatabaseModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
