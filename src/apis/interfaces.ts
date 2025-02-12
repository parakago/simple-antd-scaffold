export const DEFAULT_WEB_PATH = '/dashboard';

export interface ISessionStatus {
	uid: string;
	theme: "dark" | "light";
	locale: "ko" | "en";
	timezone: string;
}

export interface IAuthRequest {
	uid: string;
	pwd: string;
}

export interface IAuthResponse {
	result: number;
}

export interface IWebMenu {
	path: string;
	label: string;
	icon?: string;
	children?: IWebMenu[];
}

export interface IRole {
	id: string;
	kind: 'system' | 'custom';
	name: string;
	tags?: string[];
	description?: string;
}