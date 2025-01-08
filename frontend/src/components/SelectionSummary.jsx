import React from 'react';
import { 
  Typography,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EnhancedTable from './EnhancedTable';

function SelectionSummary({ selectedProducts, onBack, selectedItems, onSelectionChange }) {
  return (
    <div className="selection-summary">
      <div className="header">
        <IconButton 
          onClick={onBack}
          style={{ marginRight: '16px' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Selected Products ({selectedProducts.length})
        </Typography>
      </div>

      <Paper style={{ margin: '20px 0', padding: '20px' }}>
        <EnhancedTable
          initialData={[]}
          enhancedData={selectedProducts}
          setEnhancedData={() => {}}
          selectedItems={selectedItems}
          onSelectionChange={onSelectionChange}
        />
      </Paper>
    </div>
  );
}

export default SelectionSummary; 