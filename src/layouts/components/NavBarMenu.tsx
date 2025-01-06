import { Util } from "@apis";
import React from 'react';

export interface INavBarMenuItem {
	path: string;
	label: string;
	icon: React.ReactNode;
}

export interface INavBarMenuProps {
	items: INavBarMenuItem[];
	defaultPath?: string;
	className?: string;
	onSelect?: (menu: INavBarMenuItem) => void;
}

const NavBarMenu: React.FC<INavBarMenuProps> = ({className, items, defaultPath, onSelect}) => {
	const containerClassName = Util.classNames("flex items-center text-white", className);
	const [selectedMenuKey, setSelectedMenuKey] = React.useState<string|undefined>(defaultPath);

	return (
		<ul className={containerClassName}>
			{items.map((item) => {
				const selClass = selectedMenuKey === item.path ? " bg-gray-400/20" : "";
				return (
					<li key={item.path}
						className={"cursor-pointer mr-1 px-3 h-10 flex items-center rounded hover:bg-gray-400/30" + selClass}
						onClick={() => {
							onSelect?.(item);
							setSelectedMenuKey(item.path);
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