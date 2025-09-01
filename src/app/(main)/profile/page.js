"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FiSettings, FiUser, FiMail, FiCalendar, FiImage, FiX, FiSave, FiEdit3 } from 'react-icons/fi';
import api from '@/services/api';
import RoleBadge from '@/components/ui/RoleBadge';

export default function Profile() {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    birthdate: ''
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.username) return;
      
      setStatsLoading(true);
      try {
        const response = await api.get(`/user/${user.username}/stats`);
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (user?.username) {
      fetchUserStats();
    }
  }, [user?.username]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9898]"></div>
      </div>
    );
  }

  const openEdit = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      birthdate: user?.birthdate ? user.birthdate.split('T')[0] : ''
    });
    setPreview(user?.image_profile || null);
    setFile(null);
    setShowEdit(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      // Validate file size (5MB max)
      if (f.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 5MB.');
        return;
      }
      
      // Validate file type
      if (!f.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        return;
      }
      
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const saveProfile = async () => {
    if (!user?.username) return;
    
    setSaving(true);
    try {
      let response;
      
      // Check if there's an image file to upload
      if (file) {
        // For image upload, use FormData
        const formDataToSend = new FormData();
        
        // Only add non-empty fields
        if (formData.name.trim()) {
          formDataToSend.append('name', formData.name.trim());
        }
        if (formData.bio.trim()) {
          formDataToSend.append('bio', formData.bio.trim());
        }
        if (formData.birthdate) {
          formDataToSend.append('birthdate', formData.birthdate);
        }
        
        // Add image file
        formDataToSend.append('image_profile', file);

        response = await api.put(`/user/${user.username}/edit`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // For text-only updates, use JSON
        const updateData = {};
        
        // Only include fields that have values
        if (formData.name.trim()) {
          updateData.name = formData.name.trim();
        }
        if (formData.bio.trim()) {
          updateData.bio = formData.bio.trim();
        }
        if (formData.birthdate) {
          updateData.birthdate = formData.birthdate;
        }

        // If no data to update
        if (Object.keys(updateData).length === 0) {
          alert('Tidak ada perubahan untuk disimpan.');
          setSaving(false);
          return;
        }

        response = await api.put(`/user/${user.username}/edit`, updateData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.data.success) {
        // Show success message if there are changes
        if (response.data.data?.changes && response.data.data.changes.length > 0) {
          alert(`Profile berhasil diperbarui! ${response.data.data.changes.join(', ')}`);
        } else {
          alert('Profile berhasil diperbarui!');
        }
        
        // Refresh user data from context
        if (refreshUser) {
          await refreshUser();
        } else {
          // Fallback: reload page
          window.location.reload();
        }
        
        setShowEdit(false);
        setFile(null);
        setPreview(null);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Gagal menyimpan profil';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Data tidak valid';
      } else if (error.response?.status === 404) {
        errorMessage = 'User tidak ditemukan';
      } else if (error.response?.status === 413) {
        errorMessage = 'File terlalu besar';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error, coba lagi nanti';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getRoleLimits = (role) => {
    const normalizedRole = role?.toLowerCase() || '';
    
    if (normalizedRole.includes('verified_premium') || normalizedRole.includes('premium')) {
      return { frames: 'Unlimited', duration: 'Unlimited' };
    }
    if (normalizedRole.includes('verified')) {
      return { frames: '20', duration: '7 days' };
    }
    if (normalizedRole.includes('official') || normalizedRole.includes('developer')) {
      return { frames: 'Unlimited', duration: 'Unlimited' };
    }
    return { frames: '3', duration: '3 days' }; // basic
  };

  return (
    <div className="container mx-auto pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-[#FFE99A] to-[#FF9898]">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <Image 
                  src={user?.image_profile || "/images/assets/placeholder-user.png"} 
                  alt={user?.name || "User"}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                  <RoleBadge role={user?.role} />
                </div>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={openEdit} 
                  className="px-5 py-2 bg-[#FF9898] hover:bg-[#FF7070] text-white rounded-full transition-colors shadow-sm flex items-center gap-2"
                >
                  <FiEdit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            </div>
            
            {user?.bio ? (
              <p className="mt-6 text-gray-700 leading-relaxed">{user.bio}</p>
            ) : (
              <p className="mt-6 text-gray-500 italic">No bio available</p>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiUser className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Following</p>
                  <p className="font-medium">{userStats?.following_count || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiUser className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-medium">{userStats?.followers_count || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiCalendar className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Total Score</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {statsLoading ? '...' : (userStats?.total_score || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Combined ranking score</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Frames</h3>
            <p className="text-3xl font-bold mt-2 text-[#FF9898]">
              {statsLoading ? '...' : (userStats?.frame_count || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total frames created</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Likes</h3>
            <p className="text-3xl font-bold mt-2 text-pink-600">
              {statsLoading ? '...' : (userStats?.total_likes || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total likes received</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Uses</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {statsLoading ? '...' : (userStats?.total_uses || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total frame uses</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowEdit(false)} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FiX className="h-5 w-5"/>
            </button>
            
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#FFE99A] shadow-lg">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <FiImage className="h-8 w-8" />
                    <span className="text-xs mt-1">No Image</span>
                  </div>
                )}
              </div>
              <label className="mt-4 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2 transition">
                <FiImage className="h-4 w-4"/> Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFile} 
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG only</p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input 
                  type="text"
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent transition"
                  placeholder="Your display name"
                  maxLength={50}
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea 
                  value={formData.bio} 
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent transition resize-none"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/200 characters
                </p>
              </div>

              {/* Birthdate Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthdate (Optional)
                </label>
                <input 
                  type="date"
                  value={formData.birthdate} 
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent transition"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button 
                disabled={saving} 
                onClick={() => setShowEdit(false)} 
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={saving || !formData.name.trim()} 
                onClick={saveProfile} 
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF9898] to-[#FFE99A] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60 transition"
              >
                <FiSave className="h-4 w-4"/> 
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}