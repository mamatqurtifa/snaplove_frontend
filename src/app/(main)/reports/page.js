'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/report';
import { FaSearch, FaEye, FaClock, FaExclamationTriangle, FaCheck, FaTimes, FaImage } from 'react-icons/fa';

export default function UserReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
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
  const [status, setStatus] = useState('');
  
  const fetchReports = async (page = 1) => {
    if (!user?.username) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: page,
        limit: 20
      };
      
      if (status) params.status = status;
      
      const response = await reportService.getUserReports(user.username, params);
      
      if (!response.success) {
        throw new Error('Failed to fetch reports');
      }
      
      setReports(response.data.reports || []);
      setPagination(response.data.pagination || {
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
    if (user?.username) {
      fetchReports(1);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchReports(1);
  }, [status]);
  
  const handleViewReport = (id) => {
    router.push(`/reports/${id}`);
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="w-3 h-3" />;
      case 'done': return <FaCheck className="w-3 h-3" />;
      case 'rejected': return <FaTimes className="w-3 h-3" />;
      default: return <FaExclamationTriangle className="w-3 h-3" />;
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'done': return 'Resolved';
      case 'pending': return 'Under Review';
      case 'rejected': return 'Rejected';
      default: return status || 'Unknown';
    }
  };

  const getStatusDescription = (status) => {
    switch(status) {
      case 'done': return 'Your report has been reviewed and resolved by our team';
      case 'pending': return 'Your report is being reviewed by our moderation team';
      case 'rejected': return 'Your report was reviewed but no action was needed';
      default: return 'Status unknown';
    }
  };

  // Helper function to get report ID safely
  const getReportId = (report) => {
    const id = report?.id;
    if (!id) return 'N/A';
    return typeof id === 'string' && id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  // Safe function to get frame images
  const getFrameImage = (frame) => {
    if (!frame) return "https://via.placeholder.com/40";
    if (frame.images && Array.isArray(frame.images) && frame.images.length > 0) {
      return frame.images[0];
    }
    return "https://via.placeholder.com/40";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center text-red-600">Please log in to view your reports</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
          <p className="text-gray-600">Track the status of your content reports</p>
        </div>
        
        {/* Status Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Reports</option>
              <option value="pending">Under Review</option>
              <option value="done">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <div className="text-sm text-gray-500">
              Total reports: {pagination.total_items}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span className="font-medium">Error:</span>
            </div>
            <p className="mt-1">{error}</p>
          </div>
        )}
        
        {/* Reports List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report?.title || 'Untitled Report'}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report?.report_status)}`}>
                          {getStatusIcon(report?.report_status)}
                          {getStatusText(report?.report_status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {report?.description || 'No description provided'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getStatusDescription(report?.report_status)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Reported Frame Info */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={getFrameImage(report?.frame)} 
                        alt="Frame" 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {report?.frame?.title || 'Unknown Frame'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {report?.frame?.layout_type || 'Unknown layout'} by @{report?.frame?.owner?.username || 'unknown'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <FaImage className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Admin Response (if resolved) */}
                  {report?.report_status === 'done' && report?.admin_response && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <FaCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">Admin Response:</p>
                          <p className="text-sm text-green-700">{report.admin_response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        Submitted: {report?.created_at ? new Date(report.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown Date'}
                      </span>
                      {report?.updated_at && report?.updated_at !== report?.created_at && (
                        <span className="flex items-center gap-1">
                          Updated: {new Date(report.updated_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                      <span>ID: {getReportId(report)}</span>
                    </div>
                    <button 
                      onClick={() => handleViewReport(report?.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      disabled={!report?.id}
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaExclamationTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500 mb-6">
                {status ? `No reports found with status "${getStatusText(status)}"` : 'You haven\'t submitted any reports yet'}
              </p>
              {status && (
                <button 
                  onClick={() => setStatus('')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && reports.length > 0 && pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} reports
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => fetchReports(pagination.current_page - 1)}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  !pagination.has_prev_page 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button 
                onClick={() => fetchReports(pagination.current_page + 1)}
                disabled={!pagination.has_next_page}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  !pagination.has_next_page 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                }`}
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