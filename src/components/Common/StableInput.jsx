import React, { useRef, useEffect, forwardRef } from 'react';

// Stable input component that preserves focus regardless of parent re-renders
const StableInput = forwardRef(({ 
  value, 
  onChange, 
  onBlur,
  name,
  id,
  type = 'text',
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
  autoComplete,
  rows,
  ...otherProps 
}, ref) => {
  const inputRef = useRef(null);
  const lastValueRef = useRef(value);

  // Use the forwarded ref or create our own
  const actualRef = ref || inputRef;

  useEffect(() => {
    // Only update the DOM value if it's different from what the user typed
    // This prevents the cursor from jumping
    if (actualRef.current && lastValueRef.current !== value) {
      const element = actualRef.current;
      const start = element.selectionStart;
      const end = element.selectionEnd;
      
      element.value = value || '';
      
      // Restore cursor position
      if (document.activeElement === element) {
        element.setSelectionRange(start, end);
      }
    }
    lastValueRef.current = value;
  }, [value, actualRef]);

  const handleChange = (e) => {
    lastValueRef.current = e.target.value;
    if (onChange) {
      onChange(e);
    }
  };

  const commonProps = {
    ref: actualRef,
    name,
    id,
    placeholder,
    className,
    disabled,
    required,
    autoComplete,
    onChange: handleChange,
    onBlur,
    defaultValue: value || '',
    ...otherProps
  };

  if (type === 'textarea') {
    return <textarea {...commonProps} rows={rows} />;
  }

  if (type === 'select') {
    return (
      <select {...commonProps}>
        {otherProps.children}
      </select>
    );
  }

  return <input type={type} {...commonProps} />;
});

StableInput.displayName = 'StableInput';

export default StableInput;