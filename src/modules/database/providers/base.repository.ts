import { Injectable } from '@nestjs/common';

import { QueryDivider } from '../enums/query-divider.enum';

import { SelectParams } from '../interface/repository/select-params.interface';
import { InsertParams } from '../interface/repository/insert-params.interface';

import { DatabaseService } from './database.service';

@Injectable()
export class BaseRepository<T> {
  constructor(
    private readonly table: string,
    private readonly databaseService: DatabaseService,
  ) {}

  public async selectAll(params: SelectParams<T>) {
    const { limit = 10, offset = 0, where } = params;

    const { builtWhere, variables } = this.buildWhere(where);

    const query =
      'SELECT * FROM ' +
      this.table +
      builtWhere +
      ' LIMIT ' +
      limit +
      ' OFFSET ' +
      offset;

    return this.databaseService.query<T>(query, variables);
  }

  public async insertOne<Q>(data: Q, params: InsertParams): Promise<T[]> {
    const { builtFields, builtValues, variables } = this.buildInsertParams(
      data,
      params,
    );

    const query =
      'INSERT INTO ' +
      this.table +
      ' (' +
      builtFields +
      ') VALUES (' +
      builtValues +
      ') RETURNING *';

    return this.databaseService.query<T>(query, variables);
  }

  /**
   *  Formats where keys to string 'key1 = $1 AND key2 = $2'
   *
   *  Returns formatted string and array of variables data[key]
   */
  private buildWhere(where: Partial<T>, order = 0) {
    const fields = [];
    const variables = [];

    for (const key in where) {
      const value = where[key];

      fields.push(`${key} = ${++order}`);
      variables.push(value);
    }

    const builtWhere = ' WHERE ' + fields.join(' AND ');

    return { builtWhere, variables };
  }

  /**
   * Formats data keys to string 'key1, key2' (fields) and creates a string '$1, $2' (values)
   *
   * Returns formatted fields/values strings and arrays of variables data[key]
   */
  private buildInsertParams(data: any, params: InsertParams) {
    const fields = [];
    const values = [];
    const variables = [];

    let order = 0;

    for (const key in data) {
      const value = data[key];

      fields.push(key);
      values.push(`$${++order}`);
      variables.push(value);
    }

    const builtFields = fields.join(', ');
    const builtValues = values.join(', ');

    const result = { builtFields, builtValues, variables };

    return result;
  }
}
