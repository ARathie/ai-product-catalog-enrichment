// frontend/src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CategoryIcon from '@mui/icons-material/Category';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';

function Sidebar({ activePage, setActivePage }) {
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
          <AssessmentIcon /> Catalog Assessment
        </li>
        <li
          className={activePage === 'Catalog Enhancer' ? 'active' : ''}
          onClick={() => setActivePage('Catalog Enhancer')}
        >
          <AutoFixHighIcon /> Catalog Enhancer
        </li>
        <li
          className={activePage === 'Category Hierarchy' ? 'active' : ''}
          onClick={() => setActivePage('Category Hierarchy')}
        >
          <CategoryIcon /> Category Hierarchy
        </li>
        <li
          className={activePage === 'Product Pairings' ? 'active' : ''}
          onClick={() => setActivePage('Product Pairings')}
        >
          <CompareArrowsIcon /> Product Pairings
        </li>
        <li
          className={activePage === 'Version History' ? 'active' : ''}
          onClick={() => setActivePage('Version History')}
        >
          <HistoryIcon /> Version History
        </li>
        <li
          className={activePage === 'Settings' ? 'active' : ''}
          onClick={() => setActivePage('Settings')}
        >
          <SettingsIcon /> Settings
        </li>
        <li
          className={activePage === 'Account' ? 'active' : ''}
          onClick={() => setActivePage('Account')}
        >
          <AccountCircleIcon /> Account
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;