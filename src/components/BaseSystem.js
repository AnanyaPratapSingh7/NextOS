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
} from '@mui/material';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Tweaks', 'ISO Generation'];

function BaseSystem() {
  const navigate = useNavigate();
  const { state, dispatch } = useInstallation();
  const [baseSystem, setBaseSystem] = useState(state.baseSystem);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    const newBaseSystem = {
      ...baseSystem,
      [name]: event.target.type === 'checkbox' ? checked : value,
    };
    setBaseSystem(newBaseSystem);
  };

  const handleNext = () => {
    // Save base system selection to state management
    dispatch({
      type: 'UPDATE_BASE_SYSTEM',
      payload: baseSystem
    });
    navigate('/desktop-environment');
  };

  return (
    <Box>
      <Stepper activeStep={0} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Base System Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select the base system components and drivers for your Arch Linux installation.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={baseSystem.baseArch}
                  onChange={handleChange}
                  name="baseArch"
                  disabled
                />
              }
              label="Base Arch Linux System"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={baseSystem.nvidiaDrivers}
                  onChange={handleChange}
                  name="nvidiaDrivers"
                />
              }
              label="NVIDIA Proprietary Drivers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={baseSystem.amdDrivers}
                  onChange={handleChange}
                  name="amdDrivers"
                />
              }
              label="AMD Open Source Drivers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={baseSystem.intelDrivers}
                  onChange={handleChange}
                  name="intelDrivers"
                />
              }
              label="Intel Graphics Drivers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={baseSystem.firmware}
                  onChange={handleChange}
                  name="firmware"
                />
              }
              label="Additional Firmware"
            />
          </FormGroup>

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

export default BaseSystem; 