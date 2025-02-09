import React from 'react';

export const Input = ({ value, onChange, className, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`input ${className}`}
      placeholder={placeholder}
    />
  );
};
