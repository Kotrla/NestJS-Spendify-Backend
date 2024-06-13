import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IStock, IStocksLive, IStocksLiveResponse } from '../models/models';

@Injectable()
export class StocksService {
	private apiKey: string;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {
		this.apiKey = this.configService.get<string>('POLYGON_API_KEY');
	}

	async getStockData(): Promise<IStocksLiveResponse> {
		const today = new Date().toISOString().split('T')[0];
		const url = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${today}?apiKey=${this.apiKey}`;

		return this.httpService
			.get<IStocksLive>(url)
			.pipe(
				map(response => {
					const data = response.data;
					const stocks: IStock[] = data.results.map(stock => ({
						symbol: stock.T,
						close: stock.c,
						high: stock.h,
						low: stock.l,
						numTransactions: stock.n,
						open: stock.o,
						timestamp: stock.t,
						volume: stock.v,
						volumeWeighted: stock.vw,
					}));

					return {
						total: data.resultsCount,
						stocks,
					};
				}),
				catchError(err => {
					throw new HttpException('Error fetching stock data', HttpStatus.INTERNAL_SERVER_ERROR);
				})
			)
			.toPromise();
	}
}
