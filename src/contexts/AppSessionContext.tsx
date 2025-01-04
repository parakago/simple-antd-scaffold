import React from "react";

export interface IAppSessionState {

}

const AppSessionContext = React.createContext<IAppSessionState | undefined>(undefined);

export const AppSessionProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<AppSessionContext.Provider value={{ }}>
			{children}
		</AppSessionContext.Provider>
	);
}

export function useAppSessionContext() : IAppSessionState {
	const appSessionContext = React.useContext(AppSessionContext);
	if (appSessionContext === undefined) {
		throw new Error('useAppSessionContext() should be used within AppSessionContext.Provider');
	}

	return appSessionContext;
}