import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

import { Pool } from 'pg';

import { DATABASE_OPTIONS } from '../constants/database.constants';

import { DatabaseOptions } from '../interface/database/database-options.interface';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private pool: Pool;

  constructor(
    @Inject(DATABASE_OPTIONS) private readonly options: DatabaseOptions,
  ) {
    this.pool = new Pool(options);
  }

  public async query<T>(query: string, variables?: any[]): Promise<T[]> {
    const { rows } = await this.pool.query<T>(query, variables);

    return rows;
  }

  public async onApplicationShutdown() {
    await this.pool.end();
  }
}
