import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CryptoService } from './services/crypto.service';
import { StocksService } from './services/stocks.service';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';

@Module({
	imports: [HttpModule],
	controllers: [InvestmentsController],
	providers: [InvestmentsService, CryptoService, StocksService],
})
export class InvestmentsModule {}
