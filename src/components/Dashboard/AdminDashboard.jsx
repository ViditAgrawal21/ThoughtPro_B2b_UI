import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Brain, Calendar, Plus, BarChart3 } from 'lucide-react';
import './AdminDashboard.css';
import AdminHeader from '../Header/AdminHeader';
import companyService from '../../services/companyService';
import psychologistService from '../../services/psychologistService';
import bookingService from '../../services/bookingService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalPsychologists: 0,
    totalBookings: 0,
    activeSubscriptions: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch companies
      const companiesRes = await companyService.getAllCompaniesAdmin();
      const companies = Array.isArray(companiesRes) ? companiesRes : companiesRes.data || [];
      
      // Calculate total employees by summing company employee counts
      const totalEmployees = companies.reduce((sum, company) => {
        return sum + (company.employeeCount || 0);
      }, 0);
      
      // Fetch psychologists
      const psychologistsRes = await psychologistService.getAllPsychologists(1, 1000);
      const psychologists = Array.isArray(psychologistsRes) ? psychologistsRes : psychologistsRes.data || [];
      
      // Fetch bookings to get total count
      const bookingsRes = await bookingService.getAllBookings(1, 1);
      const totalBookings = bookingsRes.total || 0;
      
      setStats({
        totalCompanies: companies.length,
        totalEmployees: totalEmployees,
        totalPsychologists: psychologists.length,
        totalBookings: totalBookings,
        activeSubscriptions: 0,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <div className="quick-action" onClick={onClick}>
      <div className="action-icon">
        <Icon size={20} />
      </div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage the entire ThoughtPro B2B platform</p>
        </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <StatCard
              icon={Building2}
              title="Total Companies"
              value={loading ? '...' : stats.totalCompanies}
              color="blue"
            />
            <StatCard
              icon={Users}
              title="Total Employees"
              value={loading ? '...' : stats.totalEmployees}
              color="pink"
            />
            <StatCard
              icon={Brain}
              title="Psychologists"
              value={loading ? '...' : stats.totalPsychologists}
              color="cyan"
            />
            <StatCard
              icon={Calendar}
              title="Total Bookings"
              value={loading ? '...' : stats.totalBookings}
              color="lime"
            />
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <QuickAction
                icon={Plus}
                title="Company Management"
                description="Register a new company to the platform"
                onClick={() => navigate('/admin/companies/add')}
              />
              <QuickAction
                icon={Brain}
                title="Psychologist Management"
                description="Add a new psychologist to the network"
                onClick={() => navigate('/admin/psychologists/add')}
              />
              <QuickAction
                icon={BarChart3}
                title="Usage Analytics"
                description="View detailed analytics and usage reports"
                onClick={() => navigate('/admin/analytics')}
              />
            </div>
          </div>

      </div>
    </div>
  );
};

export default AdminDashboard;