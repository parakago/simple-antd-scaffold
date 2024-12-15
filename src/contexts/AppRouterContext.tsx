import React from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import { Spin } from "antd";
import MainLayout from "../layouts/MainLayout";
import { Dashboard } from "../pages/Dashboard";
import { NoMatch } from "../pages/commons/NoMatch";

export interface IAppRouteState {
	
}

const AppRouterContext = React.createContext<IAppRouteState | undefined>(undefined);

export const AppRouterContextProvider = () => {
	const [appInitialized, setAppInitialized] = React.useState(false);
	const routes = React.useRef<RouteObject[]>([{ path: '/', element: <EmptyLayout />}]);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{
					index: true,
					element: <Dashboard />,
				},
				{
					path: 'about',
					async lazy() {
						let { About } = await import('../pages/About');
						return { Component: About }
					}
				},
				{
					path: 'helo',
					async lazy() {
						let { Helo } = await import('../pages/Helo');
						return { Component: Helo }
					}
				},
				{
					path: "*",
					element: <NoMatch />,
				}
			]
		}
	]);

	React.useEffect(() => {
		(async () => {
			// dynamic
			setAppInitialized(true);
		})();
	}, []);

	if (!appInitialized) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spin tip="Initializing Router ..." className="align-middle" size="large">
					<div className="w-40 h-40"/>
				</Spin>
			</div>
		);
	}
	
	return (
		<AppRouterContext.Provider value={{}}>
			<RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
		</AppRouterContext.Provider>
		
	);
}

export function useAppRouterContext() : IAppRouteState {
	const appRouteContext = React.useContext(AppRouterContext);
	if (appRouteContext == null) {
		throw new Error('useAppRouterContext() should be used within AppRouterContext.Provider');
	}
	
	return appRouteContext;
}