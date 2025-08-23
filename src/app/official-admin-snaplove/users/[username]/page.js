'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function UserDetailPage({ params }) {
  const router = useRouter();
  const { username } = params;
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
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
          throw new Error('Failed to fetch user details');
        }
        
        const data = await response.json();
        setUser(data.data.user);
        setStatistics(data.data.statistics);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [username]);
  
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
        <Link href="/official-admin-snaplove/users" className="mr-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img 
              src={user.image_profile || "https://via.placeholder.com/150"} 
              alt={user.name} 
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
            
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Role:</span>
                <span 
                  className={`px-2 text-xs font-semibold rounded-full 
                    ${user.role === 'developer' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'official' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'verified_premium' ? 'bg-green-100 text-green-800' : 
                      user.role === 'verified_basic' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}
                >
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status:</span>
                <span 
                  className={`px-2 text-xs font-semibold rounded-full 
                    ${user.ban_status ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                >
                  {user.ban_status ? 'Banned' : 'Active'}
                </span>
              </div>
              
              {user.ban_status && user.ban_release_datetime && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Ban Until:</span>
                  <span className="font-medium">
                    {new Date(user.ban_release_datetime).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Google:</span>
                <span className="font-medium">{user.google_id}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {new Date(user.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mt-6 w-full space-y-3">
              <Link 
                href={`/official-admin-snaplove/users/${username}/edit`} 
                className="block w-full py-2 bg-yellow-500 text-white text-center rounded-lg hover:bg-yellow-600"
              >
                <FaEdit className="inline mr-2" /> Edit User
              </Link>
              <Link 
                href={`/official-admin-snaplove/users/${username}/delete`} 
                className="block w-full py-2 bg-red-500 text-white text-center rounded-lg hover:bg-red-600"
              >
                <FaTrash className="inline mr-2" /> Delete User
              </Link>
            </div>
          </div>
        </div>
        
        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frames Statistics */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Frames</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Public</span>
                    <span className="block text-2xl font-bold text-blue-600">{statistics.frames.public}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Private</span>
                    <span className="block text-2xl font-bold text-blue-600">{statistics.frames.private}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Total Likes</span>
                    <span className="block text-2xl font-bold text-blue-600">{statistics.frames.total_frame_likes}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Total Uses</span>
                    <span className="block text-2xl font-bold text-blue-600">{statistics.frames.total_frame_uses}</span>
                  </div>
                </div>
              </div>
              
              {/* Photos Statistics */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Posted</span>
                    <span className="block text-2xl font-bold text-green-600">{statistics.photos.posted}</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Private</span>
                    <span className="block text-2xl font-bold text-green-600">{statistics.photos.private}</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Total Likes</span>
                    <span className="block text-2xl font-bold text-green-600">{statistics.photos.total_photo_likes}</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-600">Total Photos</span>
                    <span className="block text-2xl font-bold text-green-600">{statistics.photos.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User Bio */}
          {user.bio && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Bio</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
          
          {/* Recent Activity */}
          {statistics && statistics.recent_frames && statistics.recent_frames.length > 0 && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Recent Frames</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visibility</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statistics.recent_frames.map((frame) => (
                      <tr key={frame.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{frame.title}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${frame.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {frame.visibility}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{frame.like_count.length}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{frame.use_count.length}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(frame.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {statistics && statistics.recent_posts && statistics.recent_posts.length > 0 && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Recent Posts</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statistics.recent_posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{post.title}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.posted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {post.posted ? 'Posted' : 'Private'}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{post.like_count.length}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}