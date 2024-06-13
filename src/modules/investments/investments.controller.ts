import { ICryptoLiveResponse, IStocksLiveResponse } from './models/models';
import { CryptoService } from './services/crypto.service';
import { StocksService } from './services/stocks.service';
import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';

@Controller('investments')
export class InvestmentsController {
	constructor(
		private readonly stocksService: StocksService,
		private readonly cryptoService: CryptoService
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
}
