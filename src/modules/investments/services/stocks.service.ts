// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { map, catchError } from 'rxjs/operators';
// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { IStock, IStocksLiveResponse } from '../models/models';

// @Injectable()
// export class StocksService {
// 	private apiKey: string;

// 	private symbols = [
// 		'AAPL',
// 		'MSFT',
// 		'GOOGL',
// 		'AMZN',
// 		'FB',
// 		'TSLA',
// 		'BRK-A',
// 		'V',
// 		'JNJ',
// 		'WMT',
// 		'JPM',
// 		'PG',
// 		'MA',
// 		'UNH',
// 		'DIS',
// 		'NVDA',
// 		'HD',
// 		'PYPL',
// 		'VZ',
// 		'ADBE',
// 	];

// 	constructor(
// 		private readonly httpService: HttpService,
// 		private readonly configService: ConfigService
// 	) {
// 		this.apiKey = this.configService.get<string>('ALPHA_VANTAGE_API_KEY');
// 	}

// 	async getStockData(): Promise<IStocksLiveResponse> {
// 		const stockPromises = this.symbols.map(symbol =>
// 			this.httpService
// 				.get(
// 					`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`
// 				)
// 				.pipe(
// 					map(response => {
// 						const data = response.data['Time Series (Daily)'];
// 						const latestDate = Object.keys(data)[0];
// 						const stock = data[latestDate];
// 						return {
// 							symbol,
// 							close: parseFloat(stock['4. close']),
// 							high: parseFloat(stock['2. high']),
// 							low: parseFloat(stock['3. low']),
// 							open: parseFloat(stock['1. open']),
// 							volume: parseInt(stock['5. volume']),
// 							timestamp: new Date(latestDate).getTime(),
// 							numTransactions: 0, // Alpha Vantage doesn't provide this
// 							volumeWeighted: parseFloat(stock['5. volume']), // Adjust as needed
// 							currentPrice: parseFloat(stock['4. close']),
// 						} as IStock;
// 					}),
// 					catchError(err => {
// 						throw new HttpException(`Error fetching data for ${symbol}`, HttpStatus.INTERNAL_SERVER_ERROR);
// 					})
// 				)
// 				.toPromise()
// 		);
// 		const stocks = await Promise.all(stockPromises);
// 		return {
// 			total: stocks.length,
// 			stocks,
// 		};
// 	}
// }
import { StockData } from '../data/stocks';
import { Injectable } from '@nestjs/common';
import { IStocksLiveResponse } from '../models/models';

@Injectable()
export class StocksService {
	async getStockData(): Promise<IStocksLiveResponse> {
		// Return the data from the JSON file as a Promise
		return new Promise(resolve => {
			resolve(StockData as IStocksLiveResponse);
		});
	}
}
