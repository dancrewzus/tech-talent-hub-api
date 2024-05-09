import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ RolesController ],
  providers: [ RolesService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
  ],
  exports: [ RolesService ],
})
export class RolesModule {}
