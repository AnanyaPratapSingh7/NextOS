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
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  TextField,
  Divider,
} from '@mui/material';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Tweaks', 'ISO Generation'];

function SystemTweaks() {
  const navigate = useNavigate();
  const { state, dispatch } = useInstallation();
  const [tweaks, setTweaks] = useState(state.systemTweaks);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setTweaks(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    // Save system tweaks to state management
    dispatch({
      type: 'UPDATE_SYSTEM_TWEAKS',
      payload: tweaks
    });
    navigate('/generate');
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
            System Tweaks & Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure system preferences and additional tweaks for your installation.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Display Server
            </Typography>
            <RadioGroup
              value={tweaks.displayServer}
              onChange={handleChange}
              name="displayServer"
            >
              <FormControlLabel
                value="x11"
                control={<Radio />}
                label="X11 (Traditional)"
              />
              <FormControlLabel
                value="wayland"
                control={<Radio />}
                label="Wayland (Modern)"
              />
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Configuration
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tweaks.autoLogin}
                    onChange={handleChange}
                    name="autoLogin"
                  />
                }
                label="Enable Auto-login"
              />
            </FormGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Swap Configuration
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tweaks.swap}
                    onChange={handleChange}
                    name="swap"
                  />
                }
                label="Enable Swap"
              />
              {tweaks.swap && (
                <TextField
                  label="Swap Size (GB)"
                  type="number"
                  name="swapSize"
                  value={tweaks.swapSize}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
              )}
            </FormGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Partitioning
            </Typography>
            <RadioGroup
              value={tweaks.partitioning}
              onChange={handleChange}
              name="partitioning"
            >
              <FormControlLabel
                value="auto"
                control={<Radio />}
                label="Automatic Partitioning"
              />
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label="Manual Partitioning"
              />
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dotfiles
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tweaks.dotfiles}
                    onChange={handleChange}
                    name="dotfiles"
                  />
                }
                label="Import Dotfiles"
              />
              {tweaks.dotfiles && (
                <TextField
                  label="Dotfiles Repository URL"
                  name="dotfilesUrl"
                  value={tweaks.dotfilesUrl}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
              )}
            </FormGroup>
          </Box>

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

export default SystemTweaks; 