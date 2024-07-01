import { Investment } from '@prisma/client';
import { InvestmentType } from './models/enums';
import { PrismaService } from '../../core/services/prisma.service';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { Injectable, HttpException, NotFoundException } from '@nestjs/common';

@Injectable()
export class InvestmentsService {
	constructor(private prisma: PrismaService) {}

	async createInvestment(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
		const { title, type, currentValue, boughtValue, date: investmentDate, userId } = createInvestmentDto;
		const date = new Date(`${investmentDate}T00:00:00.000Z`);

		try {
			if (!Object.values(InvestmentType).includes(type as InvestmentType)) {
				throw new HttpException('Invalid investment type', 400);
			}

			const newInvestment = await this.prisma.investment.create({
				data: {
					title,
					type,
					currentValue,
					boughtValue,
					date,
					userId,
				},
			});

			return newInvestment;
		} catch (error: any) {
			if (error.code === 'P2003') {
				throw new NotFoundException('User not found');
			}

			throw new HttpException(error.message, error.status || 500);
		}
	}

	async getAllUserInvestments(userId: number): Promise<Investment[]> {
		const investments = await this.prisma.investment.findMany({
			where: { userId },
		});

		return investments;
	}

	async getInvestmentById(id: number): Promise<Investment> {
		try {
			const investment = await this.prisma.investment.findUniqueOrThrow({
				where: { id },
			});

			return investment;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Investment with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async getInvestmentByType(
		userId: number,
		investmentType: InvestmentType,
		fromDate: string,
		toDate: string
	): Promise<Investment[]> {
		try {
			const fromDateTime = `${fromDate}T00:00:00`;
			const toDateTime = `${toDate}T23:59:59`;

			const dateCondition =
				fromDate === toDate
					? { date: new Date(fromDateTime) }
					: { date: { gte: new Date(fromDateTime), lte: new Date(toDateTime) } };

			return await this.prisma.investment.findMany({
				where: {
					userId,
					type: investmentType,
					...dateCondition,
				},
			});
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Investment with id ${userId} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async updateInvestment(id: number, updateInvestmentDto: UpdateInvestmentDto): Promise<Investment> {
		try {
			await this.prisma.investment.findUniqueOrThrow({
				where: { id },
			});

			const date = new Date(`${updateInvestmentDto.date}T00:00:00.000Z`);
			const updatedInvestment = await this.prisma.investment.update({
				where: { id },
				data: {
					...updateInvestmentDto,
					date,
				},
			});

			return updatedInvestment;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Investment with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}

	async deleteInvestment(id: number): Promise<string> {
		try {
			const investment = await this.prisma.investment.findUniqueOrThrow({
				where: { id },
			});

			await this.prisma.investment.delete({
				where: { id },
			});

			return `Investment with id ${investment.id} deleted`;
		} catch (error: any) {
			if (error.code === 'P2025') {
				throw new NotFoundException(`Investment with id ${id} not found`);
			}

			throw new HttpException(error, 500);
		}
	}
}
