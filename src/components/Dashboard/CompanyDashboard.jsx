import React, { useState, useEffect } from 'react';
import { Target, Smartphone } from 'lucide-react';
import Header from '../Header/Header';
import MetricCard from './MetricCard';
import CustomDashboard from './CustomDashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { useSettings } from '../../hooks/useSettings';
import { validateDashboardIntegration } from '../../utils/testApi';
import './Dashboard.css';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const { data, loading, error } = useDashboard();
  const { settings } = useSettings();

  useEffect(() => {
    // Validate integration on component mount (no API calls)
    validateDashboardIntegration();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="error-container">
          <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h2 className="dashboard-title">Executive Dashboard</h2>
            <div className="dashboard-tabs">
              <button 
                onClick={() => setActiveTab('standard')}
                className={activeTab === 'standard' ? 'tab active' : 'tab'}
              >
                Standard Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('custom')}
                className={activeTab === 'custom' ? 'tab active' : 'tab'}
              >
                Custom Dashboard
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'custom' ? (
          <CustomDashboard />
        ) : (
          <>
            {/* Productivity Score */}
            {settings.showProductivity && (
              <div className="section">
                <div className="section-header">
                  <Target size={24} className="section-icon" />
                  <div className="section-header-content">
                    <h3 className="section-title">Productivity Score Average</h3>
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard {...data?.productivity.daily} />
                  <MetricCard {...data?.productivity.weekly} />
                  <MetricCard {...data?.productivity.today} />
                  <MetricCard {...data?.productivity.yesterday} />
                  <MetricCard {...data?.productivity.thisWeek} />
                </div>
              </div>
            )}

            {/* Average Phone Usage on Weekdays */}
            {settings.showPhoneUsageWeekdays && (
              <div className="section">
                <div className="section-header">
                  <Smartphone size={24} className="section-icon" />
                  <div className="section-header-content">
                    <h3 className="section-title">Average Phone Usage on Weekdays</h3>
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard {...data?.phoneUsageWeekdays.daily} />
                  <MetricCard {...data?.phoneUsageWeekdays.weekly} />
                  <MetricCard {...data?.phoneUsageWeekdays.today} />
                  <MetricCard {...data?.phoneUsageWeekdays.yesterday} />
                  <MetricCard {...data?.phoneUsageWeekdays.thisWeek} />
                </div>
              </div>
            )}

            {/* Average Phone Usage on Work Timings */}
            {settings.showPhoneUsageWork && (
              <div className="section">
                <div className="section-header">
                  <Smartphone size={24} className="section-icon" />
                  <div className="section-header-content">
                    <h3 className="section-title">Average Phone Usage on Work Timings</h3>
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard {...data?.phoneUsageWork.daily} />
                  <MetricCard {...data?.phoneUsageWork.weekly} />
                  <MetricCard {...data?.phoneUsageWork.today} />
                  <MetricCard {...data?.phoneUsageWork.yesterday} />
                  <MetricCard {...data?.phoneUsageWork.thisWeek} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;