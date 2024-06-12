import { SpendingType } from './models/enums';
import { SpendingService } from './spending.service';
import { SelfGuard } from '../../common/guards/self.guard';
import { Spending, SpendingCategory } from '@prisma/client';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { IExpressRequestWithUser } from '../users/models/express-request-with-user.model';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';

@Controller('spending')
export class SpendingController {
	constructor(private readonly spendingService: SpendingService) {}

	@Get('/categories')
	@UseGuards(SelfGuard)
	async getSpendingCategories(
		@Query('spendingType') spendingType: SpendingType,
		@Request() req: IExpressRequestWithUser
	): Promise<SpendingCategory[]> {
		const userId = req.user.id;
		return this.spendingService.getSpendingCategories(userId, spendingType);
	}

	@Get('/byType')
	@UseGuards(SelfGuard)
	async getSpendingsByType(
		@Query('spendingType') spendingType: SpendingType,
		@Query('fromDate') fromDate: string,
		@Query('toDate') toDate: string,
		@Request() req: IExpressRequestWithUser
	): Promise<Spending[]> {
		const userId = req.user.id;

		return this.spendingService.getSpendingByType(userId, spendingType, fromDate, toDate);
	}

	@Post()
	async createSpending(
		@Body() createSpendingDto: CreateSpendingDto,
		@Request() req: IExpressRequestWithUser
	): Promise<Spending> {
		createSpendingDto.userId = req.user.id;
		return this.spendingService.createSpending(createSpendingDto);
	}

	@Get()
	@UseGuards(SelfGuard)
	getAllUserSpendings(@Request() req: IExpressRequestWithUser): Promise<Spending[]> {
		const userId = req.user.id;

		return this.spendingService.getAllUserSpendings(userId);
	}

	@Get(':id')
	getSpendingById(@Param('id', ParseIntPipe) id: number): Promise<Spending> {
		return this.spendingService.getSpendingById(id);
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	async updateSpending(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateSpendingDto: UpdateSpendingDto
	): Promise<Spending> {
		return this.spendingService.updateSpending(+id, updateSpendingDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	async deleteSpending(@Param('id', ParseIntPipe) id: number): Promise<string> {
		return this.spendingService.deleteSpending(+id);
	}
}
