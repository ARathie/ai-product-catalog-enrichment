import React, { useState } from 'react';
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

function CatalogEnhancer() {
  const [initialData, setInitialData] = useState([]);
  const [enhancedData, setEnhancedData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState({
    fillInDataGaps: false,
    fixCategories: false,
    generateNewAttributes: false,
    analyzeProductImages: false,
    additionalInstructions: ''
  });

  const handleEnhance = (file) => {
    // Reset existing data only for new file uploads
    setInitialData([]);
    setEnhancedData([]);
    // Reset options for new uploads
    setEnhanceOptions({
      fillInDataGaps: false,
      fixCategories: false,
      generateNewAttributes: false,
      analyzeProductImages: false,
      additionalInstructions: ''
    });
    // Open the Enhance Options Modal
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (enhancedData.length === 0) {
      alert('No data available to export.');
      return;
    }

    // Convert enhancedData to CSV
    const csv = Papa.unparse(enhancedData);

    // Create a Blob from the CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a link to download the Blob
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;

    // Name the downloaded file
    link.setAttribute('download', 'enhanced_catalog.csv');

    // Append link to the body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Only reset options if there's no existing enhanced data
    if (enhancedData.length === 0) {
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
      // Only set initial data if it's empty (new upload)
      if (initialData.length === 0) {
        setInitialData(initialCatalog);
      }
      
      // Create enhanced data based on selected options
      let enhanced = JSON.parse(JSON.stringify(initialData.length ? initialData : initialCatalog));
      
      if (enhanceOptions.generateNewAttributes) {
        enhanced = enhanced.map(item => ({
          ...item,
          enhanced_description: enhancedCatalog.find(e => e.product_id === item.product_id).enhanced_description,
          care_instructions: enhancedCatalog.find(e => e.product_id === item.product_id).care_instructions,
          tags: enhancedCatalog.find(e => e.product_id === item.product_id).tags,
          color_synonyms: enhancedCatalog.find(e => e.product_id === item.product_id).color_synonyms
        }));
      } else {
        // Remove new attributes if the option is turned off
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
            color: item.color || enhancedItem.color,
            material: item.material || enhancedItem.material
          };
        });
      }
      
      if (enhanceOptions.fixCategories) {
        enhanced = enhanced.map(item => {
          const enhancedItem = enhancedCatalog.find(e => e.product_id === item.product_id);
          return {
            ...item,
            category: enhancedItem.category
          };
        });
      } else {
        // Revert categories to original if the option is turned off
        enhanced = enhanced.map((item, index) => ({
          ...item,
          category: initialData.length ? initialData[index].category : initialCatalog[index].category
        }));
      }
      
      setEnhancedData(enhanced);
      setLoading(false);
    }, 3000);
  };

  const handleChangeOptions = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="catalog-container">
      <div className="button-row">
        <div className="button-group">
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            disabled={enhancedData.length === 0}
          >
            Export Catalog
          </Button>
          <UploadButton onUpload={handleEnhance} />
          {enhancedData.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleChangeOptions}
            >
              Change Options
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <p>Enhancing your catalog, please wait...</p>
        </div>
      ) : (
        enhancedData.length > 0 && (
          <div className="table-wrapper">
            <EnhancedTable
              initialData={initialData}
              enhancedData={enhancedData}
              setEnhancedData={setEnhancedData}
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