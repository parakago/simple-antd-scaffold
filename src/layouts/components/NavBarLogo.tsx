import { ProductOutlined } from "@ant-design/icons";
import { AppUtil } from "@apis";

export interface INavBarLogoProps {
	className?: string;
}

const NavBarLogo: React.FC<INavBarLogoProps> = ({className}) => {
	const cls = AppUtil.classNames('flex gap-x-2 items-center', className);
	return (
		<div className={cls}>
			<span className='text-white text-lg'><ProductOutlined /></span>
			<span className='font-bold text-white text-lg'>HELO</span>
		</div>
	)
}

export default NavBarLogo;