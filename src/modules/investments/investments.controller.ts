import { Investment } from '@prisma/client';
import { InvestmentType } from './models/enums';
import { CryptoService } from './services/crypto.service';
import { StocksService } from './services/stocks.service';
import { SelfGuard } from '../../common/guards/self.guard';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { ICryptoLiveResponse, IStocksLiveResponse } from './models/models';
import { IExpressRequestWithUser } from '../users/models/express-request-with-user.model';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	Request,
} from '@nestjs/common';

@Controller('investments')
export class InvestmentsController {
	constructor(
		private readonly stocksService: StocksService,
		private readonly cryptoService: CryptoService,
		private readonly investmentsService: InvestmentsService
	) {}

	@Get('/live/stocks')
	async getStockData(): Promise<IStocksLiveResponse> {
		try {
			return await this.stocksService.getStockData();
		} catch (error) {
			throw new HttpException('Failed to fetch stock data', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('/live/crypto')
	async getCryptoData(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10
	): Promise<ICryptoLiveResponse> {
		try {
			return await this.cryptoService.getCryptoData(page, limit);
		} catch (error) {
			throw new HttpException('Failed to fetch cryptocurrency data', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post()
	async createInvestment(
		@Body() createInvestmentDto: CreateInvestmentDto,
		@Request() req: IExpressRequestWithUser
	): Promise<Investment> {
		createInvestmentDto.userId = req.user.id;
		return this.investmentsService.createInvestment(createInvestmentDto);
	}

	@Get()
	async getAllUserInvestments(@Request() req: IExpressRequestWithUser): Promise<Investment[]> {
		const userId = req.user.id;
		return this.investmentsService.getAllUserInvestments(userId);
	}

	@Get(':id')
	async getInvestmentById(@Param('id', ParseIntPipe) id: number): Promise<Investment> {
		return this.investmentsService.getInvestmentById(id);
	}

	@Get('/byType')
	@UseGuards(SelfGuard)
	async getInvestmentsByType(
		@Query('investmentType') investmentType: InvestmentType,
		@Query('fromDate') fromDate: string,
		@Query('toDate') toDate: string,
		@Request() req: IExpressRequestWithUser
	): Promise<Investment[]> {
		const userId = req.user.id;
		return this.investmentsService.getInvestmentByType(userId, investmentType, fromDate, toDate);
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	async updateInvestment(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateInvestmentDto: UpdateInvestmentDto
	): Promise<Investment> {
		return this.investmentsService.updateInvestment(id, updateInvestmentDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	async deleteInvestment(@Param('id', ParseIntPipe) id: number): Promise<string> {
		return this.investmentsService.deleteInvestment(id);
	}
}
