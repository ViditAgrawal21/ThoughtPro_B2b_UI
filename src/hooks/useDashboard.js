import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulated data - REMOVED: score and subtitle fields
      const mockData = {
        productivity: {
          daily: { value: '4 Hours', trend: 'up', trendValue: '10 Minutes' },
          weekly: { value: '20 Hours', trend: 'up', trendValue: '2 Hours' },
          today: { value: '20 Hours', trend: 'up', trendValue: '15 Minutes' },
          yesterday: { value: '20 Hours', trend: 'up', trendValue: '1 Hour' },
          thisWeek: { value: '20 Hours', trend: 'up', trendValue: '3 Hours' }
        },
        phoneUsageWeekdays: {
          daily: { value: '4 Hours', trend: 'down', trendValue: '30 Minutes' },
          weekly: { value: '20 Hours', trend: 'down', trendValue: '1 Hour' },
          today: { value: '20 Hours', trend: 'up', trendValue: '45 Minutes' },
          yesterday: { value: '20 Hours', trend: 'down', trendValue: '20 Minutes' },
          thisWeek: { value: '20 Hours', trend: 'up', trendValue: '2 Hours' }
        },
        phoneUsageWork: {
          daily: { value: '4 Hours', trend: 'down', trendValue: '15 Minutes' },
          weekly: { value: '20 Hours', trend: 'up', trendValue: '1.5 Hours' },
          today: { value: '20 Hours', trend: 'up', trendValue: '30 Minutes' },
          yesterday: { value: '20 Hours', trend: 'down', trendValue: '10 Minutes' },
          thisWeek: { value: '20 Hours', trend: 'up', trendValue: '2.5 Hours' }
        }
      };
      
      setData(mockData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, loading, error, refetch: fetchDashboardData };
};

export default useDashboard;