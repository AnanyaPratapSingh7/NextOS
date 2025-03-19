import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';

function HomeScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/base');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            NextOS
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your custom Arch Linux distribution with ease
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
            >
              Start Creating ISO
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default HomeScreen; 