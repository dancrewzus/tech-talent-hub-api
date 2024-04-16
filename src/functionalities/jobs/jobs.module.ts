import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Image, ImageSchema } from '../images/entities/image.entity';
import { Role, RoleSchema } from '../roles/entities/role.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonModule } from 'src/common/common.module';

const MODELS = [
  {
    name: Role.name,
    schema: RoleSchema
  },
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Image.name,
    schema: ImageSchema
  },
]

@Module({
  providers: [JobsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature(MODELS, 'test'),
    MongooseModule.forFeature(MODELS, 'backup'),
    MongooseModule.forFeature(MODELS, 'production'),
  ],
})
export class JobsModule {}