import { IsNotEmpty } from 'class-validator';
import { SpendingType } from '../models/enums';

export class CreateSpendingDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	type: SpendingType;

	@IsNotEmpty()
	category: string;

	@IsNotEmpty()
	amount: number;

	@IsNotEmpty()
	date: string;

	userId: number;
}
