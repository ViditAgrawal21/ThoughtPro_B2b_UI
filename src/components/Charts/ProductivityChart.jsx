import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '../../styles/colors';
import './ProductivityChart.css';

const ProductivityChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Productivity Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis dataKey="name" stroke={colors.textSecondary} />
          <YAxis stroke={colors.textSecondary} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`,
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="productivity" 
            stroke={colors.primary} 
            strokeWidth={2}
            dot={{ fill: colors.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;