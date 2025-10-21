import React, { useState, useEffect, useContext } from 'react';
import { Target, Smartphone } from 'lucide-react';
import Header from '../Header/Header';
import MetricCard from './MetricCard';
import CustomDashboard from './CustomDashboard';
import AdminDashboard from './AdminDashboard';
import CompanyDashboard from './CompanyDashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { useSettings } from '../../hooks/useSettings';
import { AuthContext } from '../../contexts/AuthContext';
import { validateDashboardIntegration } from '../../utils/testApi';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const { data, loading, error } = useDashboard();
  const { settings } = useSettings();
  const { isAdmin, isCompanyUser } = useContext(AuthContext);

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

  // Role-based dashboard rendering
  if (isAdmin()) {
    return <AdminDashboard />;
  }
  
  if (isCompanyUser()) {
    return <CompanyDashboard />;
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
            {/* Productivity Score - SUBTITLE REMOVED */}
            {settings.showProductivity && (
              <div className="section">
                <div className="section-header">
                  <Target size={24} className="section-icon" />
                  <div className="section-header-content">
                    <h3 className="section-title">Productivity Score Average</h3>
                    {/* REMOVED: <p className="section-subtitle">(Productive Apps/All Apps)×100</p> */}
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard {...data?.productivity.daily} period="Daily" />
                  <MetricCard {...data?.productivity.weekly} period="Weekly" />
                  <MetricCard {...data?.productivity.today} period="Today" />
                  <MetricCard {...data?.productivity.yesterday} period="Yesterday" />
                  <MetricCard {...data?.productivity.thisWeek} period="This Week" />
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
                  <MetricCard {...data?.phoneUsageWeekdays.daily} period="Daily" />
                  <MetricCard {...data?.phoneUsageWeekdays.weekly} period="Weekly" />
                  <MetricCard {...data?.phoneUsageWeekdays.today} period="Today" />
                  <MetricCard {...data?.phoneUsageWeekdays.yesterday} period="Yesterday" />
                  <MetricCard {...data?.phoneUsageWeekdays.thisWeek} period="This Week" />
                </div>
              </div>
            )}

            {/* Average Phone Usage on Work Timings - SUBTITLE REMOVED */}
            {settings.showPhoneUsageWork && (
              <div className="section">
                <div className="section-header">
                  <Smartphone size={24} className="section-icon" />
                  <div className="section-header-content">
                    <h3 className="section-title">Average Phone Usage on Work Timings</h3>
                    {/* REMOVED: <p className="section-subtitle">10-5</p> */}
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard {...data?.phoneUsageWork.daily} period="Daily" />
                  <MetricCard {...data?.phoneUsageWork.weekly} period="Weekly" />
                  <MetricCard {...data?.phoneUsageWork.today} period="Today" />
                  <MetricCard {...data?.phoneUsageWork.yesterday} period="Yesterday" />
                  <MetricCard {...data?.phoneUsageWork.thisWeek} period="This Week" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;