import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {User} from './users/users.entity';
import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }), 
    UsersModule, 
    ReportsModule, 
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return {
          type:'sqlite',
          database: config.get<string>('DB_NAME'),
          entities:[User,Report],
          synchronize:true
        }
      }
    })
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
  configure(consumer: MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys:['']
      })
    ).forRoutes('*')
  }
}
