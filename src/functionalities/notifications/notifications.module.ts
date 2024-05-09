import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Notification, NotificationSchema } from './entities/notification.entity'
import { NotificationsController } from './notifications.controller'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { NotificationsService } from './notifications.service'
import { CommonModule } from 'src/common/common.module'
import { RolesModule } from '../roles/roles.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    AuthModule,
    RolesModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema
      },
      {
        name: Notification.name,
        schema: NotificationSchema
      },
    ], 'default')
  ], 
})
export class NotificationsModule {}
