import { AppUtil } from "@apis";
import React from 'react';

export interface INavBarMenuItem {
	path: string;
	label: string;
	icon: React.ReactNode;
}

export interface INavBarMenuProps {
	items: INavBarMenuItem[];
	className?: string;
	onSelect?: (menu: INavBarMenuItem) => void;
}

const NavBarMenu: React.FC<INavBarMenuProps> = ({className, items, onSelect}) => {
	const [mainWebMenuPath] = AppUtil.extractCurrentWebMenuPath();

	const containerClassName = AppUtil.classNames("flex items-center text-white", className);
	
	return (
		<ul className={containerClassName}>
			{items.map((item) => {
				const selClass = mainWebMenuPath === item.path ? " bg-gray-400/20" : "";
				return (
					<li key={item.path}
						className={"cursor-pointer mr-1 px-3 h-8 flex items-center rounded-sm hover:bg-gray-400/30" + selClass}
						onClick={() => {
							onSelect?.(item);
						}}
					>
						<span>{item.icon}</span> <span className="pl-1">{item.label}</span>
					</li>
				)
			})}
		</ul>
	)
}

export default NavBarMenu;