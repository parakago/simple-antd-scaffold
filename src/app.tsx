import '@ant-design/v5-patch-for-react-19';
import { AppContextProvider, AppRouterContextProvider, AppSessionProvider } from '@contexts';
import { App } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import './assets/fonts/SpoqaHanSansNeo.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App className='h-full'>
			<AppContextProvider>
				<AppSessionProvider>
					<AppRouterContextProvider/>
				</AppSessionProvider>
			</AppContextProvider>
		</App>
	</StrictMode>
)
