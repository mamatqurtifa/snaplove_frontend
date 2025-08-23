'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function EditUserPage({ params }) {
  const router = useRouter();
  const { username } = params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [userData, setUserData] = useState({
    name: '',
    role: '',
    bio: '',
    ban_status: false,
    ban_release_datetime: ''
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        const user = data.data.user;
        
        setUserData({
          name: user.name || '',
          role: user.role || '',
          bio: user.bio || '',
          ban_status: user.ban_status || false,
          ban_release_datetime: user.ban_release_datetime ? new Date(user.ban_release_datetime).toISOString().slice(0, 16) : ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [username]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Reset ban release date if user is unbanned
    if (name === 'ban_status' && !checked) {
      setUserData(prev => ({
        ...prev,
        ban_release_datetime: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const updateData = {
        name: userData.name,
        role: userData.role,
        bio: userData.bio,
        ban_status: userData.ban_status
      };
      
      if (userData.ban_status && userData.ban_release_datetime) {
        updateData.ban_release_datetime = userData.ban_release_datetime;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      
      setSuccess('User updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/official-admin-snaplove/users/${username}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href={`/official-admin-snaplove/users/${username}`} className="mr-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Edit User: {username}</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">User Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  maxLength={100}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="verified_basic">Verified Basic</option>
                  <option value="verified_premium">Verified Premium</option>
                  <option value="official">Official</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  rows={5}
                  maxLength={500}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{userData.bio.length}/500 characters</p>
              </div>
            </div>
            
            {/* Ban Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Ban Settings</h2>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="ban_status"
                  id="ban_status"
                  checked={userData.ban_status}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ban_status" className="ml-2 block text-sm text-gray-700">
                  Ban this user
                </label>
              </div>
              
              {userData.ban_status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ban Until (leave empty for permanent ban)</label>
                  <input
                    type="datetime-local"
                    name="ban_release_datetime"
                    value={userData.ban_release_datetime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              
              {userData.ban_status && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    <strong>Warning:</strong> Banning this user will prevent them from accessing the platform until the ban is lifted.
                    {userData.ban_release_datetime 
                      ? ` The ban will be automatically lifted on ${new Date(userData.ban_release_datetime).toLocaleString()}.` 
                      : ' This will be a permanent ban until manually lifted.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link 
              href={`/official-admin-snaplove/users/${username}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}