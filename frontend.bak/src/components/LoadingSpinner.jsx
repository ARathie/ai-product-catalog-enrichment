// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import { Spinner, Card } from 'react-bootstrap';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <Card className="text-center mt-4 loading-card">
      <Card.Body>
        <Spinner animation="border" role="status" variant="primary" className="mb-2" />
        <p className="loading-text">Enhancing your catalog, please wait...</p>
      </Card.Body>
    </Card>
  );
}

export default LoadingSpinner;