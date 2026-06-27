import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userid: userId,
      },
    });
  }
  async getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userid: userId,
      },
    });
  }
  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userid: userId,
      },
    });
    if (!bookmark) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
        userid: userId,
      },
      data: {
        ...dto,
      },
    });
  }
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userid: userId,
        ...dto,
      },
    });
  }
  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId, // id is always unique among book marks
      },
    });
    // although id is unique , but a malicious user could delete any bookmark by guessing/ stealing the id
    if (!bookmark || bookmark.userid !== userId)
      throw new ForbiddenException('Access to resources denied');
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userid: userId,
      },
    });
  }
}
