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
      setReports(data.data.reports || data.data || []);
      setPagination(data.data.pagination || data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 20,
        has_next_page: false,
        has_prev_page: false
      });
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
      default: return status;
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Content Reports</h1>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by content title or reporter"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
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
                        {report.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={report.content_thumbnail || "https://via.placeholder.com/40"} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{report.content_title}</div>
                            <div className="text-xs text-gray-500">{report.content_type} by @{report.content_owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.reporter_name}</div>
                        <div className="text-xs text-gray-500">@{report.reporter_username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(report.type)}`}>
                          {report.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewReport(report.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
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