import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Collapse,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EnhancedTable from './EnhancedTable';
import SelectionSummary from './SelectionSummary';
import UploadButton from './UploadButton';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';
import EnhanceOptionsModal from './EnhanceOptionsModal';

function CatalogEnhancerCategory({ savedState, onStateChange }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    fillInDataGaps: false,
    fixCategories: false,
    generateNewAttributes: false,
    analyzeProductImages: false,
    additionalInstructions: ''
  });
  
  // Create category structure from product table
  const createCategoryStructure = (products) => {
    const structure = {};
    products?.forEach(product => {
      if (!structure[product.category]) {
        structure[product.category] = new Set();
      }
      if (product.subcategory) {
        structure[product.category].add(product.subcategory);
      }
    });

    // Convert Sets to Arrays
    Object.keys(structure).forEach(category => {
      structure[category] = Array.from(structure[category]);
    });

    return structure;
  };

  const categories = createCategoryStructure(savedState?.productTable);

  const handleCategorySelect = (category, subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedItems(selectedIds);
    onStateChange({
      ...savedState,
      selectedItems: selectedIds
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Get all products that match the current view's criteria
  const getCategoryProducts = (category, subcategory) => {
    return savedState?.productTable?.filter(product => 
      product.category === category && 
      (!subcategory || product.subcategory === subcategory)
    ) || [];
  };

  // Get total number of selected items in current view
  const getSelectedCountInCurrentView = () => {
    const currentProducts = getCategoryProducts(selectedCategory, selectedSubcategory);
    return selectedItems.filter(id => 
      currentProducts.some(product => product.product_id === id)
    ).length;
  };

  // Get total number of selected items across all categories
  const getTotalSelectedCount = () => selectedItems.length;

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
    <div className="category-view">
      <div className="sidebar-panel">
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        {getTotalSelectedCount() > 0 && (
          <Typography variant="body2" color="primary" style={{ marginBottom: '16px' }}>
            {getTotalSelectedCount()} item{getTotalSelectedCount() === 1 ? '' : 's'} selected total
          </Typography>
        )}
        <List>
          {Object.entries(categories).map(([mainCategory, subcategories]) => {
            const categoryProducts = getCategoryProducts(mainCategory, null);
            const selectedInCategory = selectedItems.filter(id => 
              categoryProducts.some(product => product.product_id === id)
            ).length;

            return (
              <React.Fragment key={mainCategory}>
                <ListItem 
                  button 
                  onClick={(e) => {
                    if (!e.target.closest('button')) {
                      handleCategorySelect(mainCategory, null);
                    }
                  }}
                  selected={selectedCategory === mainCategory && !selectedSubcategory}
                  style={{ paddingLeft: '16px' }}
                >
                  <IconButton 
                    size="small" 
                    style={{ marginRight: '8px' }}
                    onClick={() => toggleCategory(mainCategory)}
                  >
                    {expandedCategories[mainCategory] ? 
                      <ExpandMoreIcon /> : 
                      <ChevronRightIcon />
                    }
                  </IconButton>
                  <ListItemText primary={mainCategory} />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedInCategory > 0 && (
                      <Chip 
                        label={`${selectedInCategory} selected`}
                        size="small"
                        color="primary"
                      />
                    )}
                    <Chip 
                      label={categoryProducts.length}
                      size="small"
                    />
                  </div>
                </ListItem>
                <Collapse in={expandedCategories[mainCategory]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subcategories.map(subcategory => {
                      // Count selected items in this subcategory
                      const subcategoryProducts = getCategoryProducts(mainCategory, subcategory);
                      const selectedInSubcategory = selectedItems.filter(id => 
                        subcategoryProducts.some(product => product.product_id === id)
                      ).length;

                      return (
                        <ListItem
                          button
                          key={subcategory}
                          onClick={() => handleCategorySelect(mainCategory, subcategory)}
                          selected={selectedSubcategory === subcategory}
                          style={{ paddingLeft: '48px' }}
                        >
                          <ListItemText primary={subcategory} />
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {selectedInSubcategory > 0 && (
                              <Chip 
                                label={`${selectedInSubcategory} selected`}
                                size="small"
                                color="primary"
                              />
                            )}
                            <Chip 
                              label={subcategoryProducts.length}
                              size="small"
                            />
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </div>
      
      <div className="content-panel">
        <div className="button-row" style={{ marginBottom: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Typography variant="h6" style={{ marginBottom: '8px' }}>
              {selectedCategory ? (
                <>
                  {selectedCategory}
                  {selectedSubcategory && ` > ${selectedSubcategory}`}
                </>
              ) : (
                'All Categories'
              )}
            </Typography>
            {selectedCategory && (
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

        {selectedCategory ? (
          <EnhancedTable
            initialData={[]}
            enhancedData={getCategoryProducts(selectedCategory, selectedSubcategory)}
            setEnhancedData={() => {}}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
          />
        ) : (
          <div className="empty-state">
            <Typography>Select a category to view products</Typography>
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

export default CatalogEnhancerCategory; 