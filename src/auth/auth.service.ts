import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, JwtPayload } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// this controller will be able to inject into auth
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) { }

  async signup(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        /*   select: {
            id: true,
            email: true,
            createdAt: true,
            }, }); return user */
      });
      return this.signToken(user.id, user.email); //calling signToken to generate JWT
      console.log('Singnup successfull!');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user not found, throw forbidden exception
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    // if password is invalid, throw forbidden exception
    const isPasswordValid = await argon2.verify(user.hash, dto.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email); //calling signToken to generate JWT
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const Secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: Secret,
    });
    return {
      access_token: token,
    };
  }
}
