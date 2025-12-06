'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#141414',
          color: '#E4E4E7',
          border: '1px solid #1E1E1E',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          minWidth: '200px',
          maxWidth: '500px',
        },

        // Default options for specific toast types
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#141414',
          },
          style: {
            background: '#141414',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10B981',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#141414',
          },
          style: {
            background: '#141414',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
          },
        },
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: '#00E5FF',
            secondary: '#141414',
          },
          style: {
            background: '#141414',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            color: '#00E5FF',
          },
        },

        // Custom options for specific messages can be passed as a second parameter
        // to the toast() function
      }}
    />
  );
}