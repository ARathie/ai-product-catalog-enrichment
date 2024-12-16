import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText,
  Paper 
} from '@mui/material';
import EnhancedTable from './EnhancedTable';
import initialCatalog from '../data/initialCatalog.json';

function CatalogEnhancerBrand({ savedState, onStateChange }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const data = savedState?.productTable || initialCatalog;
    // Get unique brands
    const uniqueBrands = [...new Set(data.map(product => product.brand || 'Unbranded'))];
    setBrands(uniqueBrands.sort());
  }, [savedState]);

  useEffect(() => {
    if (selectedBrand) {
      const data = savedState?.productTable || initialCatalog;
      const filtered = data.filter(product => 
        (product.brand || 'Unbranded') === selectedBrand
      );
      setFilteredProducts(filtered);
    }
  }, [selectedBrand, savedState]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <List>
          {brands.map((brand) => (
            <ListItem 
              button 
              key={brand}
              selected={selectedBrand === brand}
              onClick={() => setSelectedBrand(brand)}
              style={{
                backgroundColor: selectedBrand === brand ? '#f0f0f0' : 'transparent'
              }}
            >
              <ListItemText primary={brand} />
            </ListItem>
          ))}
        </List>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {selectedBrand ? (
          <EnhancedTable
            initialData={filteredProducts}
            enhancedData={filteredProducts}
            setEnhancedData={() => {}}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            Select a brand to view products
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogEnhancerBrand; 