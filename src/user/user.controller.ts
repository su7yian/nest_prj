import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../decorator/index';
import type { User } from '../generated/prisma/client';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  // we cannot extarct the user injected by guard from request so we use param decorator that returns a user which acts a sour param.
  getMe(@GetUser() user: User) {
    // getMe(@GetUser('email') email: string) { return email;} // you can extract specific fields from the user too and use param name.
    return user;
  }
}
