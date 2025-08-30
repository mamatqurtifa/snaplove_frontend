'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import UserNotFound from '@/components/profile/UserNotFound';

export default function UserFollowingPage() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username;
  
  const [following, setFollowing] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!username) return;
    
    const fetchUserAndFollowing = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userResponse = await api.get(`/user/${username}`);
        
        if (userResponse.data.success) {
          setUser(userResponse.data.data.user);
          
          // Fetch following
          const followingResponse = await api.get(`/user/${username}/following`);
          
          if (followingResponse.data.success) {
            setFollowing(followingResponse.data.data.following || []);
          }
        } else {
          setError('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        if (error.response && error.response.status === 401) {
          setError('Authentication required to view this profile');
        } else if (error.response && error.response.status === 404) {
          setError('User not found');
        } else {
          setError('Error loading profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFollowing();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return <UserNotFound message={error || 'User not found'} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">People @{user.username} follows</h1>
        </div>
        
        {following.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            @{user.username} isn&apos;t following anyone yet.
          </div>
        ) : (
          <ul className="divide-y">
            {following.map((followedUser) => (
              <li key={followedUser.id} className="py-4">
                <Link href={`/user/${followedUser.username}`} className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition">
                  <div className="relative w-12 h-12 mr-4">
                    <Image 
                      src={followedUser.image_profile || '/images/default-avatar.png'} 
                      alt={followedUser.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{followedUser.name}</div>
                    <div className="text-sm text-gray-500">@{followedUser.username}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}