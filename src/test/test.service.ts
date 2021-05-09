import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {

  getTest(): any {
    return {"message": "성공!!"}
  }
}
