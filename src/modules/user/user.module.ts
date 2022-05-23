import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { UserController } from './user.controller';

import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule.forFeature({ table: 'users' })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
