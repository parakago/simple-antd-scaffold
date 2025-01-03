import { AppAuthProvider, AppContextProvider, AppRouterContextProvider } from '@contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<AppAuthProvider>
				<AppRouterContextProvider/>
			</AppAuthProvider>
		</AppContextProvider>
	</StrictMode>
)
