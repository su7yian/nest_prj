import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../dto/index';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
//so we are telling a fucntion to create a new class out of built in base class named passport strategy
// pass strategy to the fucntion passport strategy and save ti as myjwt then create a custom class jwtstretegy fot this custom strategy
export class JwtStrategy extends PassportStrategy(Strategy, 'myJwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }
  // after extrating the jwt teh passport library auto adds payload to validate fucntion when calling.
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
