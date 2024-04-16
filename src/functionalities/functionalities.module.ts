import { Module } from '@nestjs/common'

// import { ImagesModule } from './images/images.module'
// import { RolesModule } from './roles/roles.module'
// import { UsersModule } from './users/users.module'
// import { SeedModule } from './seed/seed.module'
import { ChatModule } from './chat/chat.module'

@Module({
  imports: [
    // SeedModule,
    // RolesModule,
    // UsersModule,
    ChatModule,
    // ImagesModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
