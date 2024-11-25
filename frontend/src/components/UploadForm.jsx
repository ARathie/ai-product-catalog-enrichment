// frontend/src/components/UploadForm.jsx
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './UploadForm.css';

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card className="upload-card">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <FaCloudUploadAlt size={50} className="upload-icon" />
          </div>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Your Product Catalog (CSV)</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" size="lg" type="submit">
              Upload and Enhance
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UploadForm;