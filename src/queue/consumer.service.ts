import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { clientList } from 'src/env/clients';
import { JsonRpcProvider, ethers } from 'ethers';
import abi from 'src/env/abi';

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

    if (pos.x === 13 && pos.y === 7) {
      console.log('mission success!');
      await this.minting(targetClient['address']);
    }
  }

  private async minting(address: string) {
    console.log(address);
    const provider = new JsonRpcProvider('http://localhost:8545', { chainId: 1337, name: 'local' });
    const signer = new ethers.Wallet('8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63', provider);
    const contract = new ethers.Contract('0x4245CF4518CB2C280f5e9c6a03c90C147F80B4d9', abi, signer);

    const tx = await contract.mintNFT(address, 'www.naver.com');
    const { events } = await tx.wait();
    const { args } = events.find((e: any) => e.event === 'Transfer');
    const newItemId = args[2];
    console.log(newItemId);
    console.log('minting success');
  }
}
