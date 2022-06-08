import { Injectable } from '@nestjs/common';

import { SelectParams } from '../database/interface/repository/select-params.interface';
import { CreateUserDto } from './dto/create-user.dto';

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

  async createOne(data: CreateUserDto) {
    return this.userRepository.insertOne(data);
  }
}
