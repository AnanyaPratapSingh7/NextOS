import React, { createContext, useContext, useReducer } from 'react';

const InstallationContext = createContext();

const initialState = {
  baseSystem: {
    baseArch: true,
    nvidiaDrivers: false,
    amdDrivers: false,
    intelDrivers: false,
    firmware: true,
  },
  desktopEnvironment: {
    type: 'desktop',
    selectedDE: '',
    selectedWM: '',
  },
  selectedPackages: {},
  systemTweaks: {
    displayServer: 'x11',
    autoLogin: false,
    swap: true,
    swapSize: '4',
    partitioning: 'auto',
    dotfiles: false,
    dotfilesUrl: '',
  },
  systemConfig: {
    keyboardLayout: 'us',
    mirrorRegion: 'Worldwide',
    bootloader: 'grub',
    audio: 'pipewire',
    kernel: 'linux',
    networkManager: 'networkmanager',
    timezone: 'UTC',
    locale: 'en_US.UTF-8',
    hostname: 'nextos',
    rootPassword: '',
    userAccount: {
      username: '',
      password: '',
      groups: ['wheel', 'audio', 'video', 'storage', 'optical', 'network', 'lp', 'scanner']
    }
  }
};

function installationReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_BASE_SYSTEM':
      return {
        ...state,
        baseSystem: action.payload
      };
    case 'UPDATE_DESKTOP_ENVIRONMENT':
      return {
        ...state,
        desktopEnvironment: action.payload
      };
    case 'UPDATE_SOFTWARE_SELECTION':
      return {
        ...state,
        selectedPackages: action.payload
      };
    case 'UPDATE_SYSTEM_TWEAKS':
      return {
        ...state,
        systemTweaks: action.payload
      };
    case 'UPDATE_SYSTEM_CONFIG':
      return {
        ...state,
        systemConfig: action.payload
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function InstallationProvider({ children }) {
  const [state, dispatch] = useReducer(installationReducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return (
    <InstallationContext.Provider value={value}>
      {children}
    </InstallationContext.Provider>
  );
}

export function useInstallation() {
  const context = useContext(InstallationContext);
  if (!context) {
    throw new Error('useInstallation must be used within an InstallationProvider');
  }
  return context;
} 