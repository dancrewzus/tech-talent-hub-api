import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// import { Department, DepartmentSchema } from '../projects/entities/department.entity';
// import { Context, ContextSchema } from './entities/context.entity';
import { Message, MessageSchema } from './entities/message.entity';
import { Thread, ThreadSchema } from './entities/thread.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [
    ChatController
  ],
  providers: [
    ChatService,
  ],
  imports: [
    CommonModule,
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema
      },
      {
        name: Thread.name,
        schema: ThreadSchema
      },
    ], 'default')
  ],
  exports: [
    ChatService,
  ]
})
export class ChatModule {}
