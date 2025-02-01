import { DashboardOutlined, LoadingOutlined, TeamOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { AppApi, AppUtil, GatewayApi, IWebMenu } from '@apis';
import { App } from '@contexts';
import { Layout, Menu, MenuProps, Spin } from 'antd';
import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavBarLogo from './components/NavBarLogo';
import NavBarMenu, { INavBarMenuItem } from './components/NavBarMenu';
import NavBarUser from './components/NavBarUser';

const PreDefinedIconMap: { [name: string]: React.ReactNode } = {
	dashboard: <DashboardOutlined />,
	tool: <ToolOutlined />,
	team: <TeamOutlined />,
	user: <UserOutlined />
}

const getChildWebMenus = (mainWebMenus: IWebMenu[], mainWebMenuPath: string): IWebMenu[] => {
	const filtered = mainWebMenus.filter((value) => value.path === mainWebMenuPath);
	return filtered.length === 0 || filtered[0].children === undefined ? [] : filtered[0].children;
}

const PrivateLayout: React.FC = () => {
	App.navigate = useNavigate();

	const refWebMenus = React.useRef<IWebMenu[]>();
	const [mainMenuItems, setMainMenuItems] = React.useState<INavBarMenuItem[]>([]);
	
	React.useEffect(() => {
		if (refWebMenus.current !== undefined) return;
		
		(async () => {
			const status = await GatewayApi.sessionStatus();
			if (status === null) {
				let currentPath = AppUtil.getBrowserPath();
				if (currentPath === '/') {
					currentPath = AppApi.DEFAULT_WEB_PATH;
				}

				App.redirectToLogin(currentPath);
				return;
			}

			refWebMenus.current = await AppApi.webMenus();
			const topMenuItems = (refWebMenus.current).map((webMenu) => {
				return {
					path: webMenu.path,
					label: webMenu.label,
					icon: PreDefinedIconMap[webMenu.icon ?? 'none']
				}
			});

			setMainMenuItems(topMenuItems);
		})();
	}, []);

	if (refWebMenus.current === undefined) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spin indicator={<LoadingOutlined className='text-5xl' spin />} />
			</div>
		);
	}

	const handleOnSelectMenu: MenuProps['onSelect'] = (selection) => {
		App.navigate(selection.key);
	}

	const [mainWebMenuPath, subWebMenuPath] = AppUtil.extractCurrentWebMenuPath();

	const subWebMenus = mainWebMenuPath === undefined ? [] : getChildWebMenus(refWebMenus.current, mainWebMenuPath);
	const subMenuItems = subWebMenus.map((webMenu) => {
		return {
			key: webMenu.path,
			label: webMenu.label,
			icon: PreDefinedIconMap[webMenu.icon ?? 'none']
		}
	});

	const outlet = subMenuItems.length > 0 && subWebMenuPath === undefined ? <Navigate to={subMenuItems[0].key} replace /> : <Outlet/>;

	return (
		<Layout>
			<Layout.Header className='h-12 py-1 flex gap-x-4 items-center'>
				<NavBarLogo className='w-28 h-8' />
				<NavBarMenu className='grow h-full' items={mainMenuItems} onSelect={(menu) => {
					App.navigate(menu.path);
				}} />
				<NavBarUser className='h-8' />
			</Layout.Header>

			<Layout.Content className='w-full px-[50px]'>
				<div className='py-4 font-bold'>Selected Main Menu</div>
				<div className='flex gap-3' >
					<Menu
						mode="inline"
						className='min-w-52 max-w-52 h-full rounded-lg'
						selectedKeys={subWebMenuPath === undefined ? undefined : [subWebMenuPath]}
						style={{ display: subMenuItems?.length == 0 ? 'none' : 'block' }}
						items={subMenuItems}
						onSelect={handleOnSelectMenu}
					/>
					<div className='grow'>
						{outlet}
					</div>
				</div>
			</Layout.Content>

			<Layout.Footer className='h-12 py-1 flex gap-x-4 items-center justify-center'>
				Helo ©{new Date().getFullYear()} created by Helo
			</Layout.Footer>
		</Layout>
	);
}

export default PrivateLayout;