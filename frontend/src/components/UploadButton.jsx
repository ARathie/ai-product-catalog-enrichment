import React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UploadButton({ onUpload }) {
  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <label htmlFor="upload-csv">
      <input
        accept=".csv"
        id="upload-csv"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button
        variant="contained"
        color="primary"
        component="span"
        startIcon={<CloudUploadIcon />}
      >
        Upload Catalog
      </Button>
    </label>
  );
}

export default UploadButton;