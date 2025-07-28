import React from 'react';
import { Link } from 'react-router-dom';

function PlaceholderPage({ title, description }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#1e293b', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
          {description}
        </p>
        <Link 
          to="/dashboard" 
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PlaceholderPage;
