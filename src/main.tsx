import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { AppContextProvider } from './contexts/AppContext';
import { AppRouterContextProvider } from './contexts/AppRouterContext';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppContextProvider>
			<AppRouterContextProvider/>
		</AppContextProvider>
	</StrictMode>,
)
