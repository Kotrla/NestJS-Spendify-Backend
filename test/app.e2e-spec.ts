import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/modules/users/users.module';
import { SpendingModule } from '../src/modules/spending/spending.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let prismaClient: PrismaClient;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, UsersModule, SpendingModule, PrismaClient],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

		await prismaClient.$executeRaw`TRUNCATE "public"."Post" RESTART IDENTITY CASCADE;`;
		await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
	}, 30000);

	afterAll(async () => {
		await app.close();
		await prismaClient.$disconnect();
	}, 30000);

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
	});

	it('should create a user', async () => {
		const user = {
			email: 'newuser@e2e.test',
			name: 'New User',
			password: '12345678',
		};

		const response = await request(app.getHttpServer()).post('/users/register').send(user).expect(201);

		expect(response.body).toEqual({
			id: expect.any(Number),
			email: user.email,
			name: user.name,
		});
	});

	it('should login a user', async () => {
		const user = {
			email: 'newuser@e2e.test',
			password: '12345678',
		};

		const response = await request(app.getHttpServer())
			.post('/users/login')
			.send(user)

			.expect(201);

		expect(response.body).toEqual({
			access_token: expect.any(String),
		});
	});

	it('should not login a user', async () => {
		const user = {
			email: 'wronguser@e2e.test',
			password: '12345678',
		};

		const response = await request(app.getHttpServer()).post('/users/login').send(user);

		expect(response.body.message).toEqual('User not found');
		expect(response.body.status).toEqual(404);
	});
});
