import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CloudGate } from './components/CloudGate';

createRoot(document.getElementById('root')!).render(import.meta.env.VITE_CLOUD_LOGIN === 'true' ? <CloudGate><App /></CloudGate> : <App />);
