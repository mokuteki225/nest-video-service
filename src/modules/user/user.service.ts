import { Injectable } from '@nestjs/common';

import { SelectParams } from '../database/interface/select-params.interface';

import { User } from './models/user.model';

import { InjectRepository } from '../database/decorators/inject-repository.decorator';

import { BaseRepository } from '../database/providers/base.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository('users')
    private readonly userRepository: BaseRepository<User>,
  ) {}

  async findAll(params: SelectParams<User>) {
    return this.userRepository.selectAll(params);
  }
}
