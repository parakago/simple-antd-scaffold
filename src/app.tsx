import '@ant-design/v5-patch-for-react-19';
import { AppContextProvider, AppRouterContextProvider, AppSessionProvider } from '@contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import './assets/fonts/SpoqaHanSansNeo.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<AppSessionProvider>
				<AppRouterContextProvider/>
			</AppSessionProvider>
		</AppContextProvider>
	</StrictMode>
)
