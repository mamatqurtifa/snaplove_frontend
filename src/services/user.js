import api from './api';

export const userService = {
  updateProfile: async (username, { name, imageFile }) => {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (imageFile) formData.append('image_profile', imageFile);
  const response = await api.put(`user/${username}/private/edit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getPrivateFrames: async (username) => {
  const { data } = await api.get(`user/${username}/frame/private`);
    return data;
  },
  uploadFrame: async (username, { title, description, file }) => {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('frame_file', file);
  const { data } = await api.post(`user/${username}/frame/private`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  deleteFrame: async (username, frameId) => {
  const { data } = await api.delete(`user/${username}/frame/private/${frameId}/delete`);
    return data;
  },
  updateFrame: async (username, frameId, payload) => {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.file) formData.append('frame_file', payload.file);
  const { data } = await api.put(`user/${username}/frame/private/${frameId}/edit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Photo management methods
  capturePhoto: async (username, { images, frameId, title, desc }) => {
    const formData = new FormData();
    formData.append('frame_id', frameId);
    formData.append('title', title);
    if (desc) formData.append('desc', desc);

    // Add images
    images.forEach((imageBlob, index) => {
      formData.append('images', imageBlob, `photo-${index + 1}.jpg`);
    });

    const { data } = await api.post(`user/${username}/photo/capture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  getPrivatePhotos: async (username, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const query = queryParams.toString();
    const { data } = await api.get(`user/${username}/photo/private${query ? `?${query}` : ''}`);
    return data;
  },

  getPhotoDetails: async (username, photoId) => {
    const { data } = await api.get(`user/${username}/photo/private/${photoId}`);
    return data;
  },

  updatePhoto: async (username, photoId, { title, desc }) => {
    const { data } = await api.put(`user/${username}/photo/private/${photoId}/edit`, {
      title,
      desc
    });
    return data;
  },

  deletePhoto: async (username, photoId) => {
    const { data } = await api.delete(`user/${username}/photo/private/${photoId}/delete`);
    return data;
  },

  // Social features
  getFollowers: async (username, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    const { data } = await api.get(`user/${username}/follower${query ? `?${query}` : ''}`);
    return data;
  },

  getFollowing: async (username, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    const { data } = await api.get(`user/${username}/following${query ? `?${query}` : ''}`);
    return data;
  },

  followUser: async (username, targetUsername) => {
    const { data } = await api.post(`user/${username}/following`, {
      following_username: targetUsername
    });
    return data;
  },

  unfollowUser: async (username, followingId) => {
    const { data } = await api.delete(`user/${username}/following/${followingId}`);
    return data;
  },

  checkFollowStatus: async (username, targetUsername) => {
    const { data } = await api.get(`user/${username}/following/check/${targetUsername}`);
    return data;
  },

  removeFollower: async (username, followerId) => {
    const { data } = await api.delete(`user/${username}/follower/${followerId}`);
    return data;
  }
};
