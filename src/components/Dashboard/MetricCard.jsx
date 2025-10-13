import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { colors } from '../../styles/colors';

const MetricCard = ({ value, period, trend, trendValue }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-period">{period}</div>
      {trend && (
        <div 
          className="metric-trend"
          style={{ color: isPositive ? colors.success : colors.warning }}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;