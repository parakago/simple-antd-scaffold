import { App } from '@contexts';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const EmptyLayout: React.FC = () => {
	App.navigate = useNavigate();
	
	return (
		<Outlet />
	)
}

export default EmptyLayout;