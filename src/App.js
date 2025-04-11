import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { InstallationProvider } from './context/InstallationContext';
import HomeScreen from './components/HomeScreen';
import BaseSystem from './components/BaseSystem';
import DesktopEnvironment from './components/DesktopEnvironment';
import SoftwareSelection from './components/SoftwareSelection';
import SystemConfig from './components/SystemConfig';
import SystemTweaks from './components/SystemTweaks';
import ISOGeneration from './components/ISOGeneration';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
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
          <Route path="/base-system" element={<BaseSystem />} />
          <Route path="/desktop-environment" element={<DesktopEnvironment />} />
          <Route path="/software-selection" element={<SoftwareSelection />} />
          <Route path="/system-config" element={<SystemConfig />} />
          <Route path="/tweaks" element={<SystemTweaks />} />
          <Route path="/iso-generation" element={<ISOGeneration />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <InstallationProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </InstallationProvider>
  );
}

export default App; 