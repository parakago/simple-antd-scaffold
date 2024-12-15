import { Util } from "../../apis/Util";
import React from 'react';

export interface INavBarMenuItem {
	key: string;
	label: string;
	icon: React.ReactNode;
}

export interface INavBarMenuProps {
	items: INavBarMenuItem[];
	className?: string;
}

const NavBarMenu: React.FC<INavBarMenuProps> = ({className, items}) => {
	const mainClassName = Util.classNames('flex items-center text-white', className);

	const divMenus: React.ReactNode[] = [];
	for (let i = 0; i < items.length; ++i) {
		const item = items[i];
		const menuClassName = ['cursor-pointer px-3 h-10 flex items-center rounded'];
		if (i > 0) {
			menuClassName.push('ml-1 bg-gray-400/20');
		}

		divMenus.push(
			<div className={menuClassName.join(' ')}>
				{item.icon}<span className='pl-1'>{item.label}</span>
			</div>
		);
	}

	return (
		<div className={mainClassName}>{divMenus}</div>
	)
}

export default NavBarMenu;