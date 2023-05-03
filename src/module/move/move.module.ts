import { Module } from '@nestjs/common';
import { MoveController } from './move.controller';
import { MoveService } from './move.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
    }),
  ],
  controllers: [MoveController],
  providers: [MoveService],
})
export class MoveModule {}
