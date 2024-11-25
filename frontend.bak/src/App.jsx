import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CatalogEnhancer from './components/CatalogEnhancer';
import ProductPairings from './components/ProductPairings';
import './styles/theme.css';

function App() {
  const [activePage, setActivePage] = useState('Catalog Enhancer');

  const renderContent = () => {
    switch (activePage) {
      case 'Catalog Enhancer':
        return <CatalogEnhancer />;
      case 'Product Pairings':
        return <ProductPairings />;
      default:
        return <CatalogEnhancer />;
    }
  };

  return (
    <div className="App">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;