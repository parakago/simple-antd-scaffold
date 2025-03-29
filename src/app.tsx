import { AppContextProvider, AppRouterContextProvider } from '@contexts';
import { App } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import './assets/fonts/SpoqaHanSansNeo.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App className='h-full'>
			<AppContextProvider>
				<AppRouterContextProvider/>
			</AppContextProvider>
		</App>
	</StrictMode>
)
