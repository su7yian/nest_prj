import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
//so we are using a fucntion auth guard to create a new class out of built in base class named jwt auth guard
// The Job of 'myJwt': It tells the guard: "When an HTTP request arrives, open the global registry map, find the strategy saved under the key "myJwt", and run its validation code."
export class JwtAuthGuard extends AuthGuard('myJwt') {
  constructor() {
    super();
  }
}
