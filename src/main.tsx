import { AppSessionProvider, AppContextProvider, AppRouterContextProvider } from '@contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<AppSessionProvider>
				<AppRouterContextProvider/>
			</AppSessionProvider>
		</AppContextProvider>
	</StrictMode>
)
