import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MoveService {
  constructor(@InjectQueue('queue') private queue: Queue) {}

  async addMove(body: { charId: String; direction: String }) {
    await this.queue.add(
      'move',
      {
        body,
      },
      { removeOnComplete: true },
    );
  }
}
