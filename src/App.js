import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { InstallationProvider } from './context/InstallationContext';
import HomeScreen from './components/HomeScreen';
import BaseSystem from './components/BaseSystem';
import DesktopEnvironment from './components/DesktopEnvironment';
import SoftwareSelection from './components/SoftwareSelection';
import SystemTweaks from './components/SystemTweaks';
import ISOGeneration from './components/ISOGeneration';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <InstallationProvider>
      <Box sx={{ flexGrow: 1 }}>
        {!isHomePage && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                NextOS
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        <Container maxWidth="lg" sx={{ mt: isHomePage ? 0 : 4 }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/base" element={<BaseSystem />} />
            <Route path="/desktop" element={<DesktopEnvironment />} />
            <Route path="/software" element={<SoftwareSelection />} />
            <Route path="/tweaks" element={<SystemTweaks />} />
            <Route path="/generate" element={<ISOGeneration />} />
          </Routes>
        </Container>
      </Box>
    </InstallationProvider>
  );
}

export default App; 