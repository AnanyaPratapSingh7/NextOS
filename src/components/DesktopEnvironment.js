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
  Divider,
} from '@mui/material';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Tweaks', 'ISO Generation'];

const desktopEnvironments = [
  { id: 'gnome', name: 'GNOME', description: 'Modern, feature-rich desktop environment' },
  { id: 'kde', name: 'KDE Plasma', description: 'Highly customizable desktop environment' },
  { id: 'xfce', name: 'XFCE', description: 'Lightweight and fast desktop environment' },
  { id: 'cinnamon', name: 'Cinnamon', description: 'Traditional desktop environment' },
  { id: 'mate', name: 'MATE', description: 'Fork of GNOME 2, traditional desktop' },
  { id: 'lxqt', name: 'LXQt', description: 'Lightweight Qt-based desktop environment' },
];

const windowManagers = [
  { id: 'i3', name: 'i3', description: 'Tiling window manager' },
  { id: 'bspwm', name: 'bspwm', description: 'Binary space partitioning window manager' },
  { id: 'hyprland', name: 'Hyprland', description: 'Dynamic tiling Wayland compositor' },
  { id: 'openbox', name: 'Openbox', description: 'Stacking window manager' },
  { id: 'sway', name: 'Sway', description: 'i3-compatible Wayland compositor' },
];

function DesktopEnvironment() {
  const navigate = useNavigate();
  const { state, dispatch } = useInstallation();
  const [desktopType, setDesktopType] = useState(state.desktopEnvironment.type);
  const [selectedDE, setSelectedDE] = useState(state.desktopEnvironment.selectedDE);
  const [selectedWM, setSelectedWM] = useState(state.desktopEnvironment.selectedWM);

  const handleDesktopTypeChange = (event) => {
    setDesktopType(event.target.value);
    setSelectedDE('');
    setSelectedWM('');
  };

  const handleNext = () => {
    // Save desktop environment options to state
    dispatch({
      type: 'UPDATE_DESKTOP_ENVIRONMENT',
      payload: {
        type: desktopType,
        selectedDE,
        selectedWM
      }
    });
    navigate('/software');
  };

  return (
    <Box>
      <Stepper activeStep={1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Desktop Environment Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Choose between a full desktop environment or a window manager.
          </Typography>

          <RadioGroup
            value={desktopType}
            onChange={handleDesktopTypeChange}
            sx={{ mb: 3 }}
          >
            <FormControlLabel
              value="desktop"
              control={<Radio />}
              label="Desktop Environment"
            />
            <FormControlLabel
              value="wm"
              control={<Radio />}
              label="Window Manager"
            />
          </RadioGroup>

          <Divider sx={{ my: 3 }} />

          {desktopType === 'desktop' ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Desktop Environment
              </Typography>
              <FormGroup>
                {desktopEnvironments.map((de) => (
                  <FormControlLabel
                    key={de.id}
                    control={
                      <Radio
                        checked={selectedDE === de.id}
                        onChange={(e) => setSelectedDE(e.target.value)}
                        value={de.id}
                        name="desktop-environment"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">{de.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {de.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Window Manager
              </Typography>
              <FormGroup>
                {windowManagers.map((wm) => (
                  <FormControlLabel
                    key={wm.id}
                    control={
                      <Radio
                        checked={selectedWM === wm.id}
                        onChange={(e) => setSelectedWM(e.target.value)}
                        value={wm.id}
                        name="window-manager"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">{wm.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {wm.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!((desktopType === 'desktop' && selectedDE) || (desktopType === 'wm' && selectedWM))}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DesktopEnvironment; 