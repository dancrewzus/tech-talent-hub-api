import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Track, TrackSchema } from './entities/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ TracksController ],
  providers: [ TracksService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema
      },
    ], 'default')
  ],
  exports: [ TracksService ],
})
export class TracksModule {}
