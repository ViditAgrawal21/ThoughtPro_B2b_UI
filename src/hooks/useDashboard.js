import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from the API (with automatic fallback to mock data)
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData.data || dashboardData);
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