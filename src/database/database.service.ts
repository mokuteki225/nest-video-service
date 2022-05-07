import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

import { Pool } from 'pg';

import { DATABASE_OPTIONS } from './database.constants';

import { DatabaseOptions } from './interface/database-options.interface';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private pool: Pool;

  constructor(
    @Inject(DATABASE_OPTIONS) private readonly options: DatabaseOptions,
  ) {
    this.pool = new Pool(options);
  }

  async query(query: string) {
    return this.pool.query(query);
  }

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
