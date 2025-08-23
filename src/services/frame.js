import api from './api';

export const frameService = {
  getPublicFrames: async () => {
  const { data } = await api.get('/frame/public');
    return data;
  },
  getPublicFrameById: async (id) => {
  const { data } = await api.get(`/frame/public/${id}`);
    return data;
  },
  likePublicFrame: async (id) => {
  const { data } = await api.post(`/frame/public/${id}/like`);
    return data;
  }
};
