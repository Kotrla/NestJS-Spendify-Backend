import { IUserPayload } from './users-login.model';
import { Request as ExpressRequest } from 'express';

export interface IExpressRequestWithUser extends ExpressRequest {
	user: IUserPayload & { iat: number; exp: number };
}
