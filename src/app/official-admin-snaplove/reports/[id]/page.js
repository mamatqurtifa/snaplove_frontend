'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaUser, FaImage, FaClock, FaFlag } from 'react-icons/fa';

export default function ReportDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [success, setSuccess] = useState('');
  
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
        setReport(data.data.report);
        setAdminNote(data.data.report.admin_note || '');
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportDetails();
  }, [id]);
  
  const handleActionSubmit = async (action) => {
    try {
      setSubmitting(true);
      setSuccess('');
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action,
          admin_note: adminNote
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setReport(data.data.report);
      setSuccess(`Report has been ${action === 'resolved' ? 'resolved' : 'rejected'} successfully`);
      
      // Refresh the data after action
      setTimeout(() => {
        router.push('/official-admin-snaplove/reports');
      }, 2000);
      
    } catch (err) {
      console.error(`Error ${action} report:`, err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Information */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Report Information</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Report Type</div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                {report.type.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Report Reason</div>
              <p className="text-gray-700 whitespace-pre-line">{report.reason}</p>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Reported Content</div>
              <div className="flex items-start mt-2">
                <div className="flex-shrink-0 w-24 h-24 mr-4">
                  <img 
                    src={report.content_thumbnail || "https://via.placeholder.com/100"} 
                    alt="Content" 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{report.content_title}</h3>
                  <p className="text-sm text-gray-500">
                    {report.content_type} by @{report.content_owner}
                  </p>
                  <a 
                    href={report.content_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Content
                  </a>
                </div>
              </div>
            </div>
            
            {report.status !== 'pending' && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Admin Note</div>
                <p className="text-gray-700 whitespace-pre-line">{report.admin_note || 'No notes provided'}</p>
              </div>
            )}
          </div>
          
          {report.status === 'pending' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Take Action</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Add notes about your decision (optional)"
                ></textarea>
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
                  onClick={() => handleActionSubmit('resolved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  disabled={submitting}
                >
                  <FaCheck className="mr-2" />
                  Resolve Report
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <FaExclamationTriangle className="inline-block mr-1 text-yellow-500" />
                <span>
                  Resolving the report will flag the content for review and potential removal. 
                  Rejecting means no action will be taken on the reported content.
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
                src={report.reporter_image || "https://via.placeholder.com/50"} 
                alt={report.reporter_name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-medium">{report.reporter_name}</h4>
                <p className="text-sm text-gray-500">@{report.reporter_username}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3" />
                <span>Role: <span className="font-medium">{report.reporter_role}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaFlag className="mr-3" />
                <span>Previous Reports: <span className="font-medium">{report.reporter_report_count}</span></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaFlag className="mr-3" />
                <span>Report ID: <span className="font-medium">{report.id}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3" />
                <span>Created: <span className="font-medium">{new Date(report.created_at).toLocaleString()}</span></span>
              </div>
              
              {report.updated_at && (
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-3" />
                  <span>Last Updated: <span className="font-medium">{new Date(report.updated_at).toLocaleString()}</span></span>
                </div>
              )}
              
              {report.handled_by && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Handled By</h4>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-center leading-8">
                        {report.handled_by_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{report.handled_by_name}</div>
                      <div className="text-sm text-gray-500">@{report.handled_by}</div>
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