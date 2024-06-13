import { catchError, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ICryptoLive, ICryptoLiveResponse } from '../models/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
	constructor(private readonly httpService: HttpService) {}

	async getCryptoData(page: number, limit: number): Promise<ICryptoLiveResponse> {
		const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur`;
		return this.httpService
			.get<ICryptoLive[]>(url)
			.pipe(
				map(response => {
					const data = response.data;
					const paginatedData = data.slice((page - 1) * limit, page * limit);

					return {
						total: data.length,
						page,
						limit,
						data: paginatedData,
					};
				}),
				catchError(err => {
					throw new HttpException('Error fetching cryptocurrency data', HttpStatus.INTERNAL_SERVER_ERROR);
				})
			)
			.toPromise();
	}
}
