import {
	ConflictException,
	HttpException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUsertDto } from './dtos/update-user.dto';
import { PrismaService } from '../../core/services/prisma.service';
import { ILoginResponse, IUserPayload } from './models/users-login.model';

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async registerUser(createUserDto: CreateUserDto): Promise<User> {
		try {
			const newUser = await this.prisma.user.create({
				data: {
					email: createUserDto.email,
					password: await hash(createUserDto.password, process.env.SALT),
					name: createUserDto.name,
				},
			});

			delete newUser.password;

			return newUser;
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictException('Email already registered');
			}

			throw new HttpException(error, 500);
		}
	}

	async loginUser(loginUserDto: LoginUserDto): Promise<ILoginResponse> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email: loginUserDto.email },
			});

			if (!user) {
				throw new NotFoundException('User not found');
			}

			if (!(await compare(loginUserDto.password, user.password))) {
				throw new UnauthorizedException('Invalid credentials');
			}

			const payload: IUserPayload = {
				sub: user.id,
				email: user.email,
				name: user.name,
			};

			return {
				access_token: await this.jwtService.signAsync(payload),
			};
		} catch (error) {
			throw new HttpException(error, 500);
		}
	}

	async updateUser(id: number, updateUserDto: UpdateUsertDto): Promise<User> {
		try {
			await this.prisma.user.findUniqueOrThrow({
				where: { id },
			});

			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: {
					...updateUserDto,
					...(updateUserDto.password && {
						password: await hash(updateUserDto.password, 10),
					}),
				},
			});

			delete updatedUser.password;

			return updatedUser;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`User with id ${id} not found`);
			}

			if (error.code === 'P2002') {
				throw new ConflictException('Email already registered');
			}

			throw new HttpException(error, 500);
		}
	}

	async deleteUser(id: number): Promise<string> {
		try {
			const user = await this.prisma.user.findUniqueOrThrow({
				where: { id },
			});

			await this.prisma.user.delete({
				where: { id },
			});

			return `User with id ${user.id} deleted`;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`User with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}
}
