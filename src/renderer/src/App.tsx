import './styles/globals.css'
import Routes from './routes'
import { Toaster } from '@renderer/components/ui/sonner'
import { useInitApp } from './hooks/useInitApp'
import Dock from './components/nav/Dock'

function App(): JSX.Element {
  useInitApp()

  return (
    <>
      <Dock />

      <Routes />
      
      <Toaster />
    </>
  )
}

export default App
