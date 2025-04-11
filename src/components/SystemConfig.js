import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstallation } from '../context/InstallationContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
} from '@mui/material';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Configuration', 'System Tweaks', 'ISO Generation'];

const keyboardLayouts = [
  { value: 'us', label: 'US' },
  { value: 'uk', label: 'UK' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'jp', label: 'Japanese' },
  { value: 'kr', label: 'Korean' },
  { value: 'cn', label: 'Chinese' },
];

const mirrorRegions = [
  'Worldwide',
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'China',
  'India',
  'Australia',
  'Brazil',
  'Russia',
];

const bootloaders = [
  { value: 'grub', label: 'GRUB' },
  { value: 'systemd-boot', label: 'systemd-boot' },
  { value: 'refind', label: 'rEFInd' },
];

const audioSystems = [
  { value: 'pipewire', label: 'PipeWire' },
  { value: 'pulseaudio', label: 'PulseAudio' },
];

const kernels = [
  { value: 'linux', label: 'Linux (Standard)' },
  { value: 'linux-lts', label: 'Linux LTS' },
  { value: 'linux-zen', label: 'Linux Zen' },
  { value: 'linux-hardened', label: 'Linux Hardened' },
];

const networkManagers = [
  { value: 'networkmanager', label: 'NetworkManager' },
  { value: 'systemd-networkd', label: 'systemd-networkd' },
  { value: 'connman', label: 'ConnMan' },
];

const userGroups = [
  'wheel',
  'audio',
  'video',
  'storage',
  'optical',
  'network',
  'lp',
  'scanner',
  'power',
  'docker',
  'kvm',
  'libvirt',
  'input',
  'uucp',
  'rfkill',
  'plugdev',
];

function SystemConfig() {
  const navigate = useNavigate();
  const { state, dispatch } = useInstallation();
  const [systemConfig, setSystemConfig] = useState(state.systemConfig);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSystemConfig(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleUserAccountChange = (event) => {
    const { name, value } = event.target;
    setSystemConfig(prev => ({
      ...prev,
      userAccount: {
        ...prev.userAccount,
        [name]: value,
      },
    }));
  };

  const handleGroupsChange = (event) => {
    const { value } = event.target;
    setSystemConfig(prev => ({
      ...prev,
      userAccount: {
        ...prev.userAccount,
        groups: value,
      },
    }));
  };

  const handleNext = () => {
    dispatch({
      type: 'UPDATE_SYSTEM_CONFIG',
      payload: systemConfig
    });
    navigate('/tweaks');
  };

  return (
    <Box>
      <Stepper activeStep={3} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            System Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure basic system settings for your Arch Linux installation.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Keyboard Layout</InputLabel>
              <Select
                name="keyboardLayout"
                value={systemConfig.keyboardLayout}
                onChange={handleChange}
                label="Keyboard Layout"
              >
                {keyboardLayouts.map((layout) => (
                  <MenuItem key={layout.value} value={layout.value}>
                    {layout.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Mirror Region</InputLabel>
              <Select
                name="mirrorRegion"
                value={systemConfig.mirrorRegion}
                onChange={handleChange}
                label="Mirror Region"
              >
                {mirrorRegions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Bootloader</InputLabel>
              <Select
                name="bootloader"
                value={systemConfig.bootloader}
                onChange={handleChange}
                label="Bootloader"
              >
                {bootloaders.map((loader) => (
                  <MenuItem key={loader.value} value={loader.value}>
                    {loader.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Audio System</InputLabel>
              <Select
                name="audio"
                value={systemConfig.audio}
                onChange={handleChange}
                label="Audio System"
              >
                {audioSystems.map((system) => (
                  <MenuItem key={system.value} value={system.value}>
                    {system.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Kernel</InputLabel>
              <Select
                name="kernel"
                value={systemConfig.kernel}
                onChange={handleChange}
                label="Kernel"
              >
                {kernels.map((kernel) => (
                  <MenuItem key={kernel.value} value={kernel.value}>
                    {kernel.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Network Manager</InputLabel>
              <Select
                name="networkManager"
                value={systemConfig.networkManager}
                onChange={handleChange}
                label="Network Manager"
              >
                {networkManagers.map((manager) => (
                  <MenuItem key={manager.value} value={manager.value}>
                    {manager.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            System Settings
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Timezone"
              name="timezone"
              value={systemConfig.timezone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Locale"
              name="locale"
              value={systemConfig.locale}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Hostname"
              name="hostname"
              value={systemConfig.hostname}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              label="Root Password"
              name="rootPassword"
              value={systemConfig.rootPassword}
              onChange={handleChange}
            />
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            User Account
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={systemConfig.userAccount.username}
              onChange={handleUserAccountChange}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={systemConfig.userAccount.password}
              onChange={handleUserAccountChange}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>User Groups</InputLabel>
            <Select
              multiple
              value={systemConfig.userAccount.groups}
              onChange={handleGroupsChange}
              input={<OutlinedInput label="User Groups" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {userGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  <Checkbox checked={systemConfig.userAccount.groups.indexOf(group) > -1} />
                  <ListItemText primary={group} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SystemConfig; 