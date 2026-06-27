import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

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
      it('should throw error if no body', async () => {
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

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get no bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{mytoken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'test bookmark',
        link: 'https://www.google.com',
      };
      it('should create bookmark', async () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('get bookmarks', () => {
      it('should get bookmarks', async () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('get bookmark by id', () => {
      it('should get bookmark by id', async () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('edit bookmark', () => {
      const dto: EditBookmarkDto = {
        title: 'updated',
        link: 'x.com',
      };
      it('should edit bookmark', async () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link);
      });
    });
    describe('delete bookmark', () => {
      it('should delete bookmark', async () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{mytoken}` })
          .expectStatus(200);
      });
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{mytoken}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
