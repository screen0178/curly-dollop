import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { ArusKasModule } from './arus-kas/arus-kas.module';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CompanyModule,
    ArusKasModule,
  ],
})
export class AppModule {}
