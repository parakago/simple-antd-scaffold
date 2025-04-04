import { App, ConfigProvider, ModalFuncProps, theme as antTheme } from 'antd';
import { MessageInstance } from "antd/es/message/interface";
import { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { Locale } from 'antd/lib/locale';
import enUS from 'antd/locale/en_US';
import koKR from 'antd/locale/ko_KR';
import React from "react";
import { NavigateOptions, To } from "react-router-dom";
import { setTranslations, setLocale } from 'react-i18nify';
import { en, ko } from '../locales'
import { APP_NAME, AppApi } from '@apis';

setTranslations({ en, ko });

class AppModal {
	private readonly _modal: Omit<ModalStaticFunctions, 'warn'>;
	constructor(modal: Omit<ModalStaticFunctions, 'warn'>) {
		this._modal = modal;
	}
	public error(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._modal.error({ title: APP_NAME, content, onOk: () => resolve() });
		});
	}
	public success(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._modal.success({ title: APP_NAME, content, onOk: () => resolve() });
		});
	}
	public info(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._modal.info({ title: APP_NAME, content, onOk: () => resolve() });
		});
	}
	public warning(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._modal.warning({ title: APP_NAME, content, onOk: () => resolve() });
		});
	}
	public confirm(content: React.ReactNode): Promise<boolean> {
		return new Promise((resolve) => {
			this._modal.confirm({ title: APP_NAME, content, onOk: () => resolve(true), onCancel: () => resolve(false) });
		});
	}
	public open(props: ModalFuncProps): Promise<void> {
		return new Promise((_) => {
			this._modal.info(props);
		});
	}
}

class AppMessage {
	private readonly _message: MessageInstance;
	constructor(message: MessageInstance) {
		this._message = message;
	}
	public error(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._message.error({ content, onClose: () => resolve() });
		});
	}
	public success(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._message.success({ content, onClose: () => resolve() });
		});
	}
	public info(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._message.info({ content, onClose: () => resolve() });
		});
	}
	public warning(content: React.ReactNode): Promise<void> {
		return new Promise((resolve) => {
			this._message.warning({ content, onClose: () => resolve() });
		});
	}
}

export interface IAppState {
	handleError(error: unknown): Promise<void>;
	theme: 'dark' | 'light';
	locale: Locale;
	changeTheme: (theme: 'dark' | 'light') => void;
	changeLocale: (locale: 'ko' | 'en') => void;
}

export interface IApp {
	modal: AppModal;
	message: AppMessage;
	navigate: (to: To, options?: NavigateOptions) => void;
	redirectToLogin: (redirectPathAfterLogin: string) => void;
}

let _appInstance: IApp;

const AppContext = React.createContext<IAppState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = React.useState<'dark' | 'light'>('light');
	const [antLocale, setAntLocale] = React.useState(window.navigator.language == 'ko' ? koKR : enUS);

	const { message, modal } = App.useApp();

	_appInstance = {
		modal: new AppModal(modal),
		message: new AppMessage(message),
		navigate: () => { console.log('[DEV-ERROR] Navigate not assigned'); }, // assigned in layout
		redirectToLogin: (redirectPathAfterLogin: string) => {
			_appInstance.navigate('/login', { 
				state: { redirectPathAfterLogin },
				replace: true
			});
		}
	}

	React.useEffect(() => {
		(async () => {
			const session = await AppApi.helo();
			setLocale(session.locale);
		})();
	});
	
	const changeTheme = (theme: 'dark' | 'light') => {
		setTheme(theme);
		document.body.style.backgroundColor = theme == 'dark' ? '#f6f8fb' : 'var(--ant-color-bg-container)';
	}

	const changeLocale = async (locale: 'ko' | 'en') => {
		setAntLocale(locale == 'ko' ? koKR : enUS);
		await AppApi.changeLocale(locale);
		location.reload();
	}

	const handleError = (error: unknown) : Promise<void> => {
		const message = error instanceof Error ? error.message : error as string;
		_appInstance.message.error(message);
		return Promise.resolve();
	}
	
	return (
		<AppContext.Provider value={{ handleError, locale: antLocale, theme, changeTheme, changeLocale }}>
			<ConfigProvider componentSize='middle' locale={antLocale}
				theme={{
					cssVar: true,
					algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
					token: {
						fontFamily: 'Spoqa Han Sans Neo, sans-serif'
					},
					components: {
						Layout: {
							headerBg: '#162333',
						},
						Form: {
							fontFamily: 'Spoqa Han Sans Neo, sans-serif'
						}
					}
				}}
			>
				{children}
			</ConfigProvider>
		</AppContext.Provider>
	);
}

export function useAppContext() : IAppState {
	const appContext = React.useContext(AppContext);
	if (appContext === undefined) {
		throw new Error('useAppContext() should be used within AppContext.Provider');
	}
	
	return appContext;
}

export { _appInstance as App };
