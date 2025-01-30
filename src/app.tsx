import { AppContextProvider, AppRouterContextProvider, AppSessionProvider } from '@contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/fonts/SpoqaHanSansNeo.css';
import './app.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<AppSessionProvider>
				<AppRouterContextProvider/>
			</AppSessionProvider>
		</AppContextProvider>
	</StrictMode>
)
