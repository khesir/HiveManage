import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './components/css/global.css';
import {ThemeProvider} from './components/providers/theme-provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
