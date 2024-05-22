import { IsNotEmpty } from 'class-validator';

export class CreateSpendingDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	type: string;

	@IsNotEmpty()
	category: string;

	@IsNotEmpty()
	amount: number;

	@IsNotEmpty()
	date: string;

	@IsNotEmpty()
	userId: number;
}
