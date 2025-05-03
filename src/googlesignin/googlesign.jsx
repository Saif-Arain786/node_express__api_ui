// App.js
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleLogins() {
  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    // Send ID token to your Node backend
    const res = await fetch('http://localhost:5004/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    console.log('User Info from backend:', data);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2>React Google Login</h2>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLogins;
