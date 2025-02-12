import { AppUtil } from "./AppUtil";
import { ISessionStatus, IAuthRequest, IAuthResponse, IWebMenu, IRole } from "./interfaces";

export const AppApi = {
	_default_web_path: '/dashboard',
	get DEFAULT_WEB_PATH() {
		return this._default_web_path;
	},
	sessionStatus: (): Promise<null | ISessionStatus> => {
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
	},
	webMenus: (): Promise<IWebMenu[]> => {
		return Promise.resolve([
			{
				path: '/dashboard',
				label: 'Dashboard',
				icon: 'dashboard'
			}, {
				path: '/admin',
				label: 'Admin',
				icon: 'tool',
				children: [
					{
						path: '/admin/role',
						label: 'Role',
						icon: 'team'
					}, {
						path: '/admin/user',
						label: 'User',
						icon: 'user'
					}
				]
			}
		]);
	},
	getRoles: (): Promise<IRole[]> => {
		return Promise.resolve<IRole[]>([
			{
				id: AppUtil.randomUUID(),
				kind: 'system',
				name: 'ADMIN',
				tags: ['system'],
				description: 'Administrator',
			}, {
				id: AppUtil.randomUUID(),
				kind: 'system',
				name: 'USER',
				tags: ['system'],
				description: 'General User',
			}, {
				id: AppUtil.randomUUID(),
				kind: 'custom',
				name: 'WEBDEV-FRONTEND',
				tags: ['custom', 'dev', 'web'],
				description: 'Front-End Developer',
			}, {
				id: AppUtil.randomUUID(),
				kind: 'custom',
				name: 'WEBDEV-BACKEND',
				tags: ['custom', 'dev', 'web'],
				description: 'Back-End Developer',
			}
		]);
	}
}