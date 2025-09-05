'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiUserMinus, FiUserPlus, FiSearch } from 'react-icons/fi';
import { userService } from '@/services/user';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function FollowersFollowing({ username, type }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [username, type, page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 20,
        search: searchTerm
      };

      let response;
      if (type === 'followers') {
        response = await userService.getFollowers(username, params);
      } else {
        response = await userService.getFollowing(username, params);
      }

      if (response.success) {
        if (page === 1) {
          setUsers(response.data.followers || response.data.following || []);
        } else {
          setUsers(prev => [...prev, ...(response.data.followers || response.data.following || [])]);
        }
        setHasMore((response.data.followers || response.data.following || []).length === 20);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followingId) => {
    setActionLoading(followingId);
    try {
      const response = await userService.unfollowUser(username, followingId);
      if (response.success) {
        setUsers(users.filter(user => (user.id || user._id) !== followingId));
      } else {
        alert(response.message || 'Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Failed to unfollow user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    if (!confirm('Are you sure you want to remove this follower?')) {
      return;
    }

    setActionLoading(followerId);
    try {
      const response = await userService.removeFollower(username, followerId);
      if (response.success) {
        setUsers(users.filter(user => (user.id || user._id) !== followerId));
      } else {
        alert(response.message || 'Failed to remove follower');
      }
    } catch (error) {
      console.error('Error removing follower:', error);
      alert('Failed to remove follower');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${type}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
        />
      </form>

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id || user._id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={user.image_profile || "/images/assets/placeholder-user.png"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{user.bio}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {type === 'following' ? (
                <button
                  onClick={() => handleUnfollow(user.id || user._id)}
                  disabled={actionLoading === (user.id || user._id)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition"
                >
                  <FiUserMinus className="h-4 w-4" />
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveFollower(user.id || user._id)}
                  disabled={actionLoading === (user.id || user._id)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition"
                >
                  <FiUserMinus className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-10">
          {searchTerm ? `No ${type} found matching "${searchTerm}"` : `No ${type} yet`}
        </div>
      )}

      {/* Load More */}
      {hasMore && users.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-6 py-2 bg-[#FF9898] hover:bg-[#FF7070] text-white rounded-full text-sm font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
