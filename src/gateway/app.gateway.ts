import { InjectQueue } from '@nestjs/bull';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Queue } from 'bull';
import { JsonRpcProvider, ethers } from 'ethers';
import { Server } from 'socket.io';
import { clientList } from 'src/env/clients';
import { START_POSITION } from 'src/resources/start-position';

@WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectQueue('queue') private readonly moveQueue: Queue) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket, ...args: any[]) {
    console.log('hi');
    const clients = Object.keys(clientList);

    client['id'] = clients.length.toString();
    client['pos'] = START_POSITION[client['id']];

    const provider = new JsonRpcProvider();
    const wallet = ethers.Wallet.createRandom(provider);

    client['address'] = wallet.address;
    client['mnemonic'] = wallet.mnemonic.phrase;
    client['privatekey'] = wallet.privateKey;

    clientList[client['id']] = client;
  }

  handleDisconnect(client: WebSocket) {
    console.log('bye', client['id']);
    delete clientList[client['id']];
  }

  @SubscribeMessage('open')
  handleOpen(client: any, payload: any): void {
    console.log(`id = ${client['id']} user connect`);
    client.send(
      JSON.stringify({
        event: 'connection-established',
        id: client['id'],
        pos: client['pos'],
      }),
    );
    //나머지 클라들한테 새로운 아이가 들어왓다고 보내야됨
    const newUser: string = JSON.stringify({
      event: 'new-user',
      id: client['id'],
      pos: client['pos'],
    });
    //console.log(Object.keys(clientList).length);
    for (const [id, existClient] of Object.entries<WebSocket>(clientList)) {
      if (id === client['id']) continue;
      existClient.send(newUser);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    switch (payload['event']) {
      case 'move':
        await this.moveQueue.add('move', payload, { removeOnComplete: true });
        break;
      case 'after-create':
        //exist-userlist
        //나를 제외한 모든 클라 리스트를 넘겨주면됨
        const clients: {} = {};
        for (const [id, existClient] of Object.entries<WebSocket>(clientList)) {
          if (id === client['id']) continue;
          clients[id] = existClient['pos'];
        }
        const existClientList = {
          event: 'exist-userlist',
          clients,
        };
        client.send(JSON.stringify(existClientList));
        break;
    }
  }
}
