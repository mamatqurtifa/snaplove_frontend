'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaTicketAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to users page by default
    router.push('/official-admin-snaplove/users');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}