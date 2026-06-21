import { Injectable } from '@nestjs/common';
// this controller will be able to inject into auth
@Injectable()
export class AuthService {
  signup() {
    return { msg: 'lets sign up' };
  }
  signin() {
    return { msg: 'lets sign in' };
  }
}
