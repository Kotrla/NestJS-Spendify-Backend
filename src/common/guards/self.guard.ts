import { PrismaService } from '../../core/services/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
	constructor(private prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const route = request.route.path.split('/')[1];
		const paramId = isNaN(parseInt(request.params.id)) ? 0 : parseInt(request.params.id);

		switch (route) {
			// 💡 Check if the spending belongs to the user
			case 'spending':
				const spending = await this.prismaService.spending.findFirst({
					where: {
						userId: request.user.id,
					},
				});

				return !!spending ? spending?.userId === request.user.id : true;
			case 'investments':
				const investment = await this.prismaService.investment.findFirst({
					where: {
						id: paramId,
						userId: request.user.id,
					},
				});

				return !!investment ? investment.userId === request.user.id : false;
			default:
				// 💡 Check if the user manages its own profile
				return paramId === request.user.id;
		}
	}
}
