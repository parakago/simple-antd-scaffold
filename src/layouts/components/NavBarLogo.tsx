import { ProductOutlined } from "@ant-design/icons";
import { Util } from "@apis";

export interface INavBarLogoProps {
	className?: string;
}

const NavBarLogo: React.FC<INavBarLogoProps> = ({className}) => {
	const cls = Util.classNames('flex gap-x-2 items-center', className);
	return (
		<div className={cls}>
			<ProductOutlined className='text-white' />
			<div className='font-bold text-white'>HELO</div>
		</div>
	)
}

export default NavBarLogo;