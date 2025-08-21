"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

const GoogleAuthButton = ({ onSuccess, buttonText = "Login with Google", isRegister = false, className = "" }) => {
  const router = useRouter();

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

      if (isRegister) {
        // Register flow
        const result = await authService.register(userData);
        if (result.success) {
          if (onSuccess) {
            onSuccess(result.data);
          } else {
            router.push('/');
          }
        }
      } else {
        // Login flow
        const result = await authService.login({
          google_id: sub,
          email
        });
        if (result.success) {
          if (onSuccess) {
            onSuccess(result.data);
          } else {
            router.push('/');
          }
        }
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert(error.message || 'Authentication failed');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div id="google-button" className="flex justify-center"></div>
    </div>
  );
};

export default GoogleAuthButton;