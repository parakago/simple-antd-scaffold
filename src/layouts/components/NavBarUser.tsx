import { GlobalOutlined, LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { AppApi } from "@apis";
import { App, useAppContext } from "@contexts";
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space, Tooltip } from "antd";
import React from "react";
import { AppUtil } from "@apis";

export interface INavBarUserProps {
	className?: string;
}

const NavBarUser: React.FC<INavBarUserProps> = ({className}) => {
	const [locale, setLocale] = React.useState('ko');

	const appCtx = useAppContext();
	
	const isDarkMode = () => {
		return appCtx.theme === 'dark';
	}

	const switchAppTheme = () => {
		appCtx.changeTheme(isDarkMode() ? 'light' : 'dark');
	};

	React.useEffect(() => {
		(async() => {
			const status = await AppApi.helo();
			setLocale(status.locale);
		})();
	}, []);

	const localeMenuItems: MenuProps['items'] = [
		{
			key: 'ko',
			label: '🇰🇷 한국어',
			onClick: () => {
				appCtx.changeLocale('ko');
			}
		},
		{
			key: 'en',
			label: '🇺🇸 English',
			onClick: () => {
				appCtx.changeLocale('en');
			}
		}
	];

	const userMenuItems: MenuProps['items'] = [
		{
			key: '1',
			label: 'Log out',
			icon: <LogoutOutlined />,
			onClick: async () => {
				await AppApi.logout();
				App.redirectToLogin('/');
			}
		}
	];

	const cls = AppUtil.classNames('flex items-center text-white gap-2', className);
	return (
		<div className={cls}>
			<Tooltip title={`Enable ${isDarkMode() ? "light" : "dark"} mode`}>
				{
					isDarkMode() ? 
					<SunOutlined className="mr-2 text-lg" onClick={() => { switchAppTheme(); }}/> :
					<MoonOutlined className="mr-2 text-lg" onClick={() => { switchAppTheme(); }}/>
				}
			</Tooltip>
			<Dropdown menu={{ items: localeMenuItems, selectable: true, selectedKeys: [locale] }}>
				<GlobalOutlined className="mr-2 text-lg" />
			</Dropdown>
			<Dropdown menu={{ items: userMenuItems }}>
				<Space>
					<Avatar style={{ backgroundColor: '#87d068' }} shape="square" icon={<UserOutlined />} />
					<div>
						<div className="text-xs font-bold">HongGilDong</div>
						<div className="text-xs">Asia/Seoul</div>
					</div>
				</Space>
			</Dropdown>
		</div>
	)
}

export default NavBarUser;