import { Body, Controller, Post } from '@nestjs/common';
import { MoveService } from './move.service';

@Controller('move')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post('move')
  async move(@Body() body: { charId: String; direction: String }) {
    await this.moveService.addMove(body);
  }
}
