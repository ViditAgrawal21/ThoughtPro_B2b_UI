import React from 'react';
import { AlertCircle, Wifi, WifiOff, CheckCircle, XCircle } from 'lucide-react';
import './ApiStatusIndicator.css';

const ApiStatusIndicator = ({ status = 'unknown', message = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          className: 'status-connected',
          label: 'API Connected',
          message: 'Real-time data'
        };
      case 'mock':
        return {
          icon: WifiOff,
          className: 'status-mock',
          label: 'Demo Mode',
          message: 'Using sample data'
        };
      case 'error':
        return {
          icon: XCircle,
          className: 'status-error',
          label: 'API Error',
          message: message || 'Connection failed'
        };
      case 'connecting':
        return {
          icon: Wifi,
          className: 'status-connecting',
          label: 'Connecting...',
          message: 'Establishing connection'
        };
      default:
        return {
          icon: AlertCircle,
          className: 'status-unknown',
          label: 'Unknown Status',
          message: 'Unable to determine connection status'
        };
    }
  };

  const { icon: StatusIcon, className, label, message: statusMessage } = getStatusConfig();

  return (
    <div className={`api-status-indicator ${className}`}>
      <StatusIcon size={16} className="status-icon" />
      <div className="status-content">
        <span className="status-label">{label}</span>
        <span className="status-message">{message || statusMessage}</span>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;