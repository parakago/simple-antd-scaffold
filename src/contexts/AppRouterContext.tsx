import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import { NoMatch } from "../pages/commons/NoMatch";
import { Dashboard } from "../pages/private/Dashboard";

export interface IAppRouteState {
	
}

const AppRouterContext = React.createContext<IAppRouteState | undefined>(undefined);

export const AppRouterContextProvider = () => {
	const router = createHashRouter([
		{
			path: '/',
			element: <PrivateLayout />,
			children: [
				{ index: true, element: <Dashboard /> },
				{ path: '/dashboard', async lazy() { let { Dashboard } = await import('../pages/private/Dashboard'); return { Component: Dashboard } } },
				{ path: '/helo', async lazy() { let { Helo } = await import('../pages/private/Helo'); return { Component: Helo } } },
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