export interface IWebMenu {
	path: string;
	label: string;
	icon?: string;
	children?: IWebMenu[];
}

export const AppApi = {
	webMenus: (): Promise<IWebMenu[]> => {
		return Promise.resolve([{
			path: '',
			label: '',
			icon: ''
		}]);
	}
}