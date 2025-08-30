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
  }
};
