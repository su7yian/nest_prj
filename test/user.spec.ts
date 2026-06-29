import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.CleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: 'sufy@gmail.com', password: '123' };
    describe('Signup', () => {
      it('should signup', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .stores('mytoken', 'access_token');
      });
    });
  });
  describe('User', () => {
    const dto: EditUserDto = {
      firstName: 'sufyian',
      email: 'sufyian@gmail.com',
    };
    describe('get me', () => {
      it('should get me', async () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .expectStatus(200);
      });
    });
    describe('edit user', () => {
      it('should edit user', async () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
});
