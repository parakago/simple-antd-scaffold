import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import { NoMatch } from "../pages/commons/NoMatch";

export interface IAppRouteState {
	
}

const AppRouterContext = React.createContext<IAppRouteState | undefined>(undefined);

export const AppRouterContextProvider = () => {
	const router = createHashRouter([
		{
			path: '/',
			element: <PrivateLayout />,
			children: [
				{ path: '/dashboard', async lazy() { let { Dashboard } = await import('../pages/private/Dashboard'); return { Component: Dashboard } } },
				{ path: '/admin/role', async lazy() { let { RolePage } = await import('../pages/private/admin/RolePage'); return { Component: RolePage } } },
				{ path: '/admin/user', async lazy() { let { UserPage } = await import('../pages/private/admin/UserPage'); return { Component: UserPage } } },
				{ path: "*", element: <NoMatch /> }
			]
		},
		{
			element: <PublicLayout/>,
			children: [
				{ path: '/login', async lazy() { let { Login } = await import('../pages/public/Login'); return { Component: Login } } },
			],
			hydrateFallbackElement: <></>
		}
	], {
			future: {
				v7_fetcherPersist: true,
				v7_normalizeFormMethod: true,
				v7_relativeSplatPath: true,
				v7_skipActionErrorRevalidation: true,
			}
	});

	return (
		<AppRouterContext.Provider value={{}}>
			<RouterProvider router={router} future={{ v7_startTransition: true }} fallbackElement={<p>Loading...</p>} />
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