import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
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
      it('should throw error if email empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if password empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if no body.', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('should signup', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw error if email empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if password empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if no body', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('should signin', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .inspect()
          .stores('mytoken', 'access_token'); //save access token in my token
      });
    });
  });
});
