import { Injectable } from '@nestjs/common';

import { SelectParams } from '../../shared/interfaces/select-params.interface';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findAll(params: SelectParams) {
    return this.userRepository.findAll(params);
  }

  public async createOne(dto: CreateUserDto) {
    return this.userRepository.createOneById(dto);
  }

  public async updateOne(id: string, dto: UpdateUserDto) {
    return this.userRepository.updateOneById(id, dto);
  }
}
