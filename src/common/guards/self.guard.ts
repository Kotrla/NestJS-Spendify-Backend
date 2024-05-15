import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		return parseInt(request.params.id) === request.user.sub;
	}
}
