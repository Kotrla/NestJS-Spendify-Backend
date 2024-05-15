import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { AuthGuard } from './common/guards/auth.guard';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		UsersModule,
		CoreModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '12h' },
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
