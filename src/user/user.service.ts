import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  async editUser(userId: number, dto: EditUserDto) {
    // takes data to update.
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      // unpack all values from dto and pass them to data or rows of specifc user id.
      data: { ...dto },
    });
    return updatedUser;
  }
}
