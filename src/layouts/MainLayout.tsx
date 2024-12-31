import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { DashboardOutlined, LaptopOutlined, NotificationOutlined, SettingOutlined, SwitcherOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Breadcrumb, Card, Layout, Menu, Space, Switch, Typography, theme } from 'antd';
import { useAppContext } from '../contexts/AppContext';
import NavBarMenu, { INavBarMenuItem } from './components/NavBarMenu';
import NavBarLogo from './components/NavBarLogo';
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
	const appCtx = useAppContext();

	const {
		token: { borderRadiusLG }
	} = theme.useToken();

	const items: INavBarMenuItem[] = [
		{path: 'mail', label: 'Good', icon: <DashboardOutlined />},
		{path: 'app', label: 'Morning', icon: <UserOutlined />}
	];

	return (
		<Layout>
			<Layout.Header className='h-12 py-1 flex gap-x-4 items-center'>
				<NavBarLogo className='w-28 h-8' />
				<NavBarMenu className='grow h-full' items={items} />
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
						<Card title="Default size card" className='w-full' extra={<a href="#">More</a>}>
							<p>Card content</p>
							<p>Card content</p>
							<p>Card content</p>
						</Card>
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