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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = ['Base System', 'Desktop Environment', 'Software Selection', 'System Configuration', 'System Tweaks', 'ISO Generation'];

const softwareCategories = [
  {
    id: 'browsers',
    name: 'Web Browsers',
    packages: [
      { id: 'firefox', name: 'Firefox', description: 'Mozilla Firefox web browser' },
      { id: 'chromium', name: 'Chromium', description: 'Google Chromium web browser' },
      { id: 'brave', name: 'Brave', description: 'Privacy-focused web browser' },
      { id: 'vivaldi', name: 'Vivaldi', description: 'Customizable web browser' },
      { id: 'librewolf', name: 'LibreWolf', description: 'Privacy-focused Firefox fork' },
    ],
  },
  {
    id: 'media',
    name: 'Media Players',
    packages: [
      { id: 'vlc', name: 'VLC', description: 'Versatile media player' },
      { id: 'mpv', name: 'MPV', description: 'Lightweight media player' },
      { id: 'smplayer', name: 'SMPlayer', description: 'Media player with GUI' },
    ],
  },
  {
    id: 'packageManagers',
    name: 'Package Managers',
    packages: [
      { id: 'yay', name: 'Yay', description: 'Yet Another Yogurt - AUR helper' },
      { id: 'paru', name: 'Paru', description: 'Feature packed AUR helper' },
      { id: 'trizen', name: 'Trizen', description: 'Lightweight AUR helper' },
    ],
  },
  {
    id: 'fileExplorers',
    name: 'File Explorers',
    packages: [
      { id: 'dolphin', name: 'Dolphin', description: 'KDE file manager' },
      { id: 'nautilus', name: 'Nautilus', description: 'GNOME file manager' },
      { id: 'thunar', name: 'Thunar', description: 'XFCE file manager' },
      { id: 'pcmanfm', name: 'PCManFM', description: 'Lightweight file manager' },
      { id: 'ranger', name: 'Ranger', description: 'Terminal-based file manager' },
    ],
  },
  {
    id: 'editors',
    name: 'Text Editors',
    packages: [
      { id: 'vim', name: 'Vim', description: 'Advanced text editor' },
      { id: 'nano', name: 'Nano', description: 'Simple text editor' },
      { id: 'neovim', name: 'Neovim', description: 'Modern Vim fork' },
      { id: 'vscode', name: 'VS Code', description: 'Visual Studio Code' },
      { id: 'kate', name: 'Kate', description: 'KDE advanced text editor' },
    ],
  },
];

function SoftwareSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useInstallation();
  const [selectedPackages, setSelectedPackages] = useState(state.selectedPackages);
  const [expandedCategory, setExpandedCategory] = useState('browsers');

  const handleCategoryChange = (categoryId) => (event, isExpanded) => {
    setExpandedCategory(isExpanded ? categoryId : false);
  };

  const handlePackageChange = (packageId) => (event) => {
    const newSelectedPackages = {
      ...selectedPackages,
      [packageId]: event.target.checked,
    };
    setSelectedPackages(newSelectedPackages);
  };

  const handleNext = () => {
    dispatch({
      type: 'UPDATE_SOFTWARE_SELECTION',
      payload: selectedPackages
    });
    navigate('/system-config');
  };

  return (
    <Box>
      <Stepper activeStep={2} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Software Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Choose additional software packages to include in your installation.
          </Typography>

          {softwareCategories.map((category) => (
            <Accordion
              key={category.id}
              expanded={expandedCategory === category.id}
              onChange={handleCategoryChange(category.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {category.packages.map((pkg) => (
                    <FormControlLabel
                      key={pkg.id}
                      control={
                        <Checkbox
                          checked={selectedPackages[pkg.id] || false}
                          onChange={handlePackageChange(pkg.id)}
                          name={pkg.id}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">{pkg.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pkg.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}

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

export default SoftwareSelection; 