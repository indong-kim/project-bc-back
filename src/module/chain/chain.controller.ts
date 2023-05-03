import { Controller, Get, Param } from '@nestjs/common';
import { clientList } from 'src/env/clients';

@Controller('chain')
export class ChainController {
  @Get(':id')
  getInfo(@Param() reqID: any) {
    const client = clientList[reqID.id];
    return {
      address: client.address,
      mnemonic: client.mnemonic,
      privatekey: client.privatekey,
    };
  }
}
