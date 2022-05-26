import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import * as path from 'path';

import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'graphql/schema.gql'),
    }),
    DatabaseModule.forRootAsync({
      useFactory: () => ({
        user: 'postgres',
        database: 'postgres',
        password: 'pass123',
        port: 5432,
        host: 'localhost',
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
