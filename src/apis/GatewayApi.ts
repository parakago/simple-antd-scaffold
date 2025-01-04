import { Util } from "./Util";

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
		if (Util.isEmpty(document.cookie)) {
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
		const result = request.uid === request.pwd ? 0 : 1;
		if (result === 0) {
			document.cookie = `mock_session_uid=${request.uid}`;
		}

		return Promise.resolve({ result });
	},
	logout: (): Promise<void> => {
		document.cookie = "";
		return Promise.resolve();
	}
}