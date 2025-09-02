// /src/services/notificationService.js
import api from '@/services/api';

class NotificationService {
  
  // Get user notifications with pagination and filters
  async getNotifications(username, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Default values
      const { 
        page = 1, 
        limit = 20, 
        type = null, 
        unread_only = false 
      } = params;
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (type) {
        queryParams.append('type', type);
      }
      
      if (unread_only) {
        queryParams.append('unread_only', 'true');
      }
      
      const response = await api.get(`/user/${username}/notification/private?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
  
  // Mark specific notification as read
  async markAsRead(username, notificationId) {
    try {
      const response = await api.put(`/user/${username}/notification/private/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
  
  // Mark all notifications as read
  async markAllAsRead(username) {
    try {
      const response = await api.put(`/user/${username}/notification/private/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  
  // Get unread notification count
  async getUnreadCount(username) {
    try {
      const response = await api.get(`/user/${username}/notification/private/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
  
  // Delete notification (if API supports it)
  async deleteNotification(username, notificationId) {
    try {
      const response = await api.delete(`/user/${username}/notification/private/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();