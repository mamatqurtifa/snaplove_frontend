'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export default function FramePublicApprovalPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
    has_next_page: false,
    has_prev_page: false
  });
  
  // Filter states
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const fetchFrames = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      
      if (search) params.append('search', search);
      if (sortBy) params.append('sort', sortBy);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/framePublicApproval?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setFrames(data.data.frames);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('Error fetching frames for approval:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFrames(1);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFrames(1);
  };
  
  const handleAction = async (frameId, action) => {
    try {
      setSuccess('');
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/framePublicApproval/${frameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: action // 'approve' or 'reject'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSuccess(`Frame has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Remove the frame from the list
      setFrames(frames.filter(frame => frame.id !== frameId));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total_items: prev.total_items - 1
      }));
      
    } catch (err) {
      console.error(`Error ${action}ing frame:`, err);
      setError(err.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Frame Public Approval</h1>
      
      {/* Info message */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Review frames submitted for public sharing. Approved frames will be visible to all users in the public library.
            </p>
          </div>
        </div>
      </div>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by frame title or creator"
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
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
      
      {/* Frames Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : frames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frames.map((frame) => (
            <div key={frame.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <img 
                      src={frame.user_image || "https://via.placeholder.com/40"} 
                      alt={frame.user_name} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium">{frame.user_name}</div>
                      <div className="text-sm text-gray-500">@{frame.username}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(frame.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-3">{frame.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{frame.description}</p>
              </div>
              
              <div className="flex justify-center p-4 bg-gray-50">
                <img 
                  src={frame.preview_url} 
                  alt={frame.title} 
                  className="max-h-64 object-contain"
                />
              </div>
              
              <div className="flex p-4 border-t">
                <div className="flex-1 text-sm text-gray-500">
                  <div className="mb-1">Tags: {frame.tags.join(', ')}</div>
                  <div>Category: {frame.category}</div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAction(frame.id, 'reject')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center"
                  >
                    <FaTimes className="mr-1" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAction(frame.id, 'approve')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center"
                  >
                    <FaCheck className="mr-1" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <FaCheck className="mx-auto text-green-500 text-5xl mb-4" />
          <h3 className="text-xl font-medium mb-2">All caught up!</h3>
          <p className="text-gray-600">There are no frames waiting for approval.</p>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && frames.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} frames
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => fetchFrames(pagination.current_page - 1)}
              disabled={!pagination.has_prev_page}
              className={`px-4 py-2 border rounded-md ${!pagination.has_prev_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
              Previous
            </button>
            <button 
              onClick={() => fetchFrames(pagination.current_page + 1)}
              disabled={!pagination.has_next_page}
              className={`px-4 py-2 border rounded-md ${!pagination.has_next_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}