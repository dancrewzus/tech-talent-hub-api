import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { UserDataController } from './user-data.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserData, UserDataSchema } from './entities/user-data.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ UserDataController ],
  providers: [ UserDataService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: UserData.name,
        schema: UserDataSchema
      },
    ])
  ],
  exports: [ UserDataService ]
})
export class UserDataModule {}
