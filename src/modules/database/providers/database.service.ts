import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

import { Pool } from 'pg';

import { DATABASE_OPTIONS } from '../database.constants';

import { QueryDivider } from '../enums/query-divider.enum';
import { DatabaseOptions } from '../interface/database-options.interface';
import { InsertParams } from '../interface/insert-params.interface';

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

  /**
   *  Formats data keys to string 'key1 = $1[divider] key2 = $2'
   *
   *  Returns formatted string and array of variables data[key]
   */
  public parseFields(data: any, divider: QueryDivider) {
    const fields = [];
    const variables = [];

    if (!data) {
      return { fields: '', variables: [] };
    }

    const keys = Object.keys(data);

    for (let i = 1; i <= keys.length; i++) {
      const key = keys[i - 1];

      fields.push(`${key} = $${i}`);
      variables.push(data[key]);
    }

    const parsedFields = fields.join(divider);

    return { fields: parsedFields, variables };
  }

  /**
   * Formats data keys to string 'key1, key2' (fields) and creates a string '$1, $2' (values)
   *
   * Returns formatted fields/values strings and arrays of variables data[key]
   */
  public parseInsertParams(data: any, params: InsertParams) {
    const fields = [];
    const values = [];
    const variables = [];

    const keys = Object.keys(data);

    for (let i = 1; i <= keys.length; i++) {
      const key = keys[i - 1];

      fields.push(key);
      values.push(`$${i}`);
      variables.push(data[key]);
    }

    const parsedFields = fields.join(', ');
    const parsedValues = values.join(', ');

    const parsedParams = {
      fields: parsedFields,
      values: parsedValues,
      variables,
    };

    return parsedParams;
  }

  public async onApplicationShutdown() {
    await this.pool.end();
  }
}
