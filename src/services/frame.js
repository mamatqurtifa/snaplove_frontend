import api from './api';

export const frameService = {
  getPublicFrames: async () => {
  const { data } = await api.get('/api/frame/public');
    return data;
  },
  getPublicFrameById: async (id) => {
  const { data } = await api.get(`/api/frame/public/${id}`);
    return data;
  },
  likePublicFrame: async (id) => {
  const { data } = await api.post(`/api/frame/public/${id}/like`);
    return data;
  }
};
