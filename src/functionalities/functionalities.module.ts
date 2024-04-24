import { Module } from '@nestjs/common'

import { ImagesModule } from './images/images.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SeedModule } from './seed/seed.module'
import { ChatModule } from './chat/chat.module'
import { LogsModule } from './logs/logs.module'

@Module({
  imports: [
    LogsModule,
    SeedModule,
    RolesModule,
    UsersModule,
    ImagesModule,
    ChatModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
