import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

@Module({
  imports: [

    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      connectionName: 'default',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoConnection'),
        dbName: configService.get<string>('mongoDatabase'),
      }),
      inject: [ ConfigService ],
    }),
    
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      connectionName: 'test',
      useFactory: async (configService: ConfigService) => ({        
        uri: configService.get<string>('mongoConnectionTest'),
      }),
      inject: [ ConfigService ],
    }),

    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      connectionName: 'production',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoConnectionProd'),
      }),
      inject: [ ConfigService ],
    }),
    
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      connectionName: 'backup',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoConnectionBackup'),
      }),
      inject: [ ConfigService ],
    }),

  ],
})
export class DatabaseModule {}