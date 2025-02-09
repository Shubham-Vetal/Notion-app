// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className, onClick }) => (
  <div 
    className={`rounded-lg shadow-md overflow-hidden bg-white ${className}`} 
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`px-4 py-2 border-b ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={`px-4 py-2 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className }) => (
  <div className={`px-4 py-2 border-t ${className}`}>
    {children}
  </div>
);
