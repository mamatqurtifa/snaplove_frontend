'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function UserProfileStats({ username, shouldRefetch, currentUser }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching stats for username:', username);
        
        const response = await api.get(`/user/${username}/stats`);
        console.log('Stats API response:', response.data);
        
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load user stats');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        if (error.response) {
          console.error('Stats error response:', error.response.data);
          if (error.response.status === 401) {
            setError('Authentication required to view stats');
          } else if (error.response.status === 404) {
            setError('User stats not found');
          } else {
            setError(`Error loading user stats (Status: ${error.response.status})`);
          }
        } else {
          setError('Error loading user stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username, shouldRefetch]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-center">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center text-red-500">{error}</div>
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug: Stats fetch failed for username: {username}</p>
            <p>Current user: {currentUser?.username || 'Not logged in'}</p>
            <p>ShouldRefetch key: {shouldRefetch}</p>
          </div>
        )}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center text-gray-500">No stats available</div>
      </div>
    );
  }

  // Check if current user can view followers/following (only if viewing own profile or public)
  const canViewSocialStats = stats && stats.social_stats;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Followers */}
        {canViewSocialStats ? (
          <Link href={`/user/${username}/followers`} className="hover:bg-gray-50 p-3 rounded-lg transition">
            <div className="font-bold text-xl">{stats.social_stats?.followers || 0}</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </Link>
        ) : (
          <div className="p-3 rounded-lg">
            <div className="font-bold text-xl">-</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </div>
        )}
        
        {/* Following */}
        {canViewSocialStats ? (
          <Link href={`/user/${username}/following`} className="hover:bg-gray-50 p-3 rounded-lg transition">
            <div className="font-bold text-xl">{stats.social_stats?.following || 0}</div>
            <div className="text-gray-600 text-sm">Following</div>
          </Link>
        ) : (
          <div className="p-3 rounded-lg">
            <div className="font-bold text-xl">-</div>
            <div className="text-gray-600 text-sm">Following</div>
          </div>
        )}
        
        {/* Photos */}
        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <div className="font-bold text-xl">{stats.public_frames?.total_approved || 0}</div>
          <div className="text-gray-600 text-sm">Photos</div>
        </div>
      </div>
      
      {/* Debug info in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Stats Debug:</strong>
          <pre className="mt-1">{JSON.stringify(stats, null, 2)}</pre>
          <p className="mt-1">Refresh key: {shouldRefetch}</p>
        </div>
      )} */}
    </div>
  );
}