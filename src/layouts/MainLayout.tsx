import { DashboardOutlined, LaptopOutlined, NotificationOutlined, TeamOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { App } from '@contexts';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBarLogo from './components/NavBarLogo';
import NavBarMenu, { INavBarMenuItem } from './components/NavBarMenu';
import NavBarUser from './components/NavBarUser';
import { AppApi, GatewayApi, IWebMenu } from '@apis';

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
	(icon, index) => {
		const key = String(index + 1);
		return {
			key: `sub${key}`,
			icon: React.createElement(icon),
			label: `subnav ${key}`
		};
	},
);

const PreDefinedIconMap: { [name: string]: React.ReactNode } = {
	dashboard: <DashboardOutlined />,
	tool: <ToolOutlined />,
	team: <TeamOutlined />,
	user: <UserOutlined />
}

const MainLayout: React.FC = () => {
	App.navigate = useNavigate();

	const [navBarMenuItems, setNavBarMenuItems] = React.useState<INavBarMenuItem[]>([]);
	const refWebMenus = React.useRef<IWebMenu[]>();
	
	React.useEffect(() => {
		if (refWebMenus.current !== undefined) return;
		
		(async () => {
			const status = await GatewayApi.sessionStatus();
			if (status === null) {
				App.navigate('/login', { replace: true });
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
			setNavBarMenuItems(topMenuItems);
		})();
	}, []);

	const { token: { borderRadiusLG } } = theme.useToken();

	return (
		<Layout>
			<Layout.Header className='h-12 py-1 flex gap-x-4 items-center'>
				<NavBarLogo className='w-28 h-8' />
				<NavBarMenu className='grow h-full' items={navBarMenuItems} onSelect={(menu) => {
					console.log(menu.path);
					App.navigate(menu.path);
				}} />
				<NavBarUser className='h-8' />
			</Layout.Header>

			<Layout.Content className='w-full px-[50px]'>
				<div className='py-4 font-bold'>Selected Main Menu</div>
				<div className='flex gap-3' >
					<Menu
						mode="inline"
						className='min-w-52'
						defaultSelectedKeys={['1']}
						defaultOpenKeys={['sub1']}
						style={{ width: '200px', height: '100%', borderRight: 0, borderRadius: borderRadiusLG }}
						items={items2}
					/>
					<div className='grow '>
						<Outlet/>
					</div>
				</div>
			</Layout.Content>

			<Layout.Footer className='h-12 py-1 flex gap-x-4 items-center justify-center'>
				Helo ©{new Date().getFullYear()} created by Helo
			</Layout.Footer>
		</Layout>
	);
}

export default MainLayout;