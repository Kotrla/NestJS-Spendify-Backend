import { Spending } from '@prisma/client';
import { SpendingService } from './spending.service';
import { SelfGuard } from '../../common/guards/self.guard';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { Public } from 'src/common/decorators/public.decorator';
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
	Request,
	UseGuards,
} from '@nestjs/common';

@Controller('spending')
export class SpendingController {
	constructor(private readonly spendingService: SpendingService) {}

	@Post()
	async createSpending(
		@Body() createSpendingDto: CreateSpendingDto,
		@Request() req: IExpressRequestWithUser
	): Promise<Spending> {
		createSpendingDto.userId = req.user.sub;
		return this.spendingService.createSpending(createSpendingDto);
	}

	@Get()
	@UseGuards(SelfGuard)
	getAllUserSpendings(@Request() req: IExpressRequestWithUser): Promise<Spending[]> {
		const userId = req.user.sub;

		return this.spendingService.getAllUserSpendings(userId);
	}

	@Public()
	@Get(':id')
	getSpendingById(@Param('id', ParseIntPipe) id: number): Promise<Spending> {
		return this.spendingService.getSpendingById(id);
	}

	@Patch(':id')
	@UseGuards(SelfGuard) // <--- 💡 Prevent user from updating other user's Spending
	async updateSpending(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateSpendingDto: UpdateSpendingDto
	): Promise<Spending> {
		return this.spendingService.updateSpending(+id, updateSpendingDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard) // <--- 💡 Prevent user from deleting other user's Spending
	async deleteSpending(@Param('id', ParseIntPipe) id: number): Promise<string> {
		return this.spendingService.deleteSpending(+id);
	}
}
