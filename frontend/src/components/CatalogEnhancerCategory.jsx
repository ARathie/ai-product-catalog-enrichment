import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText,
  Paper 
} from '@mui/material';
import EnhancedTable from './EnhancedTable';
import initialCatalog from '../data/initialCatalog.json';

function CatalogEnhancerCategory({ savedState, onStateChange }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const data = savedState?.productTable || initialCatalog;
    // Get unique categories
    const uniqueCategories = [...new Set(data.map(product => product.category || 'Uncategorized'))];
    setCategories(uniqueCategories.sort());
  }, [savedState]);

  useEffect(() => {
    if (selectedCategory) {
      const data = savedState?.productTable || initialCatalog;
      const filtered = data.filter(product => 
        (product.category || 'Uncategorized') === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, savedState]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <List>
          {categories.map((category) => (
            <ListItem 
              button 
              key={category}
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? '#f0f0f0' : 'transparent'
              }}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {selectedCategory ? (
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
            Select a category to view products
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogEnhancerCategory; 