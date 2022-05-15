import { Injectable } from '@nestjs/common';

import { SelectParams } from '../../../shared/interfaces/select-params.interface';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { User } from '../models/user.model';

import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(params: SelectParams) {
    const { limit = 10, offset = 0 } = params;

    const query = `SELECT * FROM public.user LIMIT ${limit} OFFSET ${offset}`;

    return this.databaseService.query<User>(query);
  }

  public async createOneById(dto: CreateUserDto) {
    const fields = [];
    const values = [];

    const keys = Object.keys(dto);

    for (let i = 1; i <= keys.length; i++) {
      const key = keys[i];

      fields.push(key);
      values.push(dto[key]);
    }

    const valueIndexes = values.map((value, index) => index);

    const parsedFields = fields.join(', ');
    const parsedValueIndexes = valueIndexes.join(', ');

    const query =
      'INSERT INTO public.user' +
      ' (' +
      parsedFields +
      ') VALUES (' +
      parsedValueIndexes +
      ') RETURNING *;';

    return this.databaseService.query<User>(query, values);
  }

  public async updateOneById(id: string, dto: UpdateUserDto) {
    const fields = [];
    const values = [];

    const keys = Object.keys(dto);

    for (let i = 1; i <= keys.length; i++) {
      const key = keys[i];

      fields.push(`${key} = $${i}`);
      values.push(dto[key]);
    }
    values.push(id);

    const parsedFields = fields.join(', ');
    const idIndex = keys.length + 1;

    const query =
      'UPDATE public.user SET' + parsedFields + 'WHERE id = $' + idIndex;

    return this.databaseService.query(query, values);
  }

  public async deleteOneById() {}
}
