import { DashboardOutlined, LoadingOutlined, TeamOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { AppApi, AppUtil, IWebMenu } from '@apis';
import { App } from '@contexts';
import type { BreadcrumbProps } from 'antd';
import { Breadcrumb, Layout, Menu, MenuProps, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { translate as t } from "react-i18nify";
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

	const refWebMenus = useRef<IWebMenu[]>(undefined);
	const [mainMenuItems, setMainMenuItems] = useState<INavBarMenuItem[]>([]);

	useEffect(() => {
		if (refWebMenus.current !== undefined) return;
		
		(async () => {
			const status = await AppApi.helo();
			if (status.uid === undefined) {
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
					label: t(webMenu.label),
					icon: PreDefinedIconMap[webMenu.icon ?? 'none']
				}
			});

			setMainMenuItems(topMenuItems);
		})();
	}, []);

	const [mainWebMenuPath, subWebMenuPath] = AppUtil.extractCurrentWebMenuPath();

	if (mainWebMenuPath === undefined) {
		return <Navigate replace to={AppApi.DEFAULT_WEB_PATH} />;
	}

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

	const subWebMenus = mainWebMenuPath === undefined ? [] : getChildWebMenus(refWebMenus.current, mainWebMenuPath);
	const subMenuItems = subWebMenus.map((webMenu) => {
		return {
			key: webMenu.path,
			label: t(webMenu.label),
			icon: PreDefinedIconMap[webMenu.icon ?? 'none']
		}
	});
	
	const outlet = subMenuItems.length > 0 && subWebMenuPath === undefined ? <Navigate to={subMenuItems[0].key} replace /> : <Outlet/>;

	const breadcrumbItems: BreadcrumbProps['items'] = [];
	const mainMenu = mainMenuItems.find(menu => menu.path === mainWebMenuPath);
	if (mainMenu !== undefined) {
		breadcrumbItems.push({ title: mainMenu.label });
	}
	const subMenu = subMenuItems.find(menu => menu.key === subWebMenuPath);
	if (subMenu !== undefined) {
		breadcrumbItems.push({ title: subMenu.label });
	}

	return (
		<Layout className='h-full'>
			<Layout.Header className='flex gap-x-4 items-center' style={{ height: '48px'}}>
				<NavBarLogo className='w-28 h-6' />
				<NavBarMenu className='grow h-full' items={mainMenuItems} onSelect={(menu) => {
					App.navigate(menu.path);
				}} />
				<NavBarUser className='h-6' />
			</Layout.Header>

			<Layout.Content className='w-full px-[50px]'>
				<div className='py-4 font-bold'>
					<Breadcrumb separator=">" items={breadcrumbItems} />
				</div>
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