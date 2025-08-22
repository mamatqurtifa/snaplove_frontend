'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaFilter, FaSort, FaEdit, FaEye } from 'react-icons/fa';

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    high: 0,
    suggestions: 0,
    critics: 0,
    other: 0
  });
  const [loading, setLoading] = useState(true);
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
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('newest');
  
  const fetchTickets = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 20);
      
      if (search) params.append('search', search);
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (sort) params.append('sort', sort);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ticket?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      setTickets(data.data.tickets);
      setPagination(data.data.pagination);
      setStatistics(data.data.statistics);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTickets(1);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets(1);
  };
  
  const handleViewTicket = (id) => {
    router.push(`/official-admin-snaplove/tickets/${id}`);
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
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Ticket Management</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Tickets</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Pending</h2>
          <p className="text-3xl font-bold text-yellow-600">{statistics.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">In Progress</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.in_progress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Resolved</h2>
          <p className="text-3xl font-bold text-green-600">{statistics.resolved}</p>
        </div>
      </div>
      
      {/* Priority and Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Priority Distribution</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="inline-block w-4 h-4 rounded-full bg-red-500 mr-1"></div>
              <div className="text-lg font-semibold">{statistics.urgent}</div>
              <div className="text-sm text-gray-500">Urgent</div>
            </div>
            <div className="text-center">
              <div className="inline-block w-4 h-4 rounded-full bg-orange-500 mr-1"></div>
              <div className="text-lg font-semibold">{statistics.high}</div>
              <div className="text-sm text-gray-500">High</div>
            </div>
            <div className="text-center">
              <div className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-1"></div>
              <div className="text-lg font-semibold">{statistics.medium || 0}</div>
              <div className="text-sm text-gray-500">Medium</div>
            </div>
            <div className="text-center">
              <div className="inline-block w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <div className="text-lg font-semibold">{statistics.low || 0}</div>
              <div className="text-sm text-gray-500">Low</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Type Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{statistics.suggestions}</div>
              <div className="text-sm text-gray-500">Suggestions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{statistics.critics}</div>
              <div className="text-sm text-gray-500">Critics</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{statistics.other}</div>
              <div className="text-sm text-gray-500">Other</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or description"
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
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="suggestion">Suggestion</option>
              <option value="critics">Critics</option>
              <option value="other">Other</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select 
              className="p-2 border rounded-lg"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority_high">Priority (High to Low)</option>
              <option value="priority_low">Priority (Low to High)</option>
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
      
      {/* Tickets Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img 
                            className="h-8 w-8 rounded-full object-cover" 
                            src={ticket.user.image_profile || "https://via.placeholder.com/32"} 
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{ticket.user.name}</div>
                          <div className="text-xs text-gray-500">@{ticket.user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {ticket.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewTicket(ticket.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && tickets.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} tickets
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => fetchTickets(pagination.current_page - 1)}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 border rounded-md ${!pagination.has_prev_page ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Previous
              </button>
              <button 
                onClick={() => fetchTickets(pagination.current_page + 1)}
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