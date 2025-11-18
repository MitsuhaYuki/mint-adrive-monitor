import '@ant-design/v5-patch-for-react-19'
import { App } from './layout/App'
import { createRoot } from 'react-dom/client'
import './assets/main.css'

createRoot(document.getElementById('root')!).render(<App />)
