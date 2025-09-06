'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaExclamationTriangle, FaImage } from 'react-icons/fa';

export default function FramePublicApprovalPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
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
  const [sortBy, setSortBy] = useState('newest');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [frameToReject, setFrameToReject] = useState(null);
  
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
      params.append('status', 'pending'); // Always fetch pending frames
      params.append('page', page);
      params.append('limit', 20);
      
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
      console.log('📊 API Response:', data);
      console.log('🖼️ Frames data:', data.data.frames);
      
      setFrames(data.data.frames || data.data || []);
      setPagination(data.data.pagination || data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 20,
        has_next_page: false,
        has_prev_page: false
      });
    } catch (err) {
      console.error('Error fetching frames for approval:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('🔍 Component mounted, fetching frames...');
    fetchFrames(1);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFrames(1);
  };
  
  const handleApprove = async (frameId) => {
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
          approval_status: 'approved'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSuccess('Frame has been approved successfully');
      
      // Remove the frame from the list
      setFrames(frames.filter(frame => frame.id !== frameId));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total_items: prev.total_items - 1
      }));
      
    } catch (err) {
      console.error('Error approving frame:', err);
      setError(err.message);
    }
  };
  
  const handleRejectClick = (frame) => {
    setFrameToReject(frame);
    setRejectionReason('');
    setShowRejectionModal(true);
  };
  
  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    
    try {
      setSuccess('');
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/framePublicApproval/${frameToReject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          approval_status: 'rejected',
          rejection_reason: rejectionReason
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSuccess('Frame has been rejected successfully');
      
      // Remove the frame from the list
      setFrames(frames.filter(frame => frame.id !== frameToReject.id));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total_items: prev.total_items - 1
      }));
      
      // Close modal
      setShowRejectionModal(false);
      setFrameToReject(null);
      setRejectionReason('');
      
    } catch (err) {
      console.error('Error rejecting frame:', err);
      setError(err.message);
    }
  };
  
  const handleBulkAction = async (frameIds, action, reason = '') => {
    try {
      setSuccess('');
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const body = {
        frame_ids: frameIds,
        approval_status: action
      };
      
      if (action === 'rejected' && reason) {
        body.rejection_reason = reason;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/framePublicApproval/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSuccess(`${frameIds.length} frame(s) have been ${action} successfully`);
      
      // Remove the frames from the list
      setFrames(frames.filter(frame => !frameIds.includes(frame.id)));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total_items: prev.total_items - frameIds.length
      }));
      
    } catch (err) {
      console.error(`Error bulk ${action} frames:`, err);
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
      
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Reject Frame</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting &quot;{frameToReject?.title}&quot;:
            </p>
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              required
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setFrameToReject(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject Frame
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Frames Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : frames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frames.map((frame) => {
            console.log('🖼️ Processing frame:', frame);
            console.log('📸 Thumbnail URL:', frame.thumbnail);
            
            return (
              <div key={frame.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img 
                        src={frame.user?.image_profile || "https://via.placeholder.com/40"} 
                        alt={frame.user?.name || 'User'} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{frame.user?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">@{frame.user?.username || 'unknown'}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(frame.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-3">{frame.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{frame.desc || 'No description'}</p>
                </div>
                
                <div className="flex justify-center p-4 bg-gray-50">
                  {/* Debug Info */}
                  <div className="w-full">
                    <div className="text-xs text-gray-500 mb-2 p-2 bg-yellow-50 border rounded">
                      <strong>Debug Info:</strong><br/>
                      Thumbnail URL: {frame.thumbnail || 'NOT SET'}<br/>
                      Full URL: {frame.thumbnail ? frame.thumbnail : 'N/A'}
                    </div>
                    
                    {frame.thumbnail ? (
                      <div className="text-center">
                        <img 
                          src={frame.thumbnail} 
                          alt={frame.title} 
                          className="max-h-64 object-contain mx-auto"
                          onLoad={(e) => {
                            console.log('✅ Image loaded successfully:', frame.thumbnail);
                          }}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', frame.thumbnail);
                            console.error('Error details:', e);
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300x200?text=Image+Load+Failed";
                          }}
                          style={{ border: '2px solid red' }}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Click to test: <a href={frame.thumbnail} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open image in new tab</a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200 w-full h-64 rounded">
                        <FaImage className="text-gray-400 text-4xl" />
                        <span className="ml-2 text-gray-500">No image available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex p-4 border-t">
                  <div className="flex-1 text-sm text-gray-500">
                    <div className="mb-1">Tags: {frame.tag_label && frame.tag_label.length > 0 ? frame.tag_label.join(', ') : 'No tags'}</div>
                    <div>Layout: {frame.layout_type || 'Unknown'}</div>
                    <div>Status: {frame.approval_status}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleRejectClick(frame)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(frame.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center"
                    >
                      <FaCheck className="mr-1" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-bold cursor-pointer">🐛 Debug Info</summary>
            <div className="mt-2 text-sm">
              <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
              <p><strong>Search:</strong> {search || 'empty'}</p>
              <p><strong>Sort By:</strong> {sortBy}</p>
              <p><strong>Current Page:</strong> {pagination.current_page}</p>
              <p><strong>Total Items:</strong> {pagination.total_items}</p>
              <p><strong>Total Frames:</strong> {frames.length}</p>
              <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
              <p><strong>Auth Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
              
              <div className="mt-4">
                <strong>Sample Frame Data (First Frame):</strong>
                <pre className="bg-gray-200 p-2 mt-2 rounded text-xs overflow-auto max-h-60">
                  {frames.length > 0 ? JSON.stringify(frames[0], null, 2) : 'No frames available'}
                </pre>
              </div>
              
              <div className="mt-4">
                <strong>Full API Response:</strong>
                <pre className="bg-gray-200 p-2 mt-2 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify({ frames, pagination }, null, 2)}
                </pre>
              </div>
              
              {error && (
                <div className="mt-4">
                  <strong className="text-red-600">Error:</strong>
                  <pre className="bg-red-100 p-2 mt-2 rounded text-xs overflow-auto">
                    {error}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}