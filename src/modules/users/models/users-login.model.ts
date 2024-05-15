export interface IUserPayload {
	sub: number;
	name: string;
	email: string;
}

export interface ILoginResponse {
	access_token: string;
}
