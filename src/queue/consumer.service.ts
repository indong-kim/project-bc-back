import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { clientList } from 'src/env/clients';

@Processor('queue')
export class ConsumerService {
  @Process('move')
  async processMove(job: Job<unknown>) {
    const targetClient = clientList[job.data['id']];
    const pos: { x: number; y: number } = targetClient['pos']; //{x:3,y:3}
    switch (job.data['direction']) {
      case 'left':
        pos.x -= 1;
        break;
      case 'right':
        pos.x += 1;
        break;
      case 'up':
        pos.y -= 1;
        break;
      case 'down':
        pos.y += 1;
        break;
    }
  }
}
