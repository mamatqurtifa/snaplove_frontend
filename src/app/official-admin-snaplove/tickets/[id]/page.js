'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaClock, FaTag, FaExclamationCircle, FaEnvelope } from 'react-icons/fa';

export default function TicketDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ticket/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }
        
        const data = await response.json();
        setTicket(data.data.ticket);
        setStatus(data.data.ticket.status);
        setPriority(data.data.ticket.priority);
        setAdminResponse(data.data.ticket.admin_response || '');
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setError('Failed to load ticket details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketDetails();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const updateData = {
        status,
        priority,
        admin_response: adminResponse
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ticket/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update ticket');
      }
      
      setSuccess('Ticket updated successfully!');
      setTicket(data.data.ticket);
      
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error.message || 'Failed to update ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
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
  
  if (!ticket) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-xl text-center text-red-600">Ticket not found</p>
        <div className="flex justify-center mt-4">
          <Link href="/official-admin-snaplove/tickets" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href="/official-admin-snaplove/tickets" className="mr-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Ticket Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Information */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {success}
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{ticket.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold capitalize">
                  {ticket.type}
                </span>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
              </div>
            </div>
            
            {/* Ticket Images */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Attached Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ticket.images.map((image, index) => (
                    <a 
                      key={index}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img 
                        src={image} 
                        alt={`Attachment ${index + 1}`} 
                        className="rounded-lg border border-gray-200 object-cover w-full h-40"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Admin Response Form */}
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold mb-4">Admin Response</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response</label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={6}
                  maxLength={2000}
                  placeholder="Enter your response to the user's ticket"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{adminResponse.length}/2000 characters</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Update Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* User & Ticket Details Sidebar */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="flex items-center mb-4">
              <img 
                src={ticket.user.image_profile || "https://via.placeholder.com/50"} 
                alt={ticket.user.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-medium">{ticket.user.name}</h4>
                <p className="text-sm text-gray-500">@{ticket.user.username}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3" />
                <span>Role: <span className="font-medium">{ticket.user.role.replace('_', ' ')}</span></span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-3" />
                <span>Email: <span className="font-medium">{ticket.user.email}</span></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaTag className="mr-3" />
                <span>ID: <span className="font-medium">{ticket.id}</span></span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3" />
                <span>Created: <span className="font-medium">{new Date(ticket.created_at).toLocaleString()}</span></span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3" />
                <span>Last Updated: <span className="font-medium">{new Date(ticket.updated_at).toLocaleString()}</span></span>
              </div>
              
              {ticket.admin && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Assigned Admin</h4>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-center leading-8">
                        {ticket.admin.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{ticket.admin.name}</div>
                      <div className="text-sm text-gray-500">@{ticket.admin.username}</div>
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