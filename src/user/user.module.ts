import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { UserAuthMiddleware } from 'src/middlewares/user-auth.middleare';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .exclude(
        {
          path: "user",
          method: RequestMethod.POST,
        },
        {
          path: "user/signin",
          method: RequestMethod.POST,
        }
      )
      .forRoutes(UserController);
  }
}
