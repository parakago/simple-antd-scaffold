import React from "react";

export interface IAppAuthState {

}

const AppAuthContext = React.createContext<IAppAuthState | undefined>(undefined);

export const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<AppAuthContext.Provider value={{ }}>
			{children}
		</AppAuthContext.Provider>
	);
}

export function useAppAuthContext() : IAppAuthState {
	const appAuthContext = React.useContext(AppAuthContext);
	if (appAuthContext == null) {
		throw new Error('useAppAuthContext() should be used within AppAuthContext.Provider');
	}

	return appAuthContext;
}