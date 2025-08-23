"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FiSettings, FiUser, FiMail, FiCalendar, FiImage, FiX, FiSave } from 'react-icons/fi';
import { userService } from '@/services/user';

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9898]"></div>
      </div>
    );
  }

  const openEdit = () => {
    setDisplayName(user?.name || '');
    setPreview(user?.image_profile || null);
    setFile(null);
    setShowEdit(true);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await userService.updateProfile(user.username, { name: displayName, imageFile: file });
      // Force refresh by reloading page or calling /auth/me again
      window.location.reload();
    } catch (e) {
      alert(e?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
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
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
              <FiSettings className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button onClick={openEdit} className="px-5 py-2 bg-[#FF9898] hover:bg-[#FF7070] text-white rounded-full transition-colors shadow-sm">
                  Edit Profile
                </button>
              </div>
            </div>
            
            {user?.bio && (
              <p className="mt-6 text-gray-700">{user.bio}</p>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiUser className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiMail className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#FFE99A]/20 rounded-full">
                  <FiCalendar className="h-5 w-5 text-[#FF9898]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bergabung</p>
                  <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Frame</h3>
            <p className="text-3xl font-bold mt-2 text-[#FF9898]">0</p>
            <p className="text-sm text-gray-500 mt-1">Total frame yang dibuat</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Postingan</h3>
            <p className="text-3xl font-bold mt-2 text-[#FF9898]">0</p>
            <p className="text-sm text-gray-500 mt-1">Total postingan yang dibuat</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Likes</h3>
            <p className="text-3xl font-bold mt-2 text-[#FF9898]">0</p>
            <p className="text-sm text-gray-500 mt-1">Total likes yang diterima</p>
          </div>
        </div>
      </div>
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button onClick={() => setShowEdit(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FiX className="h-5 w-5"/></button>
            <h2 className="text-xl font-semibold mb-4">Edit Profil</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#FFE99A] shadow">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <FiImage className="h-8 w-8" />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>
              <label className="mt-4 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiImage className="h-4 w-4"/> Ganti Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full rounded-lg border-gray-300 focus:ring-[#FF9898] focus:border-[#FF9898]" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button disabled={saving} onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Batal</button>
              <button disabled={saving} onClick={saveProfile} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF9898] to-[#FFE99A] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                <FiSave className="h-4 w-4"/> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}