export interface IUserPayload {
	id: number;
	name: string;
	email: string;
	password: string;
}

export interface ILoginResponse {
	userID: number;
	access_token: string;
}
