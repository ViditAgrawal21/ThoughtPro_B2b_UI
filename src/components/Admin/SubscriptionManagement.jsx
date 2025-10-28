import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Save, 
  ArrowLeft, 
  Users, 
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import AdminHeader from '../Header/AdminHeader';
import './SubscriptionManagement.css';

const SubscriptionManagement = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [subscriptionConfig, setSubscriptionConfig] = useState({
    default_plan_type: 'basic',
    default_validity_days: 3650,
    subscription_expiry_days: 3650,
    account_expiry_days: 3650,
    employee_limit: 50000,
    auto_assign_subscription: true,
    enforce_employee_limit: true,
    allowed_plan_types: ['basic']
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const subscriptionPlans = [
    {
      value: 'basic',
      label: 'Basic Plan',
      employeeLimit: 50,
      features: [
        'Up to 50 employees',
        'Basic analytics and reports',
        'Email support',
        'Standard booking management',
        'Basic wellness tracking'
      ]
    },
    {
      value: 'premium', 
      label: 'Premium Plan',
      employeeLimit: 200,
      features: [
        'Up to 200 employees',
        'Advanced analytics and custom reports',
        'Priority email support',
        'Enhanced booking management',
        'Employee wellness tracking',
        'Custom dashboard'
      ]
    },
    {
      value: 'ultra',
      label: 'Ultra Plan',
      employeeLimit: 500,
      features: [
        'Up to 500 employees',
        'Enterprise analytics and reporting',
        '24/7 phone and email support',
        'Advanced booking management',
        'Complete wellness suite',
        'Custom integrations',
        'Dedicated account manager'
      ]
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load company details
        const companyResponse = await companyService.getCompanyById(companyId);
        setCompany(companyResponse);
        
        // Load subscription config using the new API endpoint
        try {
          const subscriptionResponse = await companyService.getSubscriptionConfig(companyId);
          if (subscriptionResponse) {
            // If config exists, use it
            setSubscriptionConfig(subscriptionResponse);
          }
          // If null returned (404), keep the default config
        } catch (subscriptionError) {
          console.warn('Failed to load subscription config:', subscriptionError);
          // Use defaults if subscription config doesn't exist
        }
        
      } catch (error) {
        console.error('Error loading company:', error);
        setErrors({ load: 'Failed to load company information' });
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      loadData();
    }
  }, [companyId]);



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubscriptionConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name.includes('_limit') || name.includes('_days') ? parseInt(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePlanTypeChange = (planValue) => {
    const selectedPlan = subscriptionPlans.find(plan => plan.value === planValue);
    if (selectedPlan) {
      setSubscriptionConfig(prev => ({
        ...prev,
        default_plan_type: planValue,
        employee_limit: selectedPlan.employeeLimit,
        allowed_plan_types: [planValue]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!subscriptionConfig.default_plan_type) {
      newErrors.default_plan_type = 'Plan type is required';
    }
    
    if (!subscriptionConfig.employee_limit || subscriptionConfig.employee_limit < 1) {
      newErrors.employee_limit = 'Employee limit must be at least 1';
    }
    
    if (!subscriptionConfig.default_validity_days || subscriptionConfig.default_validity_days < 1) {
      newErrors.default_validity_days = 'Validity days must be at least 1';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      // Use the new updateSubscriptionConfig API
      const response = await companyService.updateSubscriptionConfig(companyId, subscriptionConfig);
      
      if (response) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/companies');
        }, 2000);
      } else {
        setErrors({ submit: 'Failed to update subscription configuration. Please try again.' });
      }
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      setErrors({ submit: error.message || 'Failed to update subscription configuration. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/companies');
  };

  if (loading) {
    return (
      <div className="subscription-management-page">
        <AdminHeader />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="subscription-management-page">
        <AdminHeader />
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>Error Loading Company</h2>
          <p>{errors.load}</p>
          <button onClick={handleBack} className="btn-secondary">
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-management-page">
      <AdminHeader />
      
      <div className="subscription-content">
        <div className="page-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Companies</span>
          </button>
          
          <div className="page-title-section">
            <Building2 size={32} className="page-icon" />
            <div>
              <h1 className="page-title">Manage Subscription</h1>
              <p className="page-subtitle">
                {company?.name} - Configure subscription and employee limits
              </p>
            </div>
          </div>
        </div>

        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>Subscription configuration updated successfully! Redirecting...</span>
          </div>
        )}

        <div className="subscription-form-container">
          <form onSubmit={handleSubmit} className="subscription-form">
            
            {/* Subscription Plan Selection */}
            <div className="form-section">
              <h3 className="section-title">
                <Users size={20} />
                Subscription Plan
              </h3>
              
              <div className="plan-selection">
                {subscriptionPlans.map(plan => (
                  <div 
                    key={plan.value} 
                    className={`plan-card ${subscriptionConfig.default_plan_type === plan.value ? 'selected' : ''}`}
                    onClick={() => handlePlanTypeChange(plan.value)}
                  >
                    <div className="plan-header">
                      <h4>{plan.label}</h4>
                      <div className="employee-limit">Up to {plan.employeeLimit} employees</div>
                    </div>
                    <div className="plan-features">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="feature">
                          <CheckCircle size={14} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.default_plan_type && <span className="error-message">{errors.default_plan_type}</span>}
            </div>

            {/* Configuration Settings */}
            <div className="form-section">
              <h3 className="section-title">
                <Settings size={20} />
                Configuration Settings
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="employee_limit">Employee Limit *</label>
                  <input
                    type="number"
                    id="employee_limit"
                    name="employee_limit"
                    value={subscriptionConfig.employee_limit}
                    onChange={handleInputChange}
                    className={errors.employee_limit ? 'error' : ''}
                    min="1"
                    max="10000"
                  />
                  {errors.employee_limit && <span className="error-message">{errors.employee_limit}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="default_validity_days">Default Validity (Days) *</label>
                  <input
                    type="number"
                    id="default_validity_days"
                    name="default_validity_days"
                    value={subscriptionConfig.default_validity_days}
                    onChange={handleInputChange}
                    className={errors.default_validity_days ? 'error' : ''}
                    min="1"
                  />
                  {errors.default_validity_days && <span className="error-message">{errors.default_validity_days}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="account_expiry_days">Account Expiry (Days)</label>
                  <input
                    type="number"
                    id="account_expiry_days"
                    name="account_expiry_days"
                    value={subscriptionConfig.account_expiry_days}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subscription_expiry_days">Subscription Expiry (Days)</label>
                  <input
                    type="number"
                    id="subscription_expiry_days"
                    name="subscription_expiry_days"
                    value={subscriptionConfig.subscription_expiry_days}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="toggle-settings">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="enforce_employee_limit"
                      checked={subscriptionConfig.enforce_employee_limit}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Enforce Employee Limit
                  </label>
                  <small>Prevent adding employees beyond the limit</small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="auto_assign_subscription"
                      checked={subscriptionConfig.auto_assign_subscription}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Auto-assign Subscription
                  </label>
                  <small>Automatically assign subscription to new employees</small>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors.submit && (
              <div className="error-message-box">
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" onClick={handleBack} className="btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={saving}
              >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;