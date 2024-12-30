import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';
import EnhancedTable from './EnhancedTable';
import Button from '@mui/material/Button';
import SelectionSummary from './SelectionSummary';
import UploadButton from './UploadButton';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import EnhanceOptionsModal from './EnhanceOptionsModal';
import Papa from 'papaparse';

function CatalogEnhancerBrand({ savedState, onStateChange }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    fillInDataGaps: false,
    fixCategories: false,
    generateNewAttributes: false,
    analyzeProductImages: false,
    additionalInstructions: ''
  });

  // Get unique brands from product table
  const getBrands = (products) => {
    const brands = new Set();
    products?.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  };

  const brands = getBrands(savedState?.productTable);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedItems(selectedIds);
    onStateChange({
      ...savedState,
      selectedItems: selectedIds
    });
  };

  // Filter products by brand
  const getBrandProducts = (brand) => {
    return savedState?.productTable?.filter(product => product.brand === brand) || [];
  };

  // Get total number of selected items across all brands
  const getTotalSelectedCount = () => selectedItems.length;

  // Get number of selected items in current brand view
  const getSelectedCountInCurrentView = () => {
    const currentProducts = getBrandProducts(selectedBrand);
    return selectedItems.filter(id => 
      currentProducts.some(product => product.product_id === id)
    ).length;
  };

  const handleNext = () => {
    setShowSummary(true);
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleEnhance = (file) => {
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (!savedState?.productTable || savedState.productTable.length === 0) {
      alert('No data available to export.');
      return;
    }

    const csv = Papa.unparse(savedState.productTable);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'enhanced_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeOptions = () => {
    setIsModalOpen(true);
  };

  if (showSummary) {
    return (
      <SelectionSummary 
        selectedProducts={savedState?.productTable?.filter(product => 
          selectedItems.includes(product.product_id)
        )}
        onBack={handleBack}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
      />
    );
  }

  return (
    <div className="brand-view">
      <div className="sidebar-panel">
        <Typography variant="h6" gutterBottom>
          Brands
        </Typography>
        {getTotalSelectedCount() > 0 && (
          <Typography variant="body2" color="primary" style={{ marginBottom: '16px' }}>
            {getTotalSelectedCount()} item{getTotalSelectedCount() === 1 ? '' : 's'} selected total
          </Typography>
        )}
        <List>
          {brands.map((brand) => {
            const brandProducts = getBrandProducts(brand);
            const selectedInBrand = selectedItems.filter(id => 
              brandProducts.some(product => product.product_id === id)
            ).length;

            return (
              <ListItem
                button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                selected={selectedBrand === brand}
              >
                <ListItemText primary={brand} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {selectedInBrand > 0 && (
                    <Chip 
                      label={`${selectedInBrand} selected`}
                      size="small"
                      color="primary"
                    />
                  )}
                  <Chip 
                    label={brandProducts.length}
                    size="small"
                  />
                </div>
              </ListItem>
            );
          })}
        </List>
      </div>
      
      <div className="content-panel">
        <div className="button-row" style={{ marginBottom: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Typography variant="h6" style={{ marginBottom: '8px' }}>
              {selectedBrand || 'All Brands'}
            </Typography>
            {selectedBrand && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {getSelectedCountInCurrentView() > 0 && (
                  <Chip
                    label={`${getSelectedCountInCurrentView()} selected in view`}
                    color="primary"
                  />
                )}
                {getTotalSelectedCount() > getSelectedCountInCurrentView() && (
                  <Chip
                    label={`${getTotalSelectedCount()} selected total`}
                    variant="outlined"
                    color="primary"
                  />
                )}
              </div>
            )}
          </div>
          <div className="button-group" style={{ flexShrink: 0 }}>
            <UploadButton onUpload={handleEnhance} />
            {savedState?.productTable && savedState.productTable.length > 0 && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangeOptions}
                >
                  <SettingsIcon />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExport}
                >
                  <DownloadIcon />
                </Button>
                {selectedItems.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {selectedBrand ? (
          <EnhancedTable
            initialData={[]}
            enhancedData={getBrandProducts(selectedBrand)}
            setEnhancedData={() => {}}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
          />
        ) : (
          <div className="empty-state">
            <Typography>Select a brand to view products</Typography>
          </div>
        )}

        <EnhanceOptionsModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          options={enhanceOptions}
          setOptions={setEnhanceOptions}
          handleConfirm={() => {
            // Add your enhance logic here
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default CatalogEnhancerBrand; 