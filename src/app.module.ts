import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ConsumerService } from './queue/consumer.service';
import { AppGateway } from './gateway/app.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduelrService } from './scheduler/scheduler.service';
import { ChainModule } from './module/chain/chain.module';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'queue' }),
    ScheduleModule.forRoot(),
    ChainModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConsumerService, AppGateway, ScheduelrService],
})
export class AppModule {}
