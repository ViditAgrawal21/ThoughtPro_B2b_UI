import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Package
} from 'lucide-react';
import { employeeSubscriptionService } from '../../services/employeeSubscriptionService';
import Header from '../Header/Header';
import './EmployeeSubscription.css';

const EmployeeSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyType, setVerifyType] = useState('purchase'); // 'purchase' or 'subscription'
  const [verificationForm, setVerificationForm] = useState({
    email: '',
    purchaseToken: '',
    productId: '',
    subscriptionId: '',
    obfuscatedAccountId: '',
    obfuscatedProfileId: '',
    developerPayload: ''
  });

  const fetchActiveSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeSubscriptionService.getActiveSubscriptions();
      
      if (response.success && response.data) {
        setSubscriptions(response.data);
      } else {
        // Fallback to demo data
        setSubscriptions(getDemoSubscriptions());
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscription information');
      setSubscriptions(getDemoSubscriptions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSubscriptions();
    checkServiceStatus();
  }, [fetchActiveSubscriptions]);

  const checkServiceStatus = async () => {
    try {
      const response = await employeeSubscriptionService.checkSubscriptionStatus();
      if (!response.success) {
        console.warn('Subscription service status check failed');
      }
    } catch (error) {
      console.warn('Subscription service status check error:', error);
    }
  };

  const getDemoSubscriptions = () => [
    {
      id: 'sub_1',
      email: 'user@company.com',
      product_id: 'premium_monthly',
      plan_type: 'Premium',
      validity_days: 30,
      expiry_date: '2025-11-20',
      is_subscription: true,
      payment_gateway: 'Google Play',
      verified_at: '2025-10-20T10:00:00Z',
      is_active: true
    },
    {
      id: 'sub_2', 
      email: 'user@company.com',
      product_id: 'ultra_yearly',
      plan_type: 'Ultra',
      validity_days: 365,
      expiry_date: '2026-10-20',
      is_subscription: false,
      payment_gateway: 'Google Play',
      verified_at: '2025-01-15T14:30:00Z',
      is_active: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (verifyType === 'purchase') {
        response = await employeeSubscriptionService.verifyPurchase({
          email: verificationForm.email,
          purchaseToken: verificationForm.purchaseToken,
          productId: verificationForm.productId,
          obfuscatedAccountId: verificationForm.obfuscatedAccountId || undefined,
          obfuscatedProfileId: verificationForm.obfuscatedProfileId || undefined,
          developerPayload: verificationForm.developerPayload || undefined
        });
      } else {
        response = await employeeSubscriptionService.verifySubscription({
          email: verificationForm.email,
          purchaseToken: verificationForm.purchaseToken,
          subscriptionId: verificationForm.subscriptionId,
          obfuscatedAccountId: verificationForm.obfuscatedAccountId || undefined,
          obfuscatedProfileId: verificationForm.obfuscatedProfileId || undefined
        });
      }

      if (response.success) {
        setSuccess(`${verifyType === 'purchase' ? 'Purchase' : 'Subscription'} verified successfully!`);
        setShowVerifyModal(false);
        resetForm();
        await fetchActiveSubscriptions(); // Refresh the list
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify. Please check your information and try again.');
    } finally {
      setVerifying(false);
    }
  };

  const resetForm = () => {
    setVerificationForm({
      email: '',
      purchaseToken: '',
      productId: '',
      subscriptionId: '',
      obfuscatedAccountId: '',
      obfuscatedProfileId: '',
      developerPayload: ''
    });
  };

  const openVerifyModal = (type) => {
    setVerifyType(type);
    setShowVerifyModal(true);
    resetForm();
    setError('');
    setSuccess('');
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    resetForm();
    setError('');
  };

  const getStatusIcon = (isActive, expiryDate) => {
    if (!isActive) {
      return <XCircle className="status-icon inactive" />;
    }
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 7) {
      return <AlertTriangle className="status-icon warning" />;
    }
    
    return <CheckCircle className="status-icon active" />;
  };

  const getStatusText = (isActive, expiryDate) => {
    if (!isActive) return 'Inactive';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry < 7) return `Expires in ${daysUntilExpiry} days`;
    
    return 'Active';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="subscription-page">
        <Header />
        <div className="subscription-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <Header />
      <div className="subscription-container">
        <div className="subscription-header">
          <div className="subscription-title">
            <Package size={28} />
            <h1>My Subscriptions</h1>
          </div>
          <div className="header-actions">
            <button
              className="verify-button purchase"
              onClick={() => openVerifyModal('purchase')}
            >
              <CreditCard size={20} />
              Verify Purchase
            </button>
            <button
              className="verify-button subscription"
              onClick={() => openVerifyModal('subscription')}
            >
              <RefreshCw size={20} />
              Verify Subscription
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <div className="subscriptions-grid">
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <div key={subscription.id} className="subscription-card">
                <div className="subscription-header-info">
                  <div className="plan-info">
                    <h3>{subscription.plan_type} Plan</h3>
                    <p className="product-id">{subscription.product_id}</p>
                  </div>
                  <div className="status-info">
                    {getStatusIcon(subscription.is_active, subscription.expiry_date)}
                    <span className="status-text">
                      {getStatusText(subscription.is_active, subscription.expiry_date)}
                    </span>
                  </div>
                </div>

                <div className="subscription-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Expires: {formatDate(subscription.expiry_date)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>Valid for: {subscription.validity_days} days</span>
                  </div>
                  
                  <div className="detail-item">
                    <Smartphone size={16} />
                    <span>{subscription.payment_gateway}</span>
                  </div>
                  
                  {subscription.verified_at && (
                    <div className="detail-item">
                      <CheckCircle size={16} />
                      <span>Verified: {formatDate(subscription.verified_at)}</span>
                    </div>
                  )}
                </div>

                <div className="subscription-type">
                  <span className={`type-badge ${subscription.is_subscription ? 'subscription' : 'purchase'}`}>
                    {subscription.is_subscription ? 'Subscription' : 'One-time Purchase'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Package size={64} />
              <h3>No Active Subscriptions</h3>
              <p>You don't have any active subscriptions yet.</p>
              <div className="empty-actions">
                <button
                  className="verify-button purchase"
                  onClick={() => openVerifyModal('purchase')}
                >
                  <CreditCard size={20} />
                  Verify Purchase
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Verification Modal */}
        {showVerifyModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {verifyType === 'purchase' ? 'Verify Google Play Purchase' : 'Verify Google Play Subscription'}
                </h3>
                <button className="modal-close" onClick={closeVerifyModal}>
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="verification-form">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={verificationForm.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label>Purchase Token *</label>
                  <input
                    type="text"
                    name="purchaseToken"
                    value={verificationForm.purchaseToken}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter Google Play purchase token"
                  />
                </div>

                {verifyType === 'purchase' ? (
                  <div className="form-group">
                    <label>Product ID *</label>
                    <input
                      type="text"
                      name="productId"
                      value={verificationForm.productId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product ID"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Subscription ID *</label>
                    <input
                      type="text"
                      name="subscriptionId"
                      value={verificationForm.subscriptionId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter subscription ID"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Obfuscated Account ID (Optional)</label>
                  <input
                    type="text"
                    name="obfuscatedAccountId"
                    value={verificationForm.obfuscatedAccountId}
                    onChange={handleInputChange}
                    placeholder="Enter obfuscated account ID"
                  />
                </div>

                <div className="form-group">
                  <label>Obfuscated Profile ID (Optional)</label>
                  <input
                    type="text"
                    name="obfuscatedProfileId"
                    value={verificationForm.obfuscatedProfileId}
                    onChange={handleInputChange}
                    placeholder="Enter obfuscated profile ID"
                  />
                </div>

                {verifyType === 'purchase' && (
                  <div className="form-group">
                    <label>Developer Payload (Optional)</label>
                    <input
                      type="text"
                      name="developerPayload"
                      value={verificationForm.developerPayload}
                      onChange={handleInputChange}
                      placeholder="Enter developer payload"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeVerifyModal}
                    disabled={verifying}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="verify-submit-button"
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <div className="button-spinner"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Verify {verifyType === 'purchase' ? 'Purchase' : 'Subscription'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSubscription;