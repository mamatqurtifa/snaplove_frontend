'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({
    role_distribution: {},
    ban_distribution: {},
    total_users: 0
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_next_page: false,
    has_prev_page: false
  });
  
  // Filter states
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [banStatus, setBanStatus] = useState('');
  const [sort, setSort] = useState('newest');
  
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 20);
      
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      if (banStatus !== '') params.append('ban_status', banStatus);
      if (sort) params.append('sort', sort);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.data.users);
      setPagination(data.data.pagination);
      setStatistics(data.data.statistics);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers(1);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };
  
  const handleViewUser = (username) => {
    router.push(`/official-admin-snaplove/users/${username}`);
  };
  
  const handleEditUser = (username) => {
    router.push(`/official-admin-snaplove/users/${username}/edit`);
  };
  
  const handleDeleteUser = (username) => {
    router.push(`/official-admin-snaplove/users/${username}/delete`);
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-green-600">{statistics.ban_distribution?.active || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Banned Users</h2>
          <p className="text-3xl font-bold text-red-600">{statistics.ban_distribution?.banned || 0}</p>
        </div>
      </div>
      
      {/* Role Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statistics.role_distribution || {}).map(([role, count]) => (
            <div key={role} className="text-center">
              <div className="text-lg font-semibold">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{role.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, username or email"
                className="w-full p-2 pl-10 border rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              className="p-2 border rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="basic">Basic</option>
              <option value="verified_basic">Verified Basic</option>
              <option value="verified_premium">Verified Premium</option>
              <option value="official">Official</option>
              <option value="developer">Developer</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={banStatus}
              onChange={(e) => setBanStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Banned</option>
              <option value="false">Active</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="username_asc">Username (A-Z)</option>
              <option value="username_desc">Username (Z-A)</option>
            </select>
            
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={user.image_profile || "https://via.placeholder.com/40"} 
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'developer' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'official' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'verified_premium' ? 'bg-green-100 text-green-800' : 
                          user.role === 'verified_basic' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.ban_status ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.ban_status ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUser(user.username)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user.username)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.username)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} users
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => fetchUsers(pagination.current_page - 1)}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 border rounded-md ${!pagination.has_prev_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Previous
              </button>
              <button 
                onClick={() => fetchUsers(pagination.current_page + 1)}
                disabled={!pagination.has_next_page}
                className={`px-4 py-2 border rounded-md ${!pagination.has_next_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}