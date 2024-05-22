import {
	ConflictException,
	HttpException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Spending } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/services/prisma.service';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';

@Injectable()
export class SpendingService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async createSpending(createSpendingDto: CreateSpendingDto): Promise<Spending> {
		try {
			const { title, type, category, amount, date, userId } = createSpendingDto;

			const newSpending = await this.prisma.spending.create({
				data: { title, type, category, amount, date, userId },
			});

			return newSpending;
		} catch (error: any) {
			if (error.code === 'P2003') {
				throw new NotFoundException('User not found');
			}

			// throw error if any
			throw new HttpException(error, 500);
		}
	}

	async getAllUserSpendings(userId: number): Promise<Spending[]> {
		const spendings = await this.prisma.spending.findMany({
			where: { userId },
		});

		return spendings;
	}

	async getSpendingById(id: number): Promise<Spending> {
		try {
			// find Spending by id. If not found, throw error
			const Spending = await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			return Spending;
		} catch (error: any) {
			// check if Spending not found and throw error
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			// throw error if any
			throw new HttpException(error, 500);
		}
	}

	async updateSpending(id: number, updateSpendingDto: UpdateSpendingDto): Promise<Spending> {
		try {
			// find Spending by id. If not found, throw error
			await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			// update Spending using prisma client
			const updatedSpending = await this.prisma.spending.update({
				where: { id },
				data: {
					...updateSpendingDto,
				},
			});

			return updatedSpending;
		} catch (error: any) {
			// check if Spending not found and throw error
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			// throw error if any
			throw new HttpException(error, 500);
		}
	}

	async deleteSpending(id: number): Promise<string> {
		try {
			// find Spending by id. If not found, throw error
			const Spending = await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			// delete Spending using prisma client
			await this.prisma.spending.delete({
				where: { id },
			});

			return `Spending with id ${Spending.id} deleted`;
		} catch (error: any) {
			// check if Spending not found and throw error
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			// throw error if any
			throw new HttpException(error, 500);
		}
	}
}
