import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { MailerModule } from './mailer/mailer.module';
import { MailerController } from './mailer/mailer.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [CommonModule, AuthModule, UserModule, MailerModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { method: RequestMethod.GET, path: 'auth/google/callback' },
        { method: RequestMethod.GET, path: 'auth/google' },
        { method: RequestMethod.GET, path: 'auth/facebook/callback' },
        { method: RequestMethod.GET, path: 'auth/facebook' },
        { method: RequestMethod.POST, path: 'auth/signin' },
        { method: RequestMethod.POST, path: 'auth/signup' },
        { method: RequestMethod.GET, path: 'auth/verification' },
      )
      .forRoutes(AuthController, UserController, MailerController, DashboardController)
  }
}
