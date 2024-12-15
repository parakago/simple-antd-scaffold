import { MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import { Util } from "../../apis/Util";
import { useAppContext } from "../../contexts/AppContext";
import React from "react";

export interface INavBarUserProps {
	className?: string;
}

const NavBarUser: React.FC<INavBarUserProps> = ({className}) => {
	const appCtx = useAppContext();
	
	const isDarkMode = () => {
		return appCtx.getCurrentTheme() == 'dark';
	}

	const switchAppTheme = () => {
		appCtx.changeAppTheme(isDarkMode() ? 'light' : 'dark');
	};

	const cls = Util.classNames('flex items-center text-white gap-2', className);
	return (
		<div className={cls}>
			<Tooltip title={`Enable ${isDarkMode() ? "light" : "dark"} mode`}>
				{
					isDarkMode() ? 
					<SunOutlined className="mr-2 text-lg" onClick={() => { switchAppTheme(); }}/> :
					<MoonOutlined className="mr-2 text-lg" onClick={() => { switchAppTheme(); }}/>
				}
			</Tooltip>

			<Avatar style={{ backgroundColor: '#87d068' }} shape="square" icon={<UserOutlined />} />

			<div>
				<div className="text-xs font-bold">HongGilDong</div>
				<div className="text-xs">Asia/Seoul</div>
			</div>
		</div>
	)
}

export default NavBarUser;