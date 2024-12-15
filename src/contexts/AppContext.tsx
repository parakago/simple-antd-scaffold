import React from "react";
import { App, ConfigProvider, theme } from 'antd';
import koKR from 'antd/locale/ko_KR';
//import enUS from 'antd/locale/en_US';

export interface IAppState {
	handleError(error: unknown): Promise<void>;
	getCurrentTheme(): 'dark' | 'light';
	changeAppTheme(theme: 'dark' | 'light'): void;
}

const AppContext = React.createContext<IAppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [appTheme, setAppTheme] = React.useState<'dark' | 'light'>('light');
	const [locale] = React.useState(koKR);

	const changeAppTheme = (theme: 'dark' | 'light') => {
		setAppTheme(theme);
		document.body.style.backgroundColor = appTheme == 'dark' ? '#f6f8fb' : 'var(--ant-color-bg-container)';
	}

	const getCurrentTheme = () => appTheme;

	const handleError = (error: unknown) : Promise<void> => {
		const message = error instanceof Error ? error.message : error as string;
		alert(message);
		return Promise.resolve();
	}
	
    return (
		<AppContext.Provider value={{ handleError, getCurrentTheme, changeAppTheme }}>
			<ConfigProvider componentSize='middle' locale={locale}
				theme={{
					cssVar: true,
					algorithm: appTheme == 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
					components: {
						Layout: {
							headerBg: '#162333',
						}
					}
				}}
			>
				<App>
					{children}
				</App>
			</ConfigProvider>
		</AppContext.Provider>
	);
}

export function useAppContext() : IAppState {
	const appContext = React.useContext(AppContext);
	if (appContext == null) {
		throw new Error('useAppContext() should be used within AppContext.Provider');
	}
	
	return appContext;
}