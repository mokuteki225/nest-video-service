import { Injectable } from '@nestjs/common';

import { QueryDivider } from '../enums/query-divider.enum';
import { SelectParams } from '../interface/select-params.interface';
import { InsertParams } from '../interface/insert-params.interface';

import { DatabaseService } from './database.service';

@Injectable()
export class BaseRepository<T> {
  constructor(
    private readonly table: string,
    private readonly databaseService: DatabaseService,
  ) {}

  public async selectAll(params: SelectParams<T>) {
    const { limit = 10, offset = 0, where } = params;

    const { fields: parsedWhere, variables } = this.databaseService.parseFields(
      where,
      QueryDivider.AND,
    );

    const queryWhere = where ? ' WHERE ' + parsedWhere : '';

    const query =
      'SELECT * FROM ' +
      this.table +
      queryWhere +
      ' LIMIT ' +
      limit +
      ' OFFSET ' +
      offset;

    return this.databaseService.query<T>(query, variables);
  }

  public async insertOne<Q>(data: Q, params: InsertParams): Promise<T[]> {
    const { fields, values, variables } =
      this.databaseService.parseInsertParams(data, params);

    const query =
      'INSERT INTO ' +
      this.table +
      ' (' +
      fields +
      ') VALUES (' +
      values +
      ') RETURNING *';

    return this.databaseService.query<T>(query, variables);
  }
}
