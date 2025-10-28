import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import './PhoneInput.css';

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
];

const PhoneInput = ({ 
  value = '', 
  onChange, 
  onBlur,
  placeholder = 'Enter phone number',
  className = '',
  error = '',
  required = false,
  disabled = false,
  name = 'phone',
  id = 'phone'
}) => {
  // Parse existing phone number to extract country code and number
  const parsePhoneNumber = (phoneStr) => {
    if (!phoneStr) return { countryCode: '+1', phoneNumber: '' };
    
    // Ensure phoneStr is a string
    const phoneString = String(phoneStr);
    
    // Check if phone starts with a + (international format)
    if (phoneString.startsWith('+')) {
      // Find matching country code
      const matchingCode = COUNTRY_CODES.find(cc => phoneString.startsWith(cc.code));
      if (matchingCode) {
        return {
          countryCode: matchingCode.code,
          phoneNumber: phoneString.substring(matchingCode.code.length).replace(/\D/g, '')
        };
      }
    }
    
    // Default to +1 if no country code found
    return {
      countryCode: '+1',
      phoneNumber: phoneString.replace(/\D/g, '')
    };
  };

  const { countryCode: initialCountryCode, phoneNumber: initialPhoneNumber } = parsePhoneNumber(value);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  // Update internal state when value prop changes
  React.useEffect(() => {
    const { countryCode: newCountryCode, phoneNumber: newPhoneNumber } = parsePhoneNumber(value);
    setCountryCode(newCountryCode);
    setPhoneNumber(newPhoneNumber);
  }, [value]);

  const callOnChange = (newValue) => {
    if (onChange) {
      // Support both direct value callbacks and event-style callbacks
      if (onChange.length === 1) {
        // Direct value callback (e.g., React Hook Form, state setters)
        onChange(newValue);
      } else {
        // Event-style callback
        onChange({
          target: {
            name,
            value: newValue
          }
        });
      }
    }
  };

  const handleCountryCodeChange = (newCountryCode) => {
    setCountryCode(newCountryCode);
    const fullNumber = phoneNumber ? `${newCountryCode}${phoneNumber}` : '';
    callOnChange(fullNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Only allow numeric input, limit to 10 digits
    const numericValue = input.replace(/\D/g, '').slice(0, 10);
    
    setPhoneNumber(numericValue);
    const fullNumber = numericValue ? `${countryCode}${numericValue}` : '';
    callOnChange(fullNumber);
  };

  const handlePhoneNumberKeyPress = (e) => {
    // Prevent non-numeric characters
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    
    // Format based on length
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const selectedCountry = COUNTRY_CODES.find(cc => cc.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div className={`phone-input-container ${className} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className="phone-input-wrapper">
        {/* Country Code Dropdown */}
        <div className="country-code-selector">
          <div className="country-display">
            <span className="country-code">{selectedCountry.code}</span>
          </div>
          <select
            value={countryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            className="country-code-select"
            disabled={disabled}
            aria-label="Country code"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Separator */}
        <div className="separator"></div>

        {/* Phone Number Input */}
        <div className="phone-number-input">
          <input
            id={id}
            name={name}
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneNumberChange}
            onKeyPress={handlePhoneNumberKeyPress}
            onBlur={onBlur}
            placeholder={placeholder}
            className="phone-number-field"
            disabled={disabled}
            required={required}
            maxLength={12} // Max length for formatted number (XXX-XXX-XXXX)
            autoComplete="tel"
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <Phone size={16} className="phone-icon" />
        </div>
      </div>

      {/* Full number preview - only show if number exists and is valid */}
      {phoneNumber && phoneNumber.length >= 10 && (
        <div className="phone-preview">
          <span className="preview-label">Full number:</span>
          <span className="preview-number">{countryCode} {formatPhoneNumber(phoneNumber)}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div id={`${id}-error`} className="phone-input-error" role="alert">
          {error}
        </div>
      )}

      {/* Help text - only show when no error */}
      {!error && (
        <div className="phone-input-help">
          Enter up to 10 digits
        </div>
      )}
    </div>
  );
};

export default PhoneInput;