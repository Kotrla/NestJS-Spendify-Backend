import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './common/guards/auth.guard';
import { UsersModule } from './modules/users/users.module';
import { SpendingModule } from './modules/spending/spending.module';
import { InvestmentsModule } from './modules/investments/investments.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: process.env['NODE_ENV'] ? `.env.${process.env['NODE_ENV']}` : '.env',
			isGlobal: true,
		}),
		UsersModule,
		SpendingModule,
		InvestmentsModule,
		CoreModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '12h' },
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
