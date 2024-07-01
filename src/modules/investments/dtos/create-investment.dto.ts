import { InvestmentType } from '../models/enums';
import { IsNotEmpty, IsNumber, IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateInvestmentDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsEnum(InvestmentType)
	type: InvestmentType;

	@IsNotEmpty()
	@IsNumber()
	currentValue: number;

	@IsNotEmpty()
	@IsNumber()
	boughtValue: number;

	@IsNotEmpty()
	@IsDateString()
	date: string;

	userId?: number;
}
