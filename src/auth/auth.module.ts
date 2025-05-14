import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ], // Assuming you have entities to import
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
