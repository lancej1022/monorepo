import { createRoot } from 'react-dom/client'

import './styles/reset.css'

import App from './App'

const container = document.getElementById('app')
if (!container) throw Error('no root found')

const root = createRoot(container)
root.render(<App />)
