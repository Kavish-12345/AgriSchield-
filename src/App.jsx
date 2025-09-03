import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home'
import { WalletProvider } from './WalletConnect'
import ErrorBoundary from './contract/ErrorBoundry'
import Registration from './components/Registration';



const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
  <ErrorBoundary>
    <WalletProvider>
        <Router>
          <div className="App">
            <ScrollToTop /> {/* Add this component */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Registration" element={<Registration />} />
            </Routes>
          </div>
        </Router>
         </WalletProvider>
        </ErrorBoundary>
      
    
  )
}

export default App;