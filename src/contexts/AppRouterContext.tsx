import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import { NoMatch } from "../pages/commons/NoMatch";
import { Spin } from "antd";

export interface IAppRouteState {
	
}

const AppRouterContext = React.createContext<IAppRouteState | undefined>(undefined);

export const AppRouterContextProvider = () => {
	const router = createHashRouter([
		{
			element: <PrivateLayout />,
			children: [
				{ path: '/dashboard', async lazy() { const { Dashboard } = await import('../pages/private/Dashboard'); return { Component: Dashboard } } },
				{ path: '/admin/role', async lazy() { const { RolePage } = await import('../pages/private/admin/RolePage'); return { Component: RolePage } } },
				{ path: '/admin/user', async lazy() { const { UserPage } = await import('../pages/private/admin/UserPage'); return { Component: UserPage } } },
				{ path: "*", element: <NoMatch /> }
			],
			hydrateFallbackElement: (
				<div className="flex justify-center items-center h-screen bg-gray-100 animate-fade-in">
					<Spin size="large" tip="Loading..." />
				</div>
			)
		},
		{
			element: <PublicLayout/>,
			children: [
				{ path: '/login', async lazy() { const { Login } = await import('../pages/public/Login'); return { Component: Login } } },
			],
			hydrateFallbackElement: (
				<div className="flex justify-center items-center h-screen bg-gray-100 animate-fade-in">
					<Spin size="large" tip="Loading..." />
				</div>
			)
		}
	], {
			
	});

	return (
		<AppRouterContext.Provider value={{}}>
			<RouterProvider router={router} />
		</AppRouterContext.Provider>
		
	);
}

export function useAppRouterContext() : IAppRouteState {
	const appRouteContext = React.useContext(AppRouterContext);
	if (appRouteContext === undefined) {
		throw new Error('useAppRouterContext() should be used within AppRouterContext.Provider');
	}
	
	return appRouteContext;
}