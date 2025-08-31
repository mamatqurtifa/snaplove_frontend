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
import RoleBadge from '@/components/ui/RoleBadge';

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  
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
        await authService.getMe();
        setTestApiStatus({ success: true, message: 'API connection successful' });
      } catch (error) {
        if (error.response) {
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

  // Check if current user is following this profile user
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || !username || currentUser.username === username) {
        console.log('Skipping follow check:', { currentUser: currentUser?.username, username, sameUser: currentUser?.username === username });
        return;
      }
      
      try {
        console.log(`Checking if ${currentUser.username} is following ${username}`);
        const response = await api.get(`/user/${currentUser.username}/following/check/${username}`);
        console.log('Follow check response:', response.data);
        
        if (response.data.success) {
          const isFollowingStatus = response.data.data.is_following; // API uses is_following, not isFollowing
          console.log('Follow status from API:', isFollowingStatus);
          setIsFollowing(isFollowingStatus);
        } else {
          console.error('Follow check failed:', response.data.message);
          setIsFollowing(false);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
        if (error.response) {
          console.error('Follow check error response:', error.response.data);
        }
        setIsFollowing(false);
      }
    };
    
    checkFollowStatus();
  }, [currentUser, username, statsRefreshKey]); // Added statsRefreshKey to dependencies

  // Function to handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUser) {
      router.push(`/login?redirect=/user/${username}`);
      return;
    }
    
    setFollowLoading(true);
    
    try {
      if (isFollowing) {
        // For unfollow: Need to get the followingId first
        console.log('Attempting to unfollow user:', username);
        
        const followingResponse = await api.get(`/user/${currentUser.username}/following`);
        console.log('Following list response:', followingResponse.data);
        
        if (followingResponse.data.success) {
          const following = followingResponse.data.data.following || [];
          const targetUser = following.find(user => user.username === username);
          
          if (targetUser) {
            console.log('Found target user to unfollow:', targetUser);
            // Unfollow the user using the followingId
            const unfollowResponse = await api.delete(`/user/${currentUser.username}/following/${targetUser.id}`);
            console.log('Unfollow response:', unfollowResponse.data);
            
            if (unfollowResponse.data.success) {
              setIsFollowing(false);
              // Force refresh stats
              setStatsRefreshKey(prev => prev + 1);
            } else {
              throw new Error(unfollowResponse.data.message || 'Unfollow failed');
            }
          } else {
            console.error('Target user not found in following list');
            // If not found, maybe they're not following anymore
            setIsFollowing(false);
          }
        }
      } else {
        // Follow the user
        console.log('Attempting to follow user:', username);
        
        const followResponse = await api.post(`/user/${currentUser.username}/following`, {
          following_username: username
        });
        console.log('Follow response:', followResponse.data);
        
        if (followResponse.data.success) {
          setIsFollowing(true);
          // Force refresh stats
          setStatsRefreshKey(prev => prev + 1);
        } else {
          throw new Error(followResponse.data.message || 'Follow failed');
        }
      }
      
    } catch (error) {
      console.error('Error toggling follow status:', error);
      
      let errorMessage = 'Failed to update follow status. Please try again.';
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setFollowLoading(false);
    }
  };

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
              <p><strong>Username:</strong> {username}</p>
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}/user/{username}</p>
              <p><strong>Error:</strong> {error}</p>
              <p><strong>Auth Token Present:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Yes' : 'No'}</p>
              <p><strong>Current User:</strong> {currentUser ? `@${currentUser.username}` : 'Not logged in'}</p>
              <p><strong>API Test:</strong> {testApiStatus ? (testApiStatus.success ? '✅ ' : '❌ ') + testApiStatus.message : 'Testing...'}</p>
              <p><strong>Follow Status:</strong> {isFollowing ? 'Following' : 'Not Following'}</p>
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
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">{user.name}</h1>
                {/* Add RoleBadge here */}
                <RoleBadge role={user.role} />
              </div>
              
              {/* Follow/Unfollow Button - Only show if not viewing own profile */}
              {currentUser && currentUser.username !== username && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    isFollowing 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </span>
                  ) : (
                    isFollowing ? 'Unfollow' : 'Follow'
                  )}
                </button>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">@{user.username}</p>
            
            {/* Bio Section */}
            {user.bio ? (
              <p className="text-gray-800 mt-3 mb-4 text-sm md:text-base leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="text-gray-500 italic mt-3 mb-4 text-sm">
                No bio available
              </p>
            )}
            
            <div className="text-sm text-gray-500">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Stats - Pass the refreshKey to force update when follow status changes */}
      <UserProfileStats 
        username={username} 
        shouldRefetch={statsRefreshKey} 
        currentUser={currentUser}
      />
      
      {/* Tabs for Photos, Liked, etc. */}
      <ProfileTabs username={username} currentUser={currentUser} />
      
      {/* Debug section - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-bold cursor-pointer">Follow Debug Info</summary>
            <div className="mt-2 text-sm">
              <p><strong>Current User:</strong> {currentUser ? currentUser.username : 'Not logged in'}</p>
              <p><strong>Profile User:</strong> {username}</p>
              <p><strong>User Bio:</strong> {user?.bio || 'No bio'}</p>
              <p><strong>User Role:</strong> {user?.role || 'No role'}</p>
              <p><strong>Is Following:</strong> {isFollowing ? 'Yes' : 'No'}</p>
              <p><strong>Follow Loading:</strong> {followLoading ? 'Yes' : 'No'}</p>
              <p><strong>Stats Refresh Key:</strong> {statsRefreshKey}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}