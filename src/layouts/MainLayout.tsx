import { DashboardOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { App } from '@contexts';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBarLogo from './components/NavBarLogo';
import NavBarMenu, { INavBarMenuItem } from './components/NavBarMenu';
import NavBarUser from './components/NavBarUser';

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

const MainLayout: React.FC = () => {
	App.navigate = useNavigate();

	const {
		token: { borderRadiusLG }
	} = theme.useToken();

	const items: INavBarMenuItem[] = [
		{path: 'about', label: 'Dashboard', icon: <DashboardOutlined />},
		{path: 'helo', label: 'Morning', icon: <UserOutlined />}
	];

	return (
		<Layout>
			<Layout.Header className='h-12 py-1 flex gap-x-4 items-center'>
				<NavBarLogo className='w-28 h-8' />
				<NavBarMenu className='grow h-full' items={items} onSelect={(menu) => {
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