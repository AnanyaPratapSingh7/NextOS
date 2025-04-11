import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstallation } from '../context/InstallationContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Tweaks', 'ISO Generation'];

function ISOGeneration() {
  const navigate = useNavigate();
  const { state } = useInstallation();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [isoName, setIsoName] = useState('nextos.iso');
  const [isoPath, setIsoPath] = useState('');
  const [savedLocation, setSavedLocation] = useState('');

  useEffect(() => {
    // Set up IPC listeners
    if (window.api) {
      window.api.receive('iso-progress', (progress) => {
        setProgress(progress);
      });

      window.api.receive('iso-complete', (result) => {
        setGenerating(false);
        if (result.success) {
          setIsoPath(result.isoPath);
          setIsoName(result.isoName || 'nextos.iso');
          setOpenDialog(true);
        } else {
          setError('Failed to generate ISO: ' + (result.message || 'Unknown error'));
        }
      });

      window.api.receive('iso-saved', (result) => {
        if (result.success) {
          setOpenDialog(false);
          setSavedLocation(result.filePath || 'your selected location');
          setOpenSuccessDialog(true);
        }
      });

      window.api.receive('iso-cancelled', () => {
        // Just close the dialog if the user cancelled
        setOpenDialog(false);
        navigate('/');
      });

      window.api.receive('iso-error', (errorMessage) => {
        setGenerating(false);
        if (errorMessage.includes('Docker is not installed')) {
          setError(
            <Box>
              <Typography variant="body1" gutterBottom>
                Docker is not installed or not running. Please install Docker Desktop for Windows:
              </Typography>
              <ol>
                <li>Download Docker Desktop from <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener noreferrer">Docker's official website</a></li>
                <li>Install Docker Desktop</li>
                <li>Start Docker Desktop</li>
                <li>Restart this application</li>
              </ol>
            </Box>
          );
        } else {
          setError('Error: ' + errorMessage);
        }
      });
    }

    // Automatically start the ISO generation process when the component is loaded
    handleGenerateISO();

    return () => {
      // Clean up listeners if component unmounts
      // (handled by the preload script's removeAllListeners)
    };
  }, [navigate]);

  const handleGenerateISO = () => {
    setGenerating(true);
    setProgress(0);
    setError(null);

    if (window.api) {
      // Use IPC to communicate with the main process
      window.api.send('generate-iso', state);
    } else {
      // Fallback for when not running in Electron
      simulateISOGeneration();
    }
  };

  const simulateISOGeneration = async () => {
    try {
      // Simulate ISO generation process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }
      setOpenDialog(true);
    } catch (err) {
      setError('Failed to generate ISO. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveISO = () => {
    if (window.api) {
      window.api.send('save-iso', { isoPath, isoName });
    } else {
      setOpenDialog(false);
      setSavedLocation('Downloads/nextos.iso');
      setOpenSuccessDialog(true);
    }
  };

  const handleReturn = () => {
    navigate('/');
  };

  const handleOkay = () => {
    setOpenSuccessDialog(false);
    navigate('/');
  };

  return (
    <Box>
      <Stepper activeStep={4} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Generate ISO
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Generate your custom Arch Linux ISO with all selected configurations.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {generating && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Generating ISO... {progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateISO}
              disabled={generating}
            >
              Generate ISO
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ISO Name Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>ISO Generated Successfully</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ISO Name"
            fullWidth
            value={isoName}
            onChange={(e) => setIsoName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturn}>Cancel</Button>
          <Button onClick={handleSaveISO} color="primary">
            Save ISO
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleOkay}>
        <DialogTitle>ISO Saved Successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your ISO has been saved at "{savedLocation}"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkay} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ISOGeneration; 