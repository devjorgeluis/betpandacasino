import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import './css/Home.css'
import './css/Poseidon.css'
import './css/Calendar.css'

// import './css/D.css'
// import './css/M.css'
// import './css/Ganamos.css'
// import './css/LiveCasino.css'
// import './css/Slot.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)