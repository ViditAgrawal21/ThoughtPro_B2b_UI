import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Mail } from 'lucide-react';
import { companyService } from '../../services/companyService';
import './CredentialsDisplay.css';

const CredentialsDisplay = ({ credentials, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);

  const handleCopyCredentials = async () => {
    const credentialsText = `
Company Login Credentials
Email: ${credentials.email}
Temporary Password: ${credentials.temporaryPassword}

Important: This is a temporary password. The company will need to set a new password on first login.
    `.trim();

    try {
      await navigator.clipboard.writeText(credentialsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSendCredentials = async () => {
    setSending(true);
    try {
      await companyService.sendCompanyCredentials(
        credentials.companyId,
        credentials.email,
        credentials.temporaryPassword
      );
      alert('Credentials sent successfully to ' + credentials.email);
    } catch (error) {
      alert('Failed to send credentials: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="credentials-overlay">
      <div className="credentials-modal">
        <div className="credentials-header">
          <h2>Company Login Credentials Created</h2>
          <p>Please save these credentials and share them with the company.</p>
        </div>

        <div className="credentials-content">
          <div className="credential-item">
            <label>Login Email:</label>
            <div className="credential-value">
              <input type="text" value={credentials.email} readOnly />
            </div>
          </div>

          <div className="credential-item">
            <label>Temporary Password:</label>
            <div className="credential-value">
              <input 
                type={showPassword ? "text" : "password"} 
                value={credentials.temporaryPassword} 
                readOnly 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="credentials-warning">
            <strong>Important:</strong> This is a temporary password. The company will be required 
            to change it on their first login.
          </div>
        </div>

        <div className="credentials-actions">
          <button
            onClick={handleCopyCredentials}
            className="copy-button"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy Credentials'}
          </button>

          <button
            onClick={handleSendCredentials}
            className="send-button"
            disabled={sending}
          >
            <Mail size={16} />
            {sending ? 'Sending...' : 'Send via Email'}
          </button>

          <button
            onClick={onClose}
            className="close-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsDisplay;