'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/report';
import { FaArrowLeft, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaUser, FaImage, FaFlag, FaShieldAlt } from 'react-icons/fa';

export default function UserReportDetailPage({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!user?.username) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      if (!id) {
        setError('Report ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await reportService.getReportDetails(user.username, id);
        
        if (!response.success) {
          throw new Error('Failed to fetch report details');
        }
        
        setReport(response.data.report);
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.username && id) {
      fetchReportDetails();
    }
  }, [user?.username, id]);
  
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
      case 'pending': return <FaClock className="w-5 h-5" />;
      case 'done': return <FaCheck className="w-5 h-5" />;
      case 'rejected': return <FaTimes className="w-5 h-5" />;
      default: return <FaExclamationTriangle className="w-5 h-5" />;
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
      case 'done': return 'Your report has been reviewed and appropriate action has been taken by our moderation team.';
      case 'pending': return 'Our moderation team is currently reviewing your report. We\'ll update you once it\'s been processed.';
      case 'rejected': return 'After review, our moderation team determined that no action was needed for this report.';
      default: return 'Status unknown';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center text-red-600">Please log in to view your reports</p>
          <div className="flex justify-center mt-4">
            <Link href="/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-red-200">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h2 className="text-xl font-semibold text-red-600">Error Loading Report</h2>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-center">
              <Link href="/reports" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Back to Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl text-center text-red-600">Report not found</p>
            <div className="flex justify-center mt-4">
              <Link href="/reports" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Back to Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link href="/reports" className="mr-4 text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
            <p className="text-gray-600 mt-1">View the status and details of your report</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${getStatusColor(report.report_status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    {getStatusIcon(report.report_status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getStatusText(report.report_status)}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {getStatusDescription(report.report_status)}
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(report.report_status)}`}>
                    {getStatusIcon(report.report_status)}
                    {getStatusText(report.report_status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Report Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Report</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                    <p className="text-gray-900">{report.title || 'Untitled Report'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-700 whitespace-pre-line">{report.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reported Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaImage className="w-5 h-5 text-gray-600" />
                  Reported Frame
                </h3>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <img 
                      src={report.frame?.images?.[0] || "https://via.placeholder.com/80"} 
                      alt="Frame" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {report.frame?.title || 'Unknown Frame'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Layout: <span className="font-medium">{report.frame?.layout_type || 'Unknown'}</span></p>
                      <p>Created by: <span className="font-medium">@{report.frame?.owner?.username || 'unknown'}</span> 
                        ({report.frame?.owner?.name || 'Unknown'})</p>
                      <p className="text-xs text-gray-500">Frame ID: {report.frame?.id || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Admin Response */}
            {report.report_status !== 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="w-5 h-5 text-blue-600" />
                    Moderation Response
                  </h3>
                  
                  {report.admin_response ? (
                    <div className={`p-4 rounded-lg border ${
                      report.report_status === 'done' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <p className="text-gray-700">{report.admin_response}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-600 italic">No specific response provided by the moderation team.</p>
                    </div>
                  )}
                  
                  {report.admin && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Handled by: <span className="font-medium">{report.admin.name || 'Moderation Team'}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaClock className="w-5 h-5 text-gray-600" />
                  Timeline
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Report Submitted</p>
                      <p className="text-xs text-gray-600">
                        {report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown Date'}
                      </p>
                    </div>
                  </div>
                  
                  {report.updated_at && report.updated_at !== report.created_at && (
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        report.report_status === 'done' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {report.report_status === 'done' ? 'Report Resolved' : 'Report Updated'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(report.updated_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Metadata */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFlag className="w-5 h-5 text-gray-600" />
                  Report Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Report ID:</span>
                    <span className="text-sm font-mono text-gray-900 break-all">
                      {report.id || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.report_status)}`}>
                      {getStatusIcon(report.report_status)}
                      {getStatusText(report.report_status)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <span className="text-sm text-gray-900">
                      {report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </span>
                  </div>
                  
                  {report.updated_at && report.updated_at !== report.created_at && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(report.updated_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Help Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5" />
                Need Help?
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Pending:</strong> Your report is being reviewed by our moderation team.</p>
                <p><strong>Resolved:</strong> Action has been taken based on your report.</p>
                <p><strong>Rejected:</strong> No action was needed after review.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  If you have questions about this report, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/reports" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to All Reports
          </Link>
        </div>
      </div>
    </div>
  );
}