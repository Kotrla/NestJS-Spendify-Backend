import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
	let controller: UsersController;

	beforeAll(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				PrismaService,
				{
					provide: JwtService, // 💡 add jwt service here
					useValue: {
						signAsync: jest.fn(), // 💡 mock signAsync method
					},
				},
			],
		}).compile();

		controller = app.get<UsersController>(UsersController);
	});

	it('should be defined"', () => {
		expect(controller).toBeDefined();
	});

	describe('users controller', () => {
		describe('registerUser method', () => {
			it('should register new user', async () => {
				const newUser = {
					email: 'test@user.com',
					name: 'Test User',
					password: 'password',
				};

				const mockRegisterResponse: User = {
					id: 1,
					email: 'test@user.com',
					name: 'Test User',
					password: 'password',
				};

				delete mockRegisterResponse.password;

				jest.spyOn(controller, 'registerUser').mockResolvedValue(mockRegisterResponse);

				const result = await controller.registerUser(newUser);

				expect(result).toEqual(mockRegisterResponse);
			});

			it('should throw error if email already registered', async () => {
				const registeredUser = {
					email: 'registered@user.com',
					name: 'Registered User',
					password: 'password',
				};

				jest.spyOn(controller, 'registerUser').mockRejectedValue(new ConflictException());

				const register = controller.registerUser(registeredUser);

				await expect(register).rejects.toThrow(ConflictException);
			});

			it('should throw error if required fields is missing', async () => {
				jest.spyOn(controller, 'registerUser').mockRejectedValue(new BadRequestException());

				const register = controller.registerUser(null);

				await expect(register).rejects.toThrow(BadRequestException);
			});
		});

		describe('loginUser method', () => {
			it('should login user', async () => {
				const mockLoginResponse = {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyey',
				};

				jest.spyOn(controller, 'loginUser').mockResolvedValue(mockLoginResponse);

				const result = await controller.loginUser({
					email: 'some@user.com',
					password: 'password',
				});

				expect(result).toEqual(mockLoginResponse);
				expect(result.access_token).toBeDefined();
			});

			it('should throw error if email is wrong', async () => {
				const wrongEmail = {
					email: 'wrong@user.com',
					password: 'password',
				};

				jest.spyOn(controller, 'loginUser').mockRejectedValue(new NotFoundException());

				const login = controller.loginUser(wrongEmail);

				await expect(login).rejects.toThrow(NotFoundException);
			});
		});

		describe('userDetails method', () => {
			it('should return my profile', async () => {
				const mockMyProfileResponse = {
					sub: 5,
					email: 'superb-2@api.com',
					name: 'Super Api 2',
					iat: 1698562521,
					exp: 1698605721,
				};

				jest.spyOn(controller, 'userDetails').mockImplementation(() => {
					return mockMyProfileResponse;
				});

				const result = controller.userDetails(null);

				expect(result).toEqual(mockMyProfileResponse);
				expect(result).toHaveProperty('sub');
				expect(result).toHaveProperty('email');
				expect(result).toHaveProperty('iat');
				expect(result).toHaveProperty('exp');
			});
		});

		describe('updateUser method', () => {
			it('should update user', async () => {
				const mockUpdateResponse = {
					id: 1,
					email: 'update@user.com',
					name: 'Update User',
					password: 'password',
				};

				delete mockUpdateResponse.password;

				jest.spyOn(controller, 'updateUser').mockResolvedValue(mockUpdateResponse);

				const result = await controller.updateUser(1, {
					email: 'update@user.com',
					name: 'Update User',
					password: 'password',
				});

				expect(result).toEqual(mockUpdateResponse);
			});

			it('should throw error if user not found', async () => {
				const mockUpdateResponse = {
					id: 1,
					email: 'notfound@test.com',
					name: 'Not Found',
					password: 'password',
				};

				jest.spyOn(controller, 'updateUser').mockRejectedValue(new NotFoundException());

				const update = controller.updateUser(1, mockUpdateResponse);

				await expect(update).rejects.toThrow(NotFoundException);
			});
		});

		describe('deleteUser method', () => {
			it('should delete user', async () => {
				const mockDeleteResponse = 'User deleted';

				jest.spyOn(controller, 'deleteUser').mockResolvedValue(mockDeleteResponse);

				const result = await controller.deleteUser(1);

				expect(result).toEqual(mockDeleteResponse);
			});

			it('should throw error if user not found', async () => {
				jest.spyOn(controller, 'deleteUser').mockRejectedValue(new NotFoundException());

				const deleteUser = controller.deleteUser(1);

				await expect(deleteUser).rejects.toThrow(NotFoundException);
			});
		});
	});
});
