import { Body, Controller, Post } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Post('info')
  async info(@Body() body) {
    //접속정보 저장하기
  }
}
