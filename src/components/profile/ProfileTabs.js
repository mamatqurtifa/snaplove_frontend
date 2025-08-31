'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import PhotoGrid from './PhotoGrid';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProfileTabs({ username }) {
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTabContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (activeTab === 'photos') {
          const response = await api.get(`/user/${username}/photo`);
          if (response.data.success) {
            setPhotos(response.data.data.photos || []);
          } else {
            setError(response.data.message || 'Failed to load photos');
          }
        } else if (activeTab === 'liked') {
          const response = await api.get(`/user/${username}/liked`);
          if (response.data.success) {
            setLiked(response.data.data.photos || []);
          } else {
            setError(response.data.message || 'Failed to load liked photos');
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        if (error.response && error.response.status === 401) {
          setError('Authentication required to view this content');
        } else {
          setError(`Error loading ${activeTab}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchTabContent();
    }
  }, [username, activeTab]);

  const tabs = [
    { id: 'photos', label: 'Photos' },
    { id: 'liked', label: 'Liked' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">
            {error}
          </div>
        ) : (
          <>
            {activeTab === 'photos' && (
              <PhotoGrid photos={photos} emptyMessage="No photos uploaded yet" />
            )}
            {activeTab === 'liked' && (
              <PhotoGrid photos={liked} emptyMessage="No liked photos" />
            )}
          </>
        )}
      </div>
    </div>
  );
}