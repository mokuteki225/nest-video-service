import { Injectable } from '@nestjs/common';

import { SelectParams } from '../../shared/interfaces/select-params.interface';

import { User } from './models/user.model';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(params: SelectParams) {
    const { limit = 10, offset = 0 } = params;

    const query = `SELECT * FROM public.user LIMIT ${limit} OFFSET ${offset}`;

    return this.databaseService.query<User>(query);
  }
}
