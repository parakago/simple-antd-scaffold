import { AppUtil } from "./AppUtil";

export const DEFAULT_WEB_PATH = '/dashboard';

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

export const AppApi = {
	_default_web_path: '/dashboard',
	get DEFAULT_WEB_PATH() {
		return this._default_web_path;
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
	roles: (): Promise<IRole[]> => {
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