import { AppUtil } from "./AppUtil";
import { ISession, IAuthRequest, IAuthResponse, IWebMenu, IRole } from "./interfaces";

const getSessionFromCookie = (): ISession | undefined => {
	if (AppUtil.isEmpty(document.cookie)) {
		return undefined;
	}

	const s = document.cookie.split('=');
	if (s.length < 2) {
		return undefined;
	}

	return JSON.parse(s[1]);
}

export const AppApi = {
	_default_web_path: '/dashboard',
	get DEFAULT_WEB_PATH() {
		return this._default_web_path;
	},
	helo: (): Promise<ISession> => {
		const session = getSessionFromCookie();
		if (session === undefined) {
			return Promise.resolve({
				name: 'Anonymous',
				theme: 'light',
				locale: 'ko',
				timezone: 'Asia/Seoul'
			});
		}

		return Promise.resolve({
			uid: session.uid,
			name: session.uid,
			theme: 'light',
			locale: session.locale,
			timezone: 'Asia/Seoul'
		});
	},
	login: (request: IAuthRequest): Promise<IAuthResponse> => {
		const result = AppUtil.isNotEmpty(request.uid) && request.uid === request.pwd ? 0 : 1;
		if (result === 0) {
			document.cookie = `mock_session=${JSON.stringify({uid: request.uid, locale: 'ko'})}`;
		}

		return Promise.resolve({ result });
	},
	logout: (): Promise<void> => {
		document.cookie = document.cookie = 'mock_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		return Promise.resolve();
	},
	changeLocale: (locale: 'ko' | 'en'): Promise<void> => {
		const session = getSessionFromCookie();
		if (session === undefined) {
			return Promise.reject(new Error('Session not found'));
		}
		
		session.locale = locale;
		document.cookie = `mock_session=${JSON.stringify(session)}`;
		
		return Promise.resolve();
	},
	webMenus: (): Promise<IWebMenu[]> => {
		return Promise.resolve([
			{
				path: '/dashboard',
				label: 'menu.main.dashboard',
				icon: 'dashboard'
			}, {
				path: '/admin',
				label: 'menu.main.admin',
				icon: 'tool',
				children: [
					{
						path: '/admin/role',
						label: 'menu.admin.role',
						icon: 'team'
					}, {
						path: '/admin/user',
						label: 'menu.admin.user',
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