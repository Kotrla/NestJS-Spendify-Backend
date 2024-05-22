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
import { Spending as CSpending } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { IExpressRequestWithUser } from '../users/models/express-request-with-user.model';
import { SpendingService } from './spending.service';
import { SelfGuard } from '../../common/guards/self.guard';
import { UpdateSpendingDto } from './dtos/update-spending.dto';

@Controller('spending')
export class SpendingController {
	constructor(private readonly spendingService: SpendingService) {}

	@Post()
	async createPost(
		@Body() createSpendingDto: CreateSpendingDto,
		@Request() req: IExpressRequestWithUser
	): Promise<CSpending> {
		createSpendingDto.userId = req.user.sub;
		return this.spendingService.createSpending(createSpendingDto);
	}

	@Get()
	@UseGuards(SelfGuard)
	getAllUserSpendings(@Request() req: IExpressRequestWithUser): Promise<CSpending[]> {
		const userId = req.user.sub;

		return this.spendingService.getAllUserSpendings(userId);
	}

	@Public()
	@Get(':id')
	getSpendingById(@Param('id', ParseIntPipe) id: number): Promise<CSpending> {
		return this.spendingService.getSpendingById(id);
	}

	@Patch(':id')
	@UseGuards(SelfGuard) // <--- 💡 Prevent user from updating other user's Spending
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateSpendingDto: UpdateSpendingDto
	): Promise<CSpending> {
		return this.spendingService.updateSpending(+id, updateSpendingDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard) // <--- 💡 Prevent user from deleting other user's Spending
	async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
		return this.spendingService.deleteSpending(+id);
	}
}
