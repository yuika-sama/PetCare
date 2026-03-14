import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Project Test Navigation</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Use this page to easily navigate to the different screens in the project during development.
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        maxWidth: '400px'
      }}>
        <Link 
          to="/login" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Login Page
        </Link>
        <Link 
          to="/doctors/home" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Doctor Home
        </Link>
        <Link 
          to="/doctors/dashboard" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Doctor Dashboard
        </Link>
        <Link 
          to="/doctors/tickets" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Doctor Tickets
        </Link>
        <Link 
          to="/doctors/tickets/1" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Doctor Ticket Details
        </Link>
        <Link 
          to="/doctors/service-order/1" 
          style={{ padding: '10px 15px', backgroundColor: '#f0f4f8', borderRadius: '8px', textDecoration: 'none', color: '#1e40af', fontWeight: '500', border: '1px solid #d1d5db' }}
        >
          Doctor Service Order
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
