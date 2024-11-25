import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EnhanceOptionsModal from './EnhanceOptionsModal';
import Papa from 'papaparse';
import './ProductPairings.css';
import pairingsData from '../data/productPairings.json'; // Importing the JSON data

function ProductPairings() {
  const [pairings, setPairings] = useState(pairingsData);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
  const [editValue, setEditValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    additionalInstructions: ''
  });

  const handleEditClick = (rowIndex, field, currentValue) => {
    setEditingCell({ rowIndex, field });
    setEditValue(currentValue);
  };

  const handleSaveClick = (rowIndex, field) => {
    const updatedPairings = [...pairings];
    updatedPairings[rowIndex][field] = editValue.split(',').map(p => p.trim());
    setPairings(updatedPairings);
    setEditingCell({ rowIndex: null, field: null });
    setEditValue('');
  };

  const handleFieldChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleExport = () => {
    if (pairings.length === 0) {
      alert('No pairings data to export.');
      return;
    }

    const csv = Papa.unparse(pairings.map(product => ({
      product_name: product.product_name,
      pairings: product.pairings.join('; ') // Use semicolon to separate pairings
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'product_pairings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    console.log('User Instructions:', enhanceOptions.additionalInstructions);
    // Implement functionality based on user instructions
    setIsModalOpen(false);
    // For demonstration, we'll regenerate pairings with instructions
    generatePairingsWithInstructions(pairings, enhanceOptions.additionalInstructions);
  };

  const generatePairingsWithInstructions = (data, instructions) => {
    // Placeholder for using instructions to modify pairing logic
    // Since this is a demo, we won't implement AI pairing
    // You can integrate AI pairing logic here based on instructions
    console.log("Instructions received:", instructions);
    // For now, do nothing
  };

  return (
    <div className="product-pairings-container">
      <Typography variant="h4" gutterBottom>
        Product Pairings
      </Typography>
      <div className="button-row">
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={pairings.length === 0}
        >
          Export Pairings
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginLeft: '16px' }}
        >
          Options
        </Button>
      </div>
      <TableContainer component={Paper} className="pairings-table-container">
        <Table aria-label="product pairings table" className="pairings-table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Pairings</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pairings.map((product, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Tooltip title={product.product_name || ''} arrow>
                    <span className="cell-text">{product.product_name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="pairing-container">
                    {editingCell.rowIndex === idx && editingCell.field === 'pairings' ? (
                      <>
                        <TextField
                          value={editValue}
                          onChange={handleFieldChange}
                          variant="standard"
                          className="edit-input"
                          autoFocus
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleSaveClick(idx, 'pairings')}
                          className="save-button"
                          aria-label="save"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Tooltip title={product.pairings.join(', ')} arrow>
                          <span className="cell-text">{product.pairings.join(', ')}</span>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(idx, 'pairings', product.pairings.join(', '))}
                          className="edit-button"
                          aria-label="edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EnhanceOptionsModal
        open={isModalOpen}
        handleClose={handleModalClose}
        options={enhanceOptions}
        setOptions={setEnhanceOptions}
        handleConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default ProductPairings; 