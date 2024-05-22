import { PrismaService } from '../../core/services/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
	constructor(private prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		// 💡 We can access the user payload from the request object
		// because we assigned it in the AuthGuard

		// 💡 Get instance of the route by splitting the path, e.g. /posts/1
		const route = request.route.path.split('/')[1];
		const paramId = isNaN(parseInt(request.params.id)) ? 0 : parseInt(request.params.id);

		switch (route) {
			// 💡 Check if the spending belongs to the user
			case 'spending':
				const post = await this.prismaService.spending.findFirst({
					where: {
						id: paramId,
						userId: request.user.sub,
					},
				});

				return paramId === post?.id;
			default:
				// 💡 Check if the user manages its own profile
				return paramId === request.user.sub;
		}
	}
}
