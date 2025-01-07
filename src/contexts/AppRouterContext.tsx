import { Spin } from "antd";
import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Dashboard } from "../pages/main/Dashboard";
import { NoMatch } from "../pages/commons/NoMatch";
import EmptyLayout from "../layouts/EmptyLayout";
import { LoadingOutlined } from "@ant-design/icons";

export interface IAppRouteState {
	
}

const AppRouterContext = React.createContext<IAppRouteState | undefined>(undefined);

export const AppRouterContextProvider = () => {
	const [appInitialized, setAppInitialized] = React.useState(false);
	const router = createHashRouter([
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{ index: true, element: <Dashboard /> },
				{ path: '/dashboard', async lazy() { let { Dashboard } = await import('../pages/main/Dashboard'); return { Component: Dashboard } } },
				{ path: '/helo', async lazy() { let { Helo } = await import('../pages/main/Helo'); return { Component: Helo } } },
				{ path: "*", element: <NoMatch /> }
			]
		},
		{
			element: <EmptyLayout/>,
			children: [
				{ path: '/login', async lazy() { let { Login } = await import('../pages/empty/Login'); return { Component: Login } } },
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

	React.useEffect(() => {
		(async () => {
			// dynamic
			setAppInitialized(true);
		})();
	}, []);

	if (!appInitialized) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spin indicator={<LoadingOutlined className='text-5xl' spin />} />
			</div>
		);
	}
	
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