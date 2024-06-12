import { createRoot } from 'react-dom/client';
import App from './App';
import { StorageProvider } from './contexts/storage';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <StorageProvider>
    <App />
  </StorageProvider>,
);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg: any) => {
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
