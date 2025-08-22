"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSuccess = (userData) => {
    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#FFF5F5] px-4 py-12">
      <Link href="/" className="absolute top-20 left-6 text-gray-600 hover:text-[#FF9898] flex items-center gap-1 group">
        <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali</span>
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/assets/Logo/snaplove-logo-black.png" 
              alt="SnapLove Logo" 
              width={180} 
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar di SnapLove</h1>
          <p className="mt-2 text-gray-600">
            Daftar akun untuk mulai berbagi momen berharga
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <GoogleAuthButton
            onSuccess={handleRegisterSuccess}
            buttonText="Daftar dengan Google"
            isRegister={true}
            className="mt-2"
          />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 flex-grow"></div>
            <span className="mx-4 text-sm text-gray-500">atau</span>
            <div className="border-t border-gray-200 flex-grow"></div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Aplikasi ini hanya mendukung pendaftaran dengan Google.
              <br />Pastikan Anda memiliki akun Google.
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-[#FF9898] font-semibold hover:text-[#FF7070]">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}