import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Notification, NotificationSchema } from '../notifications/entities/notification.entity';
import { Image, ImageSchema } from '../images/entities/image.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { Role, RoleSchema } from '../roles/entities/role.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'

const MODELS = [
  {
    name: Notification.name,
    schema: NotificationSchema
  },
  {
    name: Track.name,
    schema: TrackSchema
  },
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