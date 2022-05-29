import { Provider } from '@nestjs/common';

import { DATABASE_FEATURE } from '../constants/database.constants';

import { DatabaseFeature } from '../interface/database/database-feature.interface';

import { BaseRepository } from './base.repository';

import { DatabaseService } from './database.service';

export const setDatabaseFeatureToken = (table: string) => {
  return `${DATABASE_FEATURE} ${table}`;
};

export const createDatabaseProviders = (
  feature: DatabaseFeature,
): Provider[] => {
  const token = setDatabaseFeatureToken(feature.table);

  return [
    {
      provide: token,
      useFactory: (databaseService: DatabaseService) => {
        return new BaseRepository(feature.table, databaseService);
      },
      inject: [DatabaseService],
    },
  ];
};
