import { SpendingType } from './models/enums';
import { Spending, SpendingCategory } from '@prisma/client';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { PrismaService } from '../../core/services/prisma.service';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SpendingService {
	constructor(private prisma: PrismaService) {}

	async createSpending(createSpendingDto: CreateSpendingDto): Promise<Spending> {
		const { title, type, category: categoryName, amount, date: spendingDate, userId } = createSpendingDto;
		const date = new Date(`${spendingDate}T00:00:00.000Z`);

		try {
			if (!Object.values(SpendingType).includes(type as SpendingType)) {
				throw new HttpException('Invalid spending type', 400);
			}

			let category = await this.prisma.spendingCategory.findUnique({
				where: { name: categoryName },
			});

			if (!category) {
				category = await this.prisma.spendingCategory.create({
					data: {
						name: categoryName,
						type: type,
						userId: userId || null,
					},
				});
			} else if (category.type !== type) {
				throw new HttpException('Category type does not match spending type', 400);
			}

			const newSpending = await this.prisma.spending.create({
				data: {
					title,
					type,
					amount,
					date,
					userId,
					spendingCategoryId: category.id,
					category: category.name,
				},
				include: {
					spendingCategory: true,
				},
			});

			return newSpending;
		} catch (error: any) {
			if (error.code === 'P2003') {
				throw new NotFoundException('User not found');
			}

			throw new HttpException(error.message, error.status || 500);
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

	async getSpendingByType(
		userId: number,
		spendingType: SpendingType,
		fromDate: string,
		toDate: string
	): Promise<Spending[]> {
		try {
			const fromDateTime = `${fromDate}T00:00:00`;
			const toDateTime = `${toDate}T23:59:59`;

			const dateCondition =
				fromDate === toDate
					? { date: new Date(fromDateTime) }
					: { date: { gte: new Date(fromDateTime), lte: new Date(toDateTime) } };

			return await this.prisma.spending.findMany({
				where: {
					userId,
					type: spendingType,
					...dateCondition,
				},
			});
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Spending with id ${userId} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async updateSpending(id: number, updateSpendingDto: UpdateSpendingDto): Promise<Spending> {
		try {
			await this.prisma.spending.findUniqueOrThrow({
				where: { id },
			});

			const date = new Date(`${updateSpendingDto.date}T00:00:00.000Z`);
			const updatedSpending = await this.prisma.spending.update({
				where: { id },
				data: {
					...updateSpendingDto,
					date: date || updateSpendingDto.date,
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

	async getSpendingCategories(userId: number, spendingType: SpendingType): Promise<SpendingCategory[]> {
		try {
			const categories = await this.prisma.spendingCategory.findMany({
				where: {
					OR: [{ userId: userId }, { userId: null }],
					type: spendingType,
				},
			});

			if (!categories.length) {
				throw new NotFoundException(
					`No spending categories found for user with ID ${userId} and type ${spendingType}`
				);
			}

			return categories;
		} catch (error) {
			throw new NotFoundException('Error fetching spending categories');
		}
	}
}
