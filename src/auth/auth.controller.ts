import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
// post controller etc are built in decorators tht we import from @nestjs/common
@Controller('auth') // decorator takes a funciton or class and returns modifeid version of it. when code is compiled to js the decorator from ts are convered to modifer fucntion that has wrapper function the outer modifer take origional function or class and adds the decorator functiosn logic inside wrapper fucntiona nd returns new mdofied wrapper.
export class AuthController {
  constructor(private authService: AuthService) { } // weak relation aggregation, pointing our data member authservice of auth controller class to Auth service imported
  @Post('signup') // decoators can also take params that are passed to modifer function's wrapper that are created later.
  signup() {
    return this.authService.signup();
  }
  @Post('signin') // auth/signin
  signin() {
    return this.authService.signin();
  }
}
