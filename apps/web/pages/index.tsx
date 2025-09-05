import { useState } from 'react';

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Setting up your AI receptionist...');
    
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl, bookingUrl, staffPhone })
      });
      
      if (response.ok) {
        setMessage('Setup complete! Your AI receptionist is ready.');
      } else {
        setMessage('Setup failed. Please try again.');
      }
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCall = () => {
    setMessage('Test call initiated. Check your phone!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>AI Receptionist Setup</h1>
      <p>Set up your AI receptionist in under 60 seconds!</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="websiteUrl">Business Website URL *</label>
          <input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            placeholder="https://yourbusiness.com"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="bookingUrl">Booking URL (optional)</label>
          <input
            id="bookingUrl"
            type="url"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            placeholder="https://yourbusiness.com/book"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="staffPhone">Staff Phone (optional)</label>
          <input
            id="staffPhone"
            type="tel"
            value={staffPhone}
            onChange={(e) => setStaffPhone(e.target.value)}
            placeholder="+1234567890"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !websiteUrl}
          style={{ 
            padding: '0.75rem 2rem',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Setting up...' : 'Set Up AI Receptionist'}
        </button>
        
        <button
          type="button"
          onClick={handleTestCall}
          style={{
            marginLeft: '1rem',
            padding: '0.75rem 2rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Call
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}