import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  TextField,
  Grid,
  Button
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import './EnhancedTable.css';

function EnhancedTable({ initialData, enhancedData, setEnhancedData }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  const isNewAttribute = (key) => {
    return ['enhanced_description', 'care_instructions', 'tags', 'color_synonyms'].includes(key);
  };

  const isEnhancedValue = (initialValue, enhancedValue) => {
    return initialValue === '' && enhancedValue !== '' && enhancedValue !== undefined;
  };

  const formatHeader = (header) => {
    return header
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleFieldChange = (rowIndex, field, value) => {
    const updatedData = [...enhancedData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setEnhancedData(updatedData);
  };

  const toggleEditing = (index) => {
    setEditingRow(prev => (prev === index ? null : index));
  };

  // Core attributes to always show in the main row
  const coreAttributes = ['product_name', 'product_id', 'category', 'price'];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="enhanced catalog table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" /> {/* For expand/collapse icon */}
            {coreAttributes.map((header) => (
              <TableCell key={header}>
                <strong>{formatHeader(header)}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {enhancedData.map((row, index) => {
            const initial = initialData[index] || {};
            return (
              <React.Fragment key={row.product_id}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <IconButton size="small" onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                      {expandedRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  {coreAttributes.map((attr) => (
                    <TableCell 
                      key={attr}
                      className={isEnhancedValue(initial[attr], row[attr]) ? 'highlight-filled' : ''}
                    >
                      {row[attr]}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={coreAttributes.length + 1}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Additional Details
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(row)
                            .filter(([key]) => !coreAttributes.includes(key))
                            .map(([key, value]) => {
                              const isNew = isNewAttribute(key);
                              const isEnhanced = isEnhancedValue(initial[key], value);
                              return (
                                <Grid item xs={6} key={key}>
                                  <Box className={`detail-field ${isNew ? 'new-attribute' : ''} ${isEnhanced ? 'highlight-filled' : ''}`}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      {formatHeader(key)}
                                      {(isNew || isEnhanced) && (
                                        <AutoFixHighIcon 
                                          fontSize="small" 
                                          color="success"
                                          sx={{ marginLeft: 1, verticalAlign: 'middle' }}
                                        />
                                      )}
                                    </Typography>
                                    {editingRow === index ? (
                                      <TextField
                                        value={value || ''}
                                        onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                      />
                                    ) : (
                                      <Typography>{value || '-'}</Typography>
                                    )}
                                  </Box>
                                </Grid>
                              );
                            })}
                        </Grid>
                        <Box sx={{ marginTop: 2 }}>
                          {editingRow === index ? (
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => setEditingRow(null)}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button 
                              variant="outlined" 
                              color="secondary" 
                              onClick={() => toggleEditing(index)}
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EnhancedTable;