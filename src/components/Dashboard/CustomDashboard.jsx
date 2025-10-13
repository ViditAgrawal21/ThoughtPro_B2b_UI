import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import './CustomDashboard.css';

const CustomDashboard = () => {
  const { companyName, updateCompanyName, settings, updateSettings } = useSettings();
  const [tempCompanyName, setTempCompanyName] = useState(companyName);
  const [tempSettings, setTempSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateCompanyName(tempCompanyName);
    updateSettings(tempSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="custom-dashboard">
      <div className="settings-header">
        <Settings size={28} className="settings-icon" />
        <h2 className="settings-title">Dashboard Settings</h2>
      </div>

      {/* Company Information */}
      <div className="settings-section">
        <h3 className="settings-section-title">Company Information</h3>
        <div className="setting-card">
          <label className="setting-label">Company Name</label>
          <input
            type="text"
            value={tempCompanyName}
            onChange={(e) => setTempCompanyName(e.target.value)}
            className="setting-input"
            placeholder="Enter company name"
          />
          <p className="setting-description">This name will appear in the header</p>
        </div>
      </div>

      {/* Visible Metrics */}
      <div className="settings-section">
        <h3 className="settings-section-title">Visible Metrics</h3>
        <div className="setting-card">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={tempSettings.showProductivity}
              onChange={(e) => setTempSettings({...tempSettings, showProductivity: e.target.checked})}
              className="checkbox"
            />
            <span>Show Productivity Score</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={tempSettings.showPhoneUsageWeekdays}
              onChange={(e) => setTempSettings({...tempSettings, showPhoneUsageWeekdays: e.target.checked})}
              className="checkbox"
            />
            <span>Show Phone Usage (Weekdays)</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={tempSettings.showPhoneUsageWork}
              onChange={(e) => setTempSettings({...tempSettings, showPhoneUsageWork: e.target.checked})}
              className="checkbox"
            />
            <span>Show Phone Usage (Work Hours)</span>
          </label>
        </div>
      </div>

      <button onClick={handleSave} className="save-button">
        <Save size={20} />
        <span>{saved ? 'Saved!' : 'Save Changes'}</span>
      </button>
    </div>
  );
};

export default CustomDashboard;