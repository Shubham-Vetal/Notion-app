import React from 'react';

export const Alert = ({ children, className }) => {
  return <div className={`alert ${className}`}>{children}</div>;
};

export const AlertDescription = ({ children, className }) => {
  return <div className={`alert-description ${className}`}>{children}</div>;
};
