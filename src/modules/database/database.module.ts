import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Pool } from 'pg';

import { POSTGRES_POOL } from './constansts/database.constant';

import { PostgresOptions } from './interfaces/postgres-options.interface';

import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: POSTGRES_POOL,
      useFactory: (config: ConfigService): Pool => {
        const options: PostgresOptions = {
          user: config.get<string>('POSTGRES_USER'),
          database: config.get<string>('POSTGRES_DB'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          port: config.get<number>('POSTGRES_PORT'),
          host: config.get<string>('POSTGRES_HOST'),
        };

        return new Pool(options);
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
