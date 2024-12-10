// frontend/src/components/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CategoryIcon from '@mui/icons-material/Category';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function Sidebar({ activePage, setActivePage, activeSubPage, setActiveSubPage }) {
  const [expandedItems, setExpandedItems] = useState({
    'Catalog Enhancer': true
  });

  const toggleExpand = (item, event) => {
    event.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleCatalogEnhancerClick = (e) => {
    setActivePage('Catalog Enhancer');
    if (!activeSubPage) {
      setActiveSubPage('by-product');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Magnet</h2>
      </div>
      <ul className="sidebar-nav">
        <li
          className={activePage === 'Catalog Assessment' ? 'active' : ''}
          onClick={() => setActivePage('Catalog Assessment')}
        >
          <AssessmentIcon />
          <span>Catalog Assessment</span>
        </li>
        
        <li className={`menu-item ${activePage === 'Catalog Enhancer' ? 'active' : ''}`}>
          <div className="menu-item-header" onClick={handleCatalogEnhancerClick}>
            <div className="menu-item-label">
              <AutoFixHighIcon />
              <span>Catalog Enhancer</span>
            </div>
            <div onClick={(e) => toggleExpand('Catalog Enhancer', e)}>
              {expandedItems['Catalog Enhancer'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
          </div>
          {expandedItems['Catalog Enhancer'] && (
            <ul className="submenu">
              <li
                className={activeSubPage === 'by-product' ? 'active' : ''}
                onClick={() => {
                  setActivePage('Catalog Enhancer');
                  setActiveSubPage('by-product');
                }}
              >
                By Product
              </li>
              <li
                className={activeSubPage === 'by-category' ? 'active' : ''}
                onClick={() => {
                  setActivePage('Catalog Enhancer');
                  setActiveSubPage('by-category');
                }}
              >
                By Category
              </li>
              <li
                className={activeSubPage === 'by-brand' ? 'active' : ''}
                onClick={() => {
                  setActivePage('Catalog Enhancer');
                  setActiveSubPage('by-brand');
                }}
              >
                By Brand
              </li>
            </ul>
          )}
        </li>

        <li
          className={activePage === 'Category Hierarchy' ? 'active' : ''}
          onClick={() => setActivePage('Category Hierarchy')}
        >
          <CategoryIcon />
          <span>Category Hierarchy</span>
        </li>
        <li
          className={activePage === 'Product Pairings' ? 'active' : ''}
          onClick={() => setActivePage('Product Pairings')}
        >
          <CompareArrowsIcon />
          <span>Product Pairings</span>
        </li>
        <li
          className={activePage === 'Version History' ? 'active' : ''}
          onClick={() => setActivePage('Version History')}
        >
          <HistoryIcon />
          <span>Version History</span>
        </li>
        <li
          className={activePage === 'Settings' ? 'active' : ''}
          onClick={() => setActivePage('Settings')}
        >
          <SettingsIcon />
          <span>Settings</span>
        </li>
        <li
          className={activePage === 'Account' ? 'active' : ''}
          onClick={() => setActivePage('Account')}
        >
          <AccountCircleIcon />
          <span>Account</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;