import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { clientList } from 'src/env/clients';

@Injectable()
export class ScheduelrService {
  @Cron(CronExpression.EVERY_SECOND)
  sendStatus() {
    const clientSnapshot = Object.assign({}, clientList); //그냥해봄
    //const clientCount = Object.keys(clientSnapshot).length;
    //console.log(`client count is = ${clientCount}`);
    const result = {};
    for (const [key, value] of Object.entries<WebSocket>(clientSnapshot)) {
      //key - id , value client - websocket
      result[value['id']] = {
        pos: value['pos'],
      };
    }

    for (const [key, value] of Object.entries<WebSocket>(clientSnapshot)) {
      const data = JSON.stringify({
        event: 'move',
        result,
      });
      value.send(data);
    }
    //각 클라한테 모든정보를 보내야 한다 그래야 남 캐릭터까지 다 그린다
  }
}
