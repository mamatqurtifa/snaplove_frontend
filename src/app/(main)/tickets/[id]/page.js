'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ticketService } from '@/services/ticket';
import { FaArrowLeft, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaUser, FaImage, FaTicketAlt, FaShieldAlt, FaLightbulb, FaCommentAlt, FaEllipsisH, FaDownload } from 'react-icons/fa';

export default function TicketDetailPage({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!user?.username) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      if (!id) {
        setError('Ticket ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketService.getTicketDetails(user.username, id);
        
        if (!response.success) {
          throw new Error('Failed to fetch ticket details');
        }
        
        setTicket(response.data.ticket);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.username && id) {
      fetchTicketDetails();
    }
  }, [user?.username, id]);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'suggestion': return 'bg-green-100 text-green-800 border-green-200';
      case 'critics': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'other': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="w-5 h-5" />;
      case 'in_progress': return <FaEllipsisH className="w-5 h-5" />;
      case 'resolved': return <FaCheck className="w-5 h-5" />;
      case 'closed': return <FaTimes className="w-5 h-5" />;
      default: return <FaExclamationTriangle className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'suggestion': return <FaLightbulb className="w-5 h-5" />;
      case 'critics': return <FaCommentAlt className="w-5 h-5" />;
      case 'other': return <FaTicketAlt className="w-5 h-5" />;
      default: return <FaTicketAlt className="w-5 h-5" />;
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status || 'Unknown';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'suggestion': return 'Suggestion';
      case 'critics': return 'Feedback';
      case 'other': return 'Other';
      default: return type || 'Unknown';
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return priority || 'Unknown Priority';
    }
  };

  const getStatusDescription = (status) => {
    switch(status) {
      case 'pending': return 'Your ticket is waiting to be reviewed by our support team.';
      case 'in_progress': return 'Our support team is actively working on your ticket and will provide updates soon.';
      case 'resolved': return 'Your ticket has been resolved by our support team.';
      case 'closed': return 'This ticket has been closed and is no longer active.';
      default: return 'Status unknown';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center text-red-600">Please log in to view your tickets</p>
          <div className="flex justify-center mt-4">
            <Link href="/tickets" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Tickets
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
              <h2 className="text-xl font-semibold text-red-600">Error Loading Ticket</h2>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-center">
              <Link href="/tickets" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Back to Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl text-center text-red-600">Ticket not found</p>
            <div className="flex justify-center mt-4">
              <Link href="/tickets" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Back to Tickets
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
          <Link href="/tickets" className="mr-4 text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
            <p className="text-gray-600 mt-1">View your support ticket status and response</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${getStatusColor(ticket.status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getStatusText(ticket.status)}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {getStatusDescription(ticket.status)}
                    </p>
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {getStatusText(ticket.status)}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(ticket.type)}`}>
                    {getTypeIcon(ticket.type)}
                    {getTypeText(ticket.type)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Ticket</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{ticket.title || 'Untitled Ticket'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-700 whitespace-pre-line">{ticket.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {ticket?.images && ticket.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaImage className="w-5 h-5 text-gray-600" />
                    Attachments ({ticket.images.length})
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ticket.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <FaDownload className="w-4 h-4 text-gray-600" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Admin Response */}
            {ticket.status !== 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="w-5 h-5 text-blue-600" />
                    Support Team Response
                  </h3>
                  
                  {ticket.admin_response ? (
                    <div className={`p-4 rounded-lg border ${
                      ticket.status === 'resolved' 
                        ? 'bg-green-50 border-green-200' 
                        : ticket.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className="text-gray-700 whitespace-pre-line">{ticket.admin_response}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-600 italic">
                        {ticket.status === 'in_progress' 
                          ? 'Our team is working on your ticket and will provide a response soon.'
                          : 'No response provided yet.'
                        }
                      </p>
                    </div>
                  )}
                  
                  {ticket.admin && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Handled by: <span className="font-medium">{ticket.admin.name || 'Support Team'}</span>
                        {ticket.admin.role && (
                          <span className="text-gray-400"> ({ticket.admin.role})</span>
                        )}
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
                      <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                      <p className="text-xs text-gray-600">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown Date'}
                      </p>
                    </div>
                  </div>
                  
                  {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        ticket.status === 'resolved' ? 'bg-green-500' : 
                        ticket.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.status === 'resolved' ? 'Ticket Resolved' : 
                           ticket.status === 'in_progress' ? 'In Progress' : 'Status Updated'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(ticket.updated_at).toLocaleDateString('id-ID', {
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

            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaTicketAlt className="w-5 h-5 text-gray-600" />
                  Ticket Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ticket ID:</span>
                    <span className="text-sm font-mono text-gray-900 break-all">
                      {ticket.id || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(ticket.type)}`}>
                      {getTypeIcon(ticket.type)}
                      {getTypeText(ticket.type)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </span>
                  </div>
                  
                  {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(ticket.updated_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {ticket.images && ticket.images.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Attachments:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.images.length} file{ticket.images.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Information */}
            {ticket.user && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-gray-600" />
                    Your Information
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <img
                      src={ticket.user.image_profile || "https://via.placeholder.com/48"}
                      alt={ticket.user.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{ticket.user.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">@{ticket.user.username || 'unknown'}</p>
                      {ticket.user.role && (
                        <p className="text-xs text-gray-400 capitalize">{ticket.user.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5" />
                Need Help?
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Pending:</strong> Your ticket is waiting for review.</p>
                <p><strong>In Progress:</strong> Our team is actively working on it.</p>
                <p><strong>Resolved:</strong> Your issue has been addressed.</p>
                <p><strong>Closed:</strong> The ticket is complete and closed.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  If you have questions about this ticket, you can create a new ticket referencing this ID.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/tickets" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to All Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}