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
  Button,
  Checkbox
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import './EnhancedTable.css';

function EnhancedTable({
  initialData,
  enhancedData,
  setEnhancedData,
  selectedItems,
  onSelectionChange
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingField, setEditingField] = useState(null);

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
    setEditingField(prev => (prev === index ? null : index));
  };

  // Core attributes to always show in the main row
  const coreAttributes = ['product_name', 'product_id', 'category', 'price'];

  const isCategoryEnhanced = (item) => {
    const initialItem = initialData.find(init => init.product_id === item.product_id);
    return initialItem ? item.category !== initialItem.category : false;
  };

  const isEditing = (rowIndex, fieldName) => {
    return editingField === `${rowIndex}-${fieldName}`;
  };

  const handleSaveField = (rowIndex, fieldName) => {
    setEditingField(null);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = enhancedData.map((item) => item.product_id);
      onSelectionChange(newSelected);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedItems, id];
    } else {
      newSelected = selectedItems.filter((itemId) => itemId !== id);
    }

    onSelectionChange(newSelected);
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="enhanced catalog table" size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedItems.length > 0 && selectedItems.length < enhancedData.length}
                checked={selectedItems.length === enhancedData.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell 
              style={{ 
                width: '40px', 
                padding: '6px 0 6px 6px',
                borderRight: 'none'
              }} 
            />
            {coreAttributes.map((header) => (
              <TableCell 
                key={header}
                style={header === 'product_name' ? { paddingLeft: '0' } : {}}
              >
                <strong>{formatHeader(header)}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {enhancedData.map((row, index) => {
            const initial = initialData[index] || {};
            const isItemSelected = selectedItems.includes(row.product_id);
            
            return (
              <React.Fragment key={row.product_id}>
                <TableRow
                  selected={isItemSelected}
                  onClick={(e) => {
                    if (!e.target.closest('button') && !e.target.closest('.MuiIconButton-root')) {
                      const selectedIndex = selectedItems.indexOf(row.product_id);
                      let newSelected = [];

                      if (selectedIndex === -1) {
                        newSelected = [...selectedItems, row.product_id];
                      } else {
                        newSelected = selectedItems.filter(id => id !== row.product_id);
                      }

                      onSelectionChange(newSelected);
                    }
                  }}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={isItemSelected}
                      onChange={(e) => {
                        const selectedIndex = selectedItems.indexOf(row.product_id);
                        let newSelected = [];

                        if (selectedIndex === -1) {
                          newSelected = [...selectedItems, row.product_id];
                        } else {
                          newSelected = selectedItems.filter(id => id !== row.product_id);
                        }

                        onSelectionChange(newSelected);
                      }}
                    />
                  </TableCell>
                  <TableCell 
                    style={{ 
                      width: '40px', 
                      padding: '6px 0 6px 6px',
                      borderRight: 'none'
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    >
                      {expandedRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  {coreAttributes.map((attr) => (
                    <TableCell 
                      key={attr}
                      className={isEnhancedValue(initial[attr], row[attr]) ? 'highlight-filled' : ''}
                      style={attr === 'product_name' ? { paddingLeft: '0' } : {}}
                    >
                      {attr === 'category' ? (
                        <>
                          {row[attr]}
                          {isCategoryEnhanced(row) && <AutoFixHighIcon className="enhanced-icon" />}
                        </>
                      ) : (
                        row[attr]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={coreAttributes.length + 1}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Grid container spacing={2}>
                          {Object.entries(row)
                            .filter(([key]) => !coreAttributes.includes(key))
                            .map(([key, value]) => {
                              const isNew = isNewAttribute(key);
                              const isEnhanced = isEnhancedValue(initial[key], value);
                              const isFieldEditing = isEditing(index, key);
                              
                              return (
                                <Grid item xs={6} key={key}>
                                  <Box 
                                    className={`detail-field ${isNew ? 'new-attribute' : ''} 
                                      ${isEnhanced ? 'highlight-filled' : ''} 
                                      ${isFieldEditing ? 'editing' : ''}`}
                                  >
                                    <Typography variant="subtitle2" gutterBottom>
                                      {formatHeader(key)}
                                      {(isNew || isEnhanced) && (
                                        <AutoFixHighIcon 
                                          className="enhanced-icon"
                                          fontSize="small"
                                        />
                                      )}
                                    </Typography>
                                    
                                    {isFieldEditing ? (
                                      <TextField
                                        value={value || ''}
                                        onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        autoFocus
                                      />
                                    ) : (
                                      <Typography>{value || '-'}</Typography>
                                    )}
                                    
                                    {/* Edit/Save Icon */}
                                    {isFieldEditing ? (
                                      <IconButton
                                        className="edit-icon"
                                        size="small"
                                        onClick={() => handleSaveField(index, key)}
                                      >
                                        <CheckIcon fontSize="small" />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        className="edit-icon"
                                        size="small"
                                        onClick={() => setEditingField(`${index}-${key}`)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Grid>
                              );
                            })}
                        </Grid>
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