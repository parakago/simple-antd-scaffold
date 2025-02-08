import { AppUtil } from "./AppUtil";

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

export const GatewayApi = {
	sessionStatus: (): Promise<null | ISessionStatus> => {
		console.log(document.cookie);
		if (AppUtil.isEmpty(document.cookie)) {
			return Promise.resolve(null);
		}

		const s = document.cookie.split("=");
		return Promise.resolve({
			uid: s[1],
			theme: "light",
			locale: "ko",
			timezone: "Asia/Seoul"
		});
	},
	login: (request: IAuthRequest): Promise<IAuthResponse> => {
		const result = AppUtil.isNotEmpty(request.uid) && request.uid === request.pwd ? 0 : 1;
		if (result === 0) {
			document.cookie = `mock_session_uid=${request.uid}`;
		}

		return Promise.resolve({ result });
	},
	logout: (): Promise<void> => {
		document.cookie = document.cookie = 'mock_session_uid=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		return Promise.resolve();
	}
}