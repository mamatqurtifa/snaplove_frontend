// /src/app/official-admin-snaplove/reports/[id]/page.js

'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaUser, FaImage, FaClock, FaFlag, FaTrash } from 'react-icons/fa';

export default function ReportDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Use React.use() to unwrap params
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAction, setSelectedAction] = useState('no_action');
  
  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setReport(data.data.report || data.data);
        setAdminResponse(data.data.report?.admin_response || data.data?.admin_response || '');
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchReportDetails();
    }
  }, [id]);
  
  const handleActionSubmit = async (status) => {
    try {
      setSubmitting(true);
      setSuccess('');
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const requestBody = {
        report_status: status,
        admin_response: adminResponse
      };
      
      // Only add action if status is 'done' and action is selected
      if (status === 'done') {
        requestBody.action = selectedAction;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setReport(data.data.report || data.data);
      
      let actionText = '';
      if (status === 'done') {
        actionText = selectedAction === 'delete_frame' ? 'resolved and content deleted' : 'resolved with no action';
      } else {
        actionText = 'rejected';
      }
      
      setSuccess(`Report has been ${actionText} successfully`);
      
      // Refresh the data after action
      setTimeout(() => {
        router.push('/official-admin-snaplove/reports');
      }, 2000);
      
    } catch (err) {
      console.error(`Error updating report:`, err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-xl text-center text-red-600">Error: {error}</p>
        <div className="flex justify-center mt-4">
          <Link href="/official-admin-snaplove/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-xl text-center text-red-600">Report not found</p>
        <div className="flex justify-center mt-4">
          <Link href="/official-admin-snaplove/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href="/official-admin-snaplove/reports" className="mr-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Report Details</h1>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Information */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Report Information</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.report_status)}`}>
                {getStatusText(report.report_status)}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Report Title</div>
              <p className="text-gray-900 font-medium">{report.title || 'Untitled Report'}</p>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Report Description</div>
              <p className="text-gray-700 whitespace-pre-line">{report.description || 'No description provided'}</p>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Reported Frame</div>
              <div className="flex items-start mt-2">
                <div className="flex-shrink-0 w-24 h-24 mr-4">
                  <img 
                    src={report.frame?.images?.[0] || "https://via.placeholder.com/100"} 
                    alt="Frame" 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{report.frame?.title || 'Unknown Frame'}</h3>
                  <p className="text-sm text-gray-500">
                    Layout: {report.frame?.layout_type || 'Unknown'} | Visibility: {report.frame?.visibility || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Owner: @{report.frame?.owner?.username || 'unknown'} ({report.frame?.owner?.name || 'Unknown'})
                  </p>
                  <p className="text-sm text-gray-500">
                    Frame ID: {report.frame?.id || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            {report.report_status !== 'pending' && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Admin Response</div>
                <p className="text-gray-700 whitespace-pre-line">{report.admin_response || 'No response provided'}</p>
              </div>
            )}
          </div>
          
          {report.report_status === 'pending' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Take Action</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Response
                </label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Add your response about this report (optional)"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action to Take (if resolving)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="no_action"
                      name="action"
                      value="no_action"
                      checked={selectedAction === 'no_action'}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="no_action" className="text-sm text-gray-700">
                      No action needed - Report is invalid or content is acceptable
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="delete_frame"
                      name="action"
                      value="delete_frame"
                      checked={selectedAction === 'delete_frame'}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="delete_frame" className="text-sm text-gray-700 flex items-center">
                      <FaTrash className="mr-1 text-red-500" />
                      Delete frame - Report is valid and frame violates policies
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleActionSubmit('rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  disabled={submitting}
                >
                  <FaTimes className="mr-2" />
                  Reject Report
                </button>
                <button
                  onClick={() => handleActionSubmit('done')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  disabled={submitting}
                >
                  <FaCheck className="mr-2" />
                  {selectedAction === 'delete_frame' ? 'Resolve & Delete Frame' : 'Resolve Report'}
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <FaExclamationTriangle className="inline-block mr-1 text-yellow-500" />
                <span>
                  {selectedAction === 'delete_frame' 
                    ? 'Resolving with delete action will remove the reported frame permanently.'
                    : 'Resolving with no action means the report is handled but frame remains.'
                  }
                  {' '}Rejecting means the report is invalid and no action is needed.
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* User & Metadata */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Reporter Information</h3>
            <div className="flex items-center mb-4">
              <img 
                src={report.reporter?.image_profile || "https://via.placeholder.com/50"} 
                alt={report.reporter?.name || 'Reporter'} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-medium">{report.reporter?.name || 'Unknown Reporter'}</h4>
                <p className="text-sm text-gray-500">@{report.reporter?.username || 'unknown'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3" />
                <span>Role: <span className="font-medium">{report.reporter?.role || 'Unknown'}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaFlag className="mr-3" />
                <span>Email: <span className="font-medium">{report.reporter?.email || 'Unknown'}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3" />
                <span>Reporter ID: <span className="font-medium text-xs">{report.reporter?.id || 'Unknown'}</span></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaFlag className="mr-3" />
                <span>Report ID: <span className="font-medium text-xs">{report.id || 'N/A'}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3" />
                <span>Created: <span className="font-medium">
                  {report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown'}
                </span></span>
              </div>
              
              {report.updated_at && report.updated_at !== report.created_at && (
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-3" />
                  <span>Last Updated: <span className="font-medium">{new Date(report.updated_at).toLocaleString()}</span></span>
                </div>
              )}
              
              {report.admin && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Handled By</h4>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-center leading-8">
                        {(report.admin.name || 'U').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{report.admin.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">@{report.admin.username || 'unknown'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}