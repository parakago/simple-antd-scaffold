import { App } from '@contexts';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const PublicLayout: React.FC = () => {
	App.navigate = useNavigate();
	
	return (
		<Outlet />
	)
}

export default PublicLayout;