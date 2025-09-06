const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class TicketService {
  async getUserTickets(username, params = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/user/${username}/ticket/private?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getTicketDetails(username, ticketId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/user/${username}/ticket/private/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async createTicket(username, ticketData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create FormData for file upload support
    const formData = new FormData();
    formData.append('title', ticketData.title);
    formData.append('description', ticketData.description);
    formData.append('type', ticketData.type);

    // Add images if provided
    if (ticketData.images && ticketData.images.length > 0) {
      ticketData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/user/${username}/ticket/private`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, browser will set it automatically
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

export const ticketService = new TicketService();