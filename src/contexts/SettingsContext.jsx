import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState('Xyz Company');
  const [settings, setSettings] = useState({
    showProductivity: true,
    showPhoneUsageWeekdays: true,
    showPhoneUsageWork: true
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedCompanyName = localStorage.getItem('companyName');
    const savedSettings = localStorage.getItem('dashboardSettings');
    
    if (savedCompanyName) {
      setCompanyName(savedCompanyName);
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateCompanyName = (name) => {
    setCompanyName(name);
    localStorage.setItem('companyName', name);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
  };

  const value = {
    companyName,
    updateCompanyName,
    settings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};