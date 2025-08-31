import api from './api';

export const profileService = {
  // Get user public profile
  getUserProfile: async (username) => {
    try {
      const response = await api.get(`user/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user stats
  getUserStats: async (username) => {
    try {
      const response = await api.get(`user/${username}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user followers
  getUserFollowers: async (username, params = {}) => {
    try {
      const response = await api.get(`user/${username}/follower`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user following
  getUserFollowing: async (username, params = {}) => {
    try {
      const response = await api.get(`user/${username}/following`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user photos
  getUserPhotos: async (username) => {
    try {
      const response = await api.get(`user/${username}/photo`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user liked photos
  getUserLikedPhotos: async (username) => {
    try {
      const response = await api.get(`user/${username}/liked`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};