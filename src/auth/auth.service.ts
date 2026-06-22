import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// this controller will be able to inject into auth
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  signup() {
    return { msg: 'lets sign up' };
  }
  signin() {
    return { msg: 'lets sign in' };
  }
}
