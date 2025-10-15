import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/css/bootstrap-grid.css";
import './css/Load.css'
import './css/Icon.css'
import './css/Home.css'
import './css/Casino.css'
import './css/Panda.css'
import './css/Maintenance.css'
import './css/CasinoSearch.css'
import './css/ColorPromotionText.css'
import './css/LandingPage.css'
import './css/Calendar.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)