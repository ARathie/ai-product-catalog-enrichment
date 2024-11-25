// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import { Card, CircularProgress, Typography } from '@mui/material';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <Card className="loading-card">
      <div className="loading-content">
        <CircularProgress className="loading-spinner" />
        <Typography variant="body1" className="loading-text">
          Analyzing your catalog...
        </Typography>
      </div>
    </Card>
  );
}

export default LoadingSpinner;