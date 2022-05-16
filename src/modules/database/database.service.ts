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

  public async query<T>(query: string, values?: any[]): Promise<T[]> {
    const { rows } = await this.pool.query<T>(query, values);

    return rows;
  }

  public fieldsToParsedQueryWithValues(obj: any) {
    const fields = [];
    const values = [];

    const keys = Object.keys(obj);

    for (let i = 1; i <= keys.length; i++) {
      const key = keys[i];

      fields.push(`${key} = $${i}`);
      values.push(obj[key]);
    }

    const parsedFields = fields.join(', ');

    return { fields: parsedFields, values };
  }

  public async onApplicationShutdown() {
    await this.pool.end();
  }
}
