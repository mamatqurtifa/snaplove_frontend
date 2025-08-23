"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const GoogleAuthButton = ({ onSuccess, buttonText = "Login with Google", isRegister = false, className = "" }) => {
  const router = useRouter();
  const { login, register } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

  script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google?.accounts.id.renderButton(
        document.getElementById('google-button'),
        { 
          theme: 'outline', 
          size: 'large',
          text: buttonText,
          width: '100%',
          shape: 'pill',
        }
      );
      setInitializing(false);
    };

    return () => {
      // Cleanup script if exists
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [buttonText]);

  const handleCredentialResponse = async (response) => {
    try {
      setAuthLoading(true);
      // Decode JWT ID token from Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { sub, email, name, picture } = JSON.parse(jsonPayload);

      const userData = {
        google_id: sub,
        email,
        name,
        image_profile: picture
      };

      let result;
      if (isRegister) {
        // Explicit register page still supported
        result = await register(userData);
      } else {
        // Try login first
        try {
          result = await login({ google_id: sub, email });
        } catch (err) {
          const msg = err?.message || err?.error || '';
          // Auto-register if backend indicates user not found
            if (/not\s*found|register\s*first/i.test(msg)) {
            try {
              result = await register(userData);
            } catch (regErr) {
              throw regErr;
            }
          } else {
            throw err;
          }
        }
      }
      if (result?.success) {
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          router.push('/profile');
        }
      } else {
        throw new Error(result?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {(initializing || authLoading) && (
        <div className="w-full mb-3 text-center text-xs text-gray-500 animate-pulse">
          {authLoading ? 'Memproses akun...' : 'Memuat Google OAuth...'}
        </div>
      )}
      <div id="google-button" className="flex justify-center opacity-100"></div>
    </div>
  );
};

export default GoogleAuthButton;