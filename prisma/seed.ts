import { PrismaClient } from '@prisma/client';
import { SpendingType } from '../src/modules/spending/models/enums';

const prisma = new PrismaClient();

async function main() {
	const defaultCategories = [
		{ name: 'Food', type: SpendingType.EXPENSE },
		{ name: 'Travel', type: SpendingType.EXPENSE },
		{ name: 'Utilities', type: SpendingType.EXPENSE },
		{ name: 'Health', type: SpendingType.EXPENSE },
		{ name: 'Entertainment', type: SpendingType.EXPENSE },
		{ name: 'Education', type: SpendingType.EXPENSE },
		{ name: 'Salary', type: SpendingType.INCOME },
		{ name: 'Investments', type: SpendingType.INCOME },
	];

	for (const category of defaultCategories) {
		await prisma.spendingCategory.upsert({
			where: { name: category.name },
			update: { type: category.type },
			create: category,
		});
	}

	console.log('Default categories have been created.');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
