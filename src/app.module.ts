import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {User} from './users/users.entity';
import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config'
const cookieSession = require('cookie-session');
const dbConfig = require('../ormconfig.js');

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }), 
    UsersModule, 
    ReportsModule, 
    TypeOrmModule.forRoot(dbConfig)
    // TypeOrmModule.forRootAsync({
    //   inject:[ConfigService],
    //   useFactory:(config:ConfigService)=>{
    //     return {
    //       type:'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities:[User,Report],
    //       synchronize:true
    //     }
    //   }
    // })
    // TypeOrmModule.forRoot({
    //   type:"sqlite",
    //   database: 'db.sqlite',
    //   entities:[User,Report],
    //   synchronize:true
    // })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:APP_PIPE,
      useValue: new ValidationPipe({
        whitelist:true
      }) 
    }
  ],
})
export class AppModule {

  constructor(private confirService:ConfigService){}

  configure(consumer: MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys:[this.confirService.get('COOKIE_KEY')]
      })
    ).forRoutes('*')
  }
}
