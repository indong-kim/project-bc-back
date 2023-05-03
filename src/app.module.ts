import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ConsumerService } from './queue/consumer.service';
import { MoveModule } from './module/move/move.module';
import { LoginModule } from './module/login/login.module';
import { AppGateway } from './gateway/app.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduelrService } from './scheduler/scheduler.service';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'queue' }),
    MoveModule,
    LoginModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ConsumerService, AppGateway, ScheduelrService],
})
export class AppModule {}
