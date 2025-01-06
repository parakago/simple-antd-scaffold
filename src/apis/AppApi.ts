export interface IWebMenu {
	path: string;
	label: string;
	icon?: string;
	children?: IWebMenu[];
}

export const AppApi = {
	webMenus: (): Promise<IWebMenu[]> => {
		return Promise.resolve([{
			path: '/dashboard',
			label: 'Dashboard',
			icon: 'dashboard'
		}, {
			path: '/admin',
			label: 'Admin',
			icon: 'tool',
			children: [{
				path: '/admin/role',
				label: 'Role',
				icon: 'team'
			}, {
				path: '/admin/user',
				label: 'User',
				icon: 'user'
			}]
		}]);
	}
}