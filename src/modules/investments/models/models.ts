export interface ICryptoLive {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	fully_diluted_valuation: number | null;
	total_volume: number;
	high_24h: number;
	low_24h: number;
	price_change_24h: number;
	price_change_percentage_24h: number;
	market_cap_change_24h: number;
	market_cap_change_percentage_24h: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number | null;
	ath: number;
	ath_change_percentage: number;
	ath_date: string;
	atl: number;
	atl_change_percentage: number;
	atl_date: string;
	roi: {
		times: number;
		currency: string;
		percentage: number;
	} | null;
	last_updated: string;
}

export interface ICryptoLiveResponse {
	total: number;
	page: number;
	limit: number;
	data: ICryptoLive[];
}
export interface IStocksLive {
	ticker: string;
	adjusted: boolean;
	queryCount: number;
	request_id: string;
	resultsCount: number;
	status: string;
	results: {
		T: string;
		c: number;
		h: number;
		l: number;
		n: number;
		o: number;
		t: number;
		v: number;
		vw: number;
	}[];
}

export interface IStock {
	symbol: string;
	close: number;
	high: number;
	low: number;
	numTransactions: number;
	open: number;
	timestamp: number;
	volume: number;
	volumeWeighted: number;
}

export interface IStocksLiveResponse {
	total: number;
	stocks: IStock[];
}
