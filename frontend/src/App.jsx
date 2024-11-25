import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import CatalogAssessment from './components/CatalogAssessment';
import CatalogEnhancer from './components/CatalogEnhancer';
import ProductPairings from './components/ProductPairings';

function App() {
  const [activePage, setActivePage] = useState('Catalog Assessment');
  const [assessmentState, setAssessmentState] = useState(null);
  const [enrichmentState, setEnrichmentState] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'Catalog Assessment':
        return <CatalogAssessment 
          savedState={assessmentState}
          onStateChange={setAssessmentState}
        />;
      case 'Catalog Enhancer':
        return <CatalogEnhancer 
          savedState={enrichmentState}
          onStateChange={setEnrichmentState}
        />;
      case 'Product Pairings':
        return <ProductPairings />;
      default:
        return <CatalogAssessment 
          savedState={assessmentState}
          onStateChange={setAssessmentState}
        />;
    }
  };

  return (
    <div className="App">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;