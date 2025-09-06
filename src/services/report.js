const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ReportService {
  async submitReport(username, reportData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/user/${username}/report/private`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserReports(username, params = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/user/${username}/report/private?${queryParams.toString()}`, {
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

  async getReportDetails(username, reportId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/user/${username}/report/private/${reportId}`, {
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
}

export const reportService = new ReportService();