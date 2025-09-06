// reports/page.js

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaFilter, FaEye, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
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
  const [status, setStatus] = useState('');
  const [reportType, setReportType] = useState('');
  const [sort, setSort] = useState('newest');
  
  const fetchReports = async (page = 1) => {
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
      params.append('limit', 20);
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (reportType) params.append('type', reportType);
      if (sort) params.append('sort', sort);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('API request failed');
      }
      
      setReports(data.data.reports || []);
      setPagination(data.data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 20,
        has_next_page: false,
        has_prev_page: false
      });
      setStatistics(data.data.statistics || null);
      
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReports(1);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports(1);
  };
  
  const handleViewReport = (id) => {
    router.push(`/official-admin-snaplove/reports/${id}`);
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'inappropriate_content': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-orange-100 text-orange-800';
      case 'harassment': return 'bg-purple-100 text-purple-800';
      case 'copyright': return 'bg-blue-100 text-blue-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'done': return 'Done';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status || 'Unknown';
    }
  };

  // Helper function to get report ID safely
  const getReportId = (report) => {
    const id = report?.id;
    if (!id) return 'N/A';
    return typeof id === 'string' && id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  // Safe function to format report type
  const formatReportType = (type) => {
    if (!type || typeof type !== 'string') return 'Unknown';
    return type.replace(/_/g, ' ');
  };

  // Safe function to get frame images
  const getFrameImage = (frame) => {
    if (!frame) return "https://via.placeholder.com/40";
    if (frame.images && Array.isArray(frame.images) && frame.images.length > 0) {
      return frame.images[0];
    }
    return "https://via.placeholder.com/40";
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Reports</h1>
        
        {/* Statistics Cards */}
        {statistics && (
          <div className="flex gap-4">
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-yellow-800">Pending</div>
              <div className="text-xl font-bold text-yellow-900">{statistics.pending || 0}</div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-green-800">Done</div>
              <div className="text-xl font-bold text-green-900">{statistics.done || 0}</div>
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-red-800">Rejected</div>
              <div className="text-xl font-bold text-red-900">{statistics.rejected || 0}</div>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-blue-800">Total</div>
              <div className="text-xl font-bold text-blue-900">{statistics.total || 0}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or reporter name"
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="copyright">Copyright</option>
              <option value="other">Other</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Reports Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getReportId(report)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report?.title || 'Untitled Report'}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {report?.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={getFrameImage(report?.frame)} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report?.frame?.title || 'Unknown Frame'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report?.frame?.layout_type || 'Unknown'} by @{report?.frame?.owner?.username || 'unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img 
                              className="h-8 w-8 rounded-full object-cover" 
                              src={report?.reporter?.image_profile || "https://via.placeholder.com/32"} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {report?.reporter?.name || 'Unknown Reporter'}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{report?.reporter?.username || 'unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report?.report_status)}`}>
                          {getStatusText(report?.report_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report?.created_at ? new Date(report.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown Date'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewReport(report?.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          disabled={!report?.id}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && reports.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} reports
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => fetchReports(pagination.current_page - 1)}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 border rounded-md ${!pagination.has_prev_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button 
                onClick={() => fetchReports(pagination.current_page + 1)}
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