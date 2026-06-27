import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import { GetUser } from '../decorator';
import type { User } from '../generated/prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }
  @Get('me')
  // we cannot extarct the user injected by guard from request so we use param decorator that returns a user which acts a sour param.
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch()
  // you can extract specific fields from the user too and use param name.
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
