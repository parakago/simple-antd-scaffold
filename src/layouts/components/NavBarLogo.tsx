import { ProductOutlined } from "@ant-design/icons";
import { AppApi, AppUtil } from "@apis";
import { App } from "@contexts";

export interface INavBarLogoProps {
	className?: string;
}

const NavBarLogo: React.FC<INavBarLogoProps> = ({className}) => {
	const cls = AppUtil.classNames('flex gap-x-2 items-center cursor-pointer', className);

	const handleOnClick = () => {
		App.navigate(AppApi.DEFAULT_WEB_PATH);
	}

	return (
		<div className={cls} onClick={handleOnClick}>
			<span className='text-white text-lg'><ProductOutlined /></span>
			<span className='font-bold text-white text-lg'>HELO</span>
		</div>
	)
}

export default NavBarLogo;