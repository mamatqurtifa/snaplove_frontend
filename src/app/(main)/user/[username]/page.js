'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/services/api';
import { authService } from '@/services/auth';
import ProfileTabs from '@/components/profile/ProfileTabs';
import UserProfileStats from '@/components/profile/UserProfileStats';
import UserNotFound from '@/components/profile/UserNotFound';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [testApiStatus, setTestApiStatus] = useState(null);
  
  // Get current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getMe();
        if (response.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.log('Not logged in or error fetching current user');
      }
    };
    
    // Test API with a simple endpoint
    const testApiConnection = async () => {
      try {
        // Try to get current user (will fail if not logged in, but that's ok)
        await authService.getMe();
        setTestApiStatus({ success: true, message: 'API connection successful' });
      } catch (error) {
        if (error.response) {
          // If we got any response, the API is working
          setTestApiStatus({ 
            success: false, 
            message: `API reachable but returned ${error.response.status}`,
            status: error.response.status
          });
        } else {
          setTestApiStatus({ 
            success: false, 
            message: 'API connection failed completely',
            error: error.message
          });
        }
      }
    };

    fetchCurrentUser();
    testApiConnection();
  }, []);
  
  useEffect(() => {
    if (!username) return;
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const apiUrl = `/user/${username}`;
        console.log('Fetching user profile from:', apiUrl);
        
        const response = await api.get(apiUrl);
        
        setApiResponse(response.data);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setUser(response.data.data.user);
        } else {
          setError('Failed to load user profile: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          
          if (error.response.status === 401) {
            setError('Authentication required to view this profile. Please log in.');
          } else if (error.response.status === 403) {
            setError('You do not have permission to view this profile.');
          } else if (error.response.status === 404) {
            setError('User not found');
          } else {
            setError(`Error loading profile (Status: ${error.response.status})`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from server. Check if API is running.');
        } else {
          setError('Error: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  // Function to retry with token
  const handleLogin = () => {
    router.push(`/login?redirect=/user/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <UserNotFound message={error || 'User not found'} />
        
        {(error?.includes('Authentication required') || error?.includes('permission')) && (
          <div className="container mx-auto px-4 py-4 max-w-4xl mt-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-center mb-4">This profile requires authentication to view.</p>
              <div className="flex justify-center">
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Log in to view profile
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug information - remove in production */}
        <div className="container mx-auto px-4 py-4 max-w-4xl mt-8">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-bold cursor-pointer">Debug Info</summary>
            <div className="mt-2 text-sm overflow-auto">
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}/user/{username}</p>
              <p><strong>Error:</strong> {error}</p>
              <p><strong>Auth Token Present:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Yes' : 'No'}</p>
              <p><strong>Current User:</strong> {currentUser ? `@${currentUser.username}` : 'Not logged in'}</p>
              <p><strong>API Test:</strong> {testApiStatus ? (testApiStatus.success ? '✅ ' : '❌ ') + testApiStatus.message : 'Testing...'}</p>
              <pre className="bg-gray-200 p-2 mt-2 rounded">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response data'}
              </pre>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image 
              src={user.image_profile || '/images/default-avatar.png'} 
              alt={user.name}
              className="rounded-full object-cover"
              fill
              sizes="(max-width: 768px) 96px, 128px"
              priority
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mb-2">@{user.username}</p>
            
            {user.bio && (
              <p className="text-gray-800 mt-2 mb-4">{user.bio}</p>
            )}
            
            <div className="text-sm text-gray-500">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Stats */}
      <UserProfileStats username={username} />
      
      {/* Tabs for Photos, Liked, etc. */}
      <ProfileTabs username={username} />
    </div>
  );
}