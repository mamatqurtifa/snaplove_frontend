'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function UserProfileStats({ username }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/user/${username}/stats`);
        
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load user stats');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        if (error.response && error.response.status === 401) {
          setError('Authentication required to view stats');
        } else {
          setError('Error loading user stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

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
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <Link href={`/user/${username}/followers`} className="hover:bg-gray-50 p-3 rounded-lg transition">
          <div className="font-bold text-xl">{stats.followers_count || 0}</div>
          <div className="text-gray-600 text-sm">Followers</div>
        </Link>
        
        <Link href={`/user/${username}/following`} className="hover:bg-gray-50 p-3 rounded-lg transition">
          <div className="font-bold text-xl">{stats.following_count || 0}</div>
          <div className="text-gray-600 text-sm">Following</div>
        </Link>
        
        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <div className="font-bold text-xl">{stats.photos_count || 0}</div>
          <div className="text-gray-600 text-sm">Photos</div>
        </div>
      </div>
    </div>
  );
}