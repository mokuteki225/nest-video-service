import { Injectable } from '@nestjs/common';

import { QueryDivider } from '../enums/query-divider.enum';

import { SelectParams } from '../interface/repository/select-params.interface';
import { InsertParams } from '../interface/repository/insert-params.interface';
import { UpdateParams } from '../interface/repository/update-params.interface';
import { DeleteParams } from '../interface/repository/delete-params.interface';
import { PartialEntity } from '../interface/repository/partial-entity.interface';

import { DatabaseService } from './database.service';

@Injectable()
export class BaseRepository<Entity> {
  constructor(
    private readonly table: string,
    private readonly databaseService: DatabaseService,
  ) {}

  public async selectAll(params: SelectParams<Entity>) {
    const { builtWhere, builtOffset, builtLimit, variables } =
      this.buildSelectParams(params);

    const query =
      'SELECT * FROM ' + this.table + builtWhere + builtLimit + builtOffset;

    return this.databaseService.query<Entity>(query, variables);
  }

  public async insertOne(
    data: PartialEntity<Entity>,
    params?: InsertParams,
  ): Promise<Entity[]> {
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

    return this.databaseService.query<Entity>(query, variables);
  }

  public async updateOne(data: Partial<Entity>, params: UpdateParams<Entity>) {
    const { builtFields, builtWhere, builtReturning, variables } =
      this.buildUpdateParams(data, params);

    const query =
      'UPDATE ' +
      this.table +
      ' SET ' +
      builtFields +
      builtWhere +
      builtReturning;

    console.log(query, variables);

    return this.databaseService.query<Entity>(query, variables);
  }

  public async deleteOne(params: DeleteParams<Entity>) {
    const { builtWhere, variables } = this.buildDeleteParams(params);

    const query = 'DELETE FROM ' + this.table + builtWhere;

    return this.databaseService.query<Entity>(query, variables);
  }

  private buildSelectParams(params: SelectParams<Entity>) {
    const { builtWhere, variables } = this.buildWhere(params.where);
    const builtLimit = this.buildLimit(params.limit);
    const builtOffset = this.buildOffset(params.offset);

    const result = { builtWhere, builtLimit, builtOffset, variables };

    return result;
  }

  private buildInsertParams(data: PartialEntity<Entity>, params: InsertParams) {
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

  private buildUpdateParams(
    data: PartialEntity<Entity>,
    params: UpdateParams<Entity>,
  ) {
    const { where, returning } = params;

    const { builtFields, variables } = this.buildFields(data);
    const { builtWhere, variables: whereVariables } = this.buildWhere(
      where,
      variables.length,
    );
    const builtReturning = returning && this.buildReturning(returning);

    const builtVariables = [...variables, ...whereVariables];

    const result = {
      builtFields,
      builtWhere,
      builtReturning,
      variables: builtVariables,
    };

    return result;
  }

  private buildDeleteParams(params: DeleteParams<Entity>) {
    const { where } = params;

    const { builtWhere, variables } = this.buildWhere(where);

    const result = { builtWhere, variables };

    return result;
  }

  /**
   *  Formats data keys to string 'key1 = $1, key2 = $2'
   *
   *  Returns formatted string and array of variables data[key]
   */
  private buildFields(data: Partial<Entity>) {
    const fields = [];
    const variables = [];

    let order = 0;

    for (const key in data) {
      const value = data[key];

      fields.push(`${key} = $${++order}`);
      variables.push(value);
    }

    const builtFields = fields.join(QueryDivider.COMMA);

    return { builtFields, variables };
  }

  /**
   *  Formats where keys to string 'key1 = $1 AND key2 = $2'
   *
   *  Returns formatted string and array of variables data[key]
   */
  private buildWhere(where: PartialEntity<Entity>, order = 0) {
    const fields = [];
    const variables = [];

    for (const key in where) {
      const value = where[key];

      fields.push(`${key} = $${++order}`);
      variables.push(value);
    }

    const builtWhere = ' WHERE ' + fields.join(QueryDivider.AND);

    return { builtWhere, variables };
  }

  /**
   *  Returns ' RETURNING *;' or an empty string depending on returning param
   */
  private buildReturning(returning = false) {
    const builtReturning = returning ? ' RETURNING *;' : '';

    return builtReturning;
  }

  /**
   *  Returns built limit
   */
  private buildLimit(limit = 10) {
    const builtLimit = ' LIMIT ' + limit;

    return builtLimit;
  }

  /**
   *  Returns built offset
   */
  private buildOffset(offset = 0) {
    const builtOffset = ' OFFSET ' + offset;

    return builtOffset;
  }
}
