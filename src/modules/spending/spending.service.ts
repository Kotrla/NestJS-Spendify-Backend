import { Spending } from '@prisma/client';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { PrismaService } from '../../core/services/prisma.service';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SpendingService {
	constructor(private prisma: PrismaService) {}

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
			const spending = await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			return spending;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async updateSpending(id: number, updateSpendingDto: UpdateSpendingDto): Promise<Spending> {
		try {
			await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			const updatedSpending = await this.prisma.spending.update({
				where: { id },
				data: {
					...updateSpendingDto,
				},
			});

			return updatedSpending;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async deleteSpending(id: number): Promise<string> {
		try {
			const Spending = await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			await this.prisma.spending.delete({
				where: { id },
			});

			return `Spending with id ${Spending.id} deleted`;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}
}
