import { Inject, Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import { POSTGRES_POOL } from './constansts/database.constant';

@Injectable()
export class DatabaseService {
  constructor(@Inject(POSTGRES_POOL) private readonly pool: Pool) {}

  public async query<T>(query: string, variables?: any[]): Promise<T[]> {
    const { rows } = await this.pool.query<T>(query, variables);

    return rows;
  }

  public async onApplicationShutdown() {
    await this.pool.end();
  }
}
