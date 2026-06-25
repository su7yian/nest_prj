import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../generated/prisma/client';
export const GetUser = createParamDecorator(
  // This data keyof user restricts what you are allowed to pass into the decorator. It ensures you only ask for real database columns.
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    // the request is collected from the modifed request by auth guards's passport strategy. so now request has the user attached to it.
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return undefined;
    }
    // the type unknown means check type it exists but between conditions if data is passed then keyof User, else if not then User else undefined. Unlike any it creates a strict constraint on what will be returned.
    return (data ? request.user[data] : request.user) as unknown;
  },
);
