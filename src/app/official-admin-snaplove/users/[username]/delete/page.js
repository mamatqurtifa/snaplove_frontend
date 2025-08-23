'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

export default function DeleteUserPage({ params }) {
  const router = useRouter();
  const { username } = params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  
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
        setUser(data.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [username]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          confirm_deletion: confirmation,
          reason: reason
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }
      
      setSuccess('User deleted successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/official-admin-snaplove/users');
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user. Please try again.');
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
  
  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-xl text-center text-red-600">User not found</p>
        <div className="flex justify-center mt-4">
          <Link href="/official-admin-snaplove/users" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href={`/official-admin-snaplove/users/${username}`} className="mr-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Delete User</h1>
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
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="font-bold text-red-600">Warning: This action cannot be undone</h3>
              <p className="text-sm text-red-700 mt-1">
                You are about to delete the user <strong>{user.name} (@{user.username})</strong>. 
                This will permanently remove the user&apos;s account and all associated content including frames, photos, and posts.
                This action cannot be reversed.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/3 text-gray-600">Name:</span>
                <span className="w-2/3 font-medium">{user.name}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-600">Username:</span>
                <span className="w-2/3 font-medium">@{user.username}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-600">Email:</span>
                <span className="w-2/3 font-medium">{user.email}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-600">Role:</span>
                <span className="w-2/3 font-medium">{user.role.replace('_', ' ')}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-600">Created:</span>
                <span className="w-2/3 font-medium">{new Date(user.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Deletion Confirmation</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="DELETE"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for deletion (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                maxLength={500}
                placeholder="Please provide a reason for this deletion"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link 
                href={`/official-admin-snaplove/users/${username}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}