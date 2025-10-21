import React, { useState } from 'react';
import { Settings, Database, Globe, AlertTriangle } from 'lucide-react';
import './DeveloperControls.css';

const DeveloperControls = ({ apiStatus, onToggleMockMode, onForceApiTest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [forceMode, setForceMode] = useState(localStorage.getItem('dev_force_mode') || 'auto');

  const handleModeChange = (mode) => {
    setForceMode(mode);
    localStorage.setItem('dev_force_mode', mode);
    
    if (mode === 'mock') {
      onToggleMockMode(true);
    } else if (mode === 'api') {
      onToggleMockMode(false);
      onForceApiTest();
    }
  };

  // Only show in development mode
  if (process.env.REACT_APP_ENV !== 'development') {
    return null;
  }

  return (
    <div className="developer-controls">
      <button 
        className="dev-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Developer Controls"
      >
        <Settings size={16} />
        <span>Dev</span>
      </button>
      
      {isOpen && (
        <div className="dev-panel">
          <div className="dev-panel-header">
            <h4>Developer Controls</h4>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="dev-section">
            <h5>API Status</h5>
            <div className={`dev-status ${apiStatus}`}>
              {apiStatus === 'connected' && <Globe size={16} />}
              {apiStatus === 'mock' && <Database size={16} />}
              {apiStatus === 'connecting' && <AlertTriangle size={16} />}
              <span>{apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1)}</span>
            </div>
          </div>
          
          <div className="dev-section">
            <h5>Force Mode</h5>
            <div className="dev-mode-buttons">
              <button 
                className={`mode-btn ${forceMode === 'auto' ? 'active' : ''}`}
                onClick={() => handleModeChange('auto')}
              >
                Auto
              </button>
              <button 
                className={`mode-btn ${forceMode === 'api' ? 'active' : ''}`}
                onClick={() => handleModeChange('api')}
              >
                Force API
              </button>
              <button 
                className={`mode-btn ${forceMode === 'mock' ? 'active' : ''}`}
                onClick={() => handleModeChange('mock')}
              >
                Force Mock
              </button>
            </div>
          </div>
          
          <div className="dev-section">
            <h5>Actions</h5>
            <button 
              className="action-btn"
              onClick={onForceApiTest}
            >
              Test API Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperControls;