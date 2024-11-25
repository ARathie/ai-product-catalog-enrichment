import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadButton from './UploadButton';
import EnhancedTable from './EnhancedTable';
import EnhanceOptionsModal from './EnhanceOptionsModal';
import initialCatalog from '../data/initialCatalog.json';
import enhancedCatalog from '../data/enhancedCatalog.json';
import Papa from 'papaparse';
import './CatalogEnhancer.css';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';

function CatalogEnhancer({ savedState, onStateChange }) {
  const [uploadedData, setUploadedData] = useState(savedState?.uploadedData || []);
  const [productTable, setProductTable] = useState(savedState?.productTable || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    fillInDataGaps: false,
    fixCategories: false,
    generateNewAttributes: false,
    analyzeProductImages: false,
    additionalInstructions: ''
  });

  useEffect(() => {
    onStateChange({
      uploadedData,
      productTable
    });
  }, [uploadedData, productTable, onStateChange]);

  const handleEnhance = (file) => {
    setUploadedData([]);
    setProductTable([]);
    setEnhanceOptions({
      fillInDataGaps: false,
      fixCategories: false,
      generateNewAttributes: false,
      analyzeProductImages: false,
      additionalInstructions: ''
    });
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (!productTable || productTable.length === 0) {
      alert('No data available to export.');
      return;
    }

    const csv = Papa.unparse(productTable);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'enhanced_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (!productTable || productTable.length === 0) {
      setEnhanceOptions({
        fillInDataGaps: false,
        fixCategories: false,
        generateNewAttributes: false,
        analyzeProductImages: false,
        additionalInstructions: ''
      });
    }
  };

  const handleModalConfirm = () => {
    console.log('Enhancement Options Selected:', enhanceOptions);
    setIsModalOpen(false);
    setLoading(true);
    
    setTimeout(() => {
      if (!uploadedData || uploadedData.length === 0) {
        setUploadedData(initialCatalog);
      }
      
      let enhanced = JSON.parse(JSON.stringify(uploadedData.length ? uploadedData : initialCatalog));
      
      if (enhanceOptions.generateNewAttributes) {
        enhanced = enhanced.map(item => ({
          ...item,
          enhanced_description: enhancedCatalog.find(e => e.product_id === item.product_id)?.enhanced_description,
          care_instructions: enhancedCatalog.find(e => e.product_id === item.product_id)?.care_instructions,
          tags: enhancedCatalog.find(e => e.product_id === item.product_id)?.tags,
          color_synonyms: enhancedCatalog.find(e => e.product_id === item.product_id)?.color_synonyms
        }));
      } else {
        enhanced = enhanced.map(item => {
          const { 
            enhanced_description, 
            care_instructions, 
            tags, 
            color_synonyms, 
            ...rest 
          } = item;
          return rest;
        });
      }
      
      if (enhanceOptions.fillInDataGaps) {
        enhanced = enhanced.map(item => {
          const enhancedItem = enhancedCatalog.find(e => e.product_id === item.product_id);
          return {
            ...item,
            color: item.color || enhancedItem?.color,
            material: item.material || enhancedItem?.material
          };
        });
      }
      
      if (enhanceOptions.fixCategories) {
        enhanced = enhanced.map(item => {
          const enhancedItem = enhancedCatalog.find(e => e.product_id === item.product_id);
          return {
            ...item,
            category: enhancedItem?.category || item.category
          };
        });
      }
      
      setProductTable(enhanced);
      setLoading(false);
    }, 3000);
  };

  const handleChangeOptions = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="catalog-container">
      <div className="button-row">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '16px' }}
        />
        
        <div className="button-group">
          <UploadButton onUpload={handleEnhance} />
          {productTable && productTable.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangeOptions}
            >
              <SettingsIcon />
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            disabled={!productTable || productTable.length === 0}
          >
            <DownloadIcon />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <p>Enhancing your catalog, please wait...</p>
        </div>
      ) : (
        productTable && productTable.length > 0 && (
          <div className="table-wrapper">
            <EnhancedTable
              initialData={uploadedData}
              enhancedData={productTable}
              setEnhancedData={setProductTable}
            />
          </div>
        )
      )}

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

export default CatalogEnhancer;