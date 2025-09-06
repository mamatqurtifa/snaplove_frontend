'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ticketService } from '@/services/ticket';
import { FaSearch, FaEye, FaClock, FaExclamationTriangle, FaCheck, FaTimes, FaPlus, FaTicketAlt, FaLightbulb, FaCommentAlt, FaEllipsisH } from 'react-icons/fa';

export default function TicketsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
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
  const [type, setType] = useState('');
  
  const fetchTickets = async (page = 1) => {
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
      if (type) params.type = type;
      
      const response = await ticketService.getUserTickets(user.username, params);
      
      if (!response.success) {
        throw new Error('Failed to fetch tickets');
      }
      
      setTickets(response.data.tickets || []);
      setPagination(response.data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 20,
        has_next_page: false,
        has_prev_page: false
      });
      
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.username) {
      fetchTickets(1);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchTickets(1);
  }, [status, type]);
  
  const handleViewTicket = (id) => {
    router.push(`/tickets/${id}`);
  };

  const handleCreateTicket = () => {
    router.push('/tickets/create');
  };
  
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
      case 'pending': return <FaClock className="w-3 h-3" />;
      case 'in_progress': return <FaEllipsisH className="w-3 h-3" />;
      case 'resolved': return <FaCheck className="w-3 h-3" />;
      case 'closed': return <FaTimes className="w-3 h-3" />;
      default: return <FaExclamationTriangle className="w-3 h-3" />;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'suggestion': return <FaLightbulb className="w-4 h-4" />;
      case 'critics': return <FaCommentAlt className="w-4 h-4" />;
      case 'other': return <FaTicketAlt className="w-4 h-4" />;
      default: return <FaTicketAlt className="w-4 h-4" />;
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
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority || 'Unknown';
    }
  };

  const getStatusDescription = (status) => {
    switch(status) {
      case 'pending': return 'Your ticket is waiting to be reviewed by our support team';
      case 'in_progress': return 'Our team is currently working on your ticket';
      case 'resolved': return 'Your ticket has been resolved';
      case 'closed': return 'This ticket has been closed';
      default: return 'Status unknown';
    }
  };

  // Helper function to get ticket ID safely
  const getTicketId = (ticket) => {
    const id = ticket?.id;
    if (!id) return 'N/A';
    return typeof id === 'string' && id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center text-red-600">Please log in to view your tickets</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
            <p className="text-gray-600">Submit and track your support requests</p>
          </div>
          <button
            onClick={handleCreateTicket}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="critics">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Total tickets: {pagination.total_items}
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
        
        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(ticket?.type)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ticket?.title || 'Untitled Ticket'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket?.status)}`}>
                            {getStatusIcon(ticket?.status)}
                            {getStatusText(ticket?.status)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(ticket?.type)}`}>
                            {getTypeText(ticket?.type)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket?.priority)}`}>
                            {getPriorityText(ticket?.priority)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {ticket?.description || 'No description provided'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getStatusDescription(ticket?.status)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Admin Response Preview */}
                  {ticket?.status === 'resolved' && ticket?.admin_response && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <FaCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">Response:</p>
                          <p className="text-sm text-green-700 line-clamp-2">{ticket.admin_response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Images Preview */}
                  {ticket?.images && ticket.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Attachments:</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {ticket.images.length} file{ticket.images.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {ticket.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Attachment ${index + 1}`}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        ))}
                        {ticket.images.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{ticket.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {ticket?.created_at ? new Date(ticket.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown Date'}
                      </span>
                      {ticket?.updated_at && ticket?.updated_at !== ticket?.created_at && (
                        <span className="flex items-center gap-1">
                          Updated: {new Date(ticket.updated_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                      <span>ID: {getTicketId(ticket)}</span>
                    </div>
                    <button 
                      onClick={() => handleViewTicket(ticket?.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      disabled={!ticket?.id}
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
              <FaTicketAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500 mb-6">
                {status || type 
                  ? 'No tickets found matching your filters' 
                  : 'You haven\'t created any support tickets yet'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                {(status || type) && (
                  <button 
                    onClick={() => {
                      setStatus('');
                      setType('');
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  onClick={handleCreateTicket}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Your First Ticket
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && tickets.length > 0 && pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} tickets
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => fetchTickets(pagination.current_page - 1)}
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
                onClick={() => fetchTickets(pagination.current_page + 1)}
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