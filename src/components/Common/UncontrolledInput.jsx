import React, { useRef, useEffect, forwardRef } from 'react';

const UncontrolledInput = forwardRef(({ 
  name, 
  placeholder, 
  type = "text", 
  onValueChange, 
  initialValue = "",
  className = "",
  id,
  autoComplete,
  rows,
  ...rest 
}, ref) => {
  const inputRef = useRef(null);
  const finalRef = ref || inputRef;

  useEffect(() => {
    if (finalRef.current && initialValue !== undefined) {
      finalRef.current.value = initialValue;
    }
  }, [initialValue, finalRef]);

  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(name, e.target.value);
    }
  };

  // Use textarea for multiline inputs
  if (type === 'textarea') {
    return (
      <textarea
        ref={finalRef}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={handleChange}
        defaultValue={initialValue}
        className={className}
        autoComplete={autoComplete}
        rows={rows}
        {...rest}
      />
    );
  }

  // Use select for dropdown inputs
  if (type === 'select') {
    return (
      <select
        ref={finalRef}
        name={name}
        id={id}
        onChange={handleChange}
        defaultValue={initialValue}
        className={className}
        {...rest}
      >
        {rest.children}
      </select>
    );
  }

  // Regular input
  return (
    <input
      ref={finalRef}
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      onChange={handleChange}
      defaultValue={initialValue}
      className={className}
      autoComplete={autoComplete}
      {...rest}
    />
  );
});

UncontrolledInput.displayName = 'UncontrolledInput';

export default UncontrolledInput;