import { Injectable } from '@nestjs/common';

import { SelectParams } from '../interface/select-params.interface';

import { DatabaseService } from './database.service';

@Injectable()
export class BaseRepository<T> {
  constructor(
    private readonly table: string,
    private readonly databaseService: DatabaseService,
  ) {}

  public async selectAll(params: SelectParams<T>) {
    const { limit = 10, offset = 0, where } = params;

    const { fields: parsedWhere, values } =
      this.databaseService.fieldsToParsedQueryWithValues(where);

    const queryWhere = where ? 'WHERE ' + parsedWhere : '';

    const query =
      'SELECT * FROM' +
      this.table +
      queryWhere +
      'LIMIT' +
      limit +
      'OFFSET' +
      offset;

    return this.databaseService.query<T>(query, values);
  }
}
