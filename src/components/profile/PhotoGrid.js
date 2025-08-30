'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PhotoGrid({ photos, emptyMessage }) {
  const router = useRouter();
  
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        {emptyMessage || 'No photos to display'}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
          onClick={() => router.push(`/photo/${photo.id}`)}
        >
          <Image
            src={photo.url}
            alt={photo.caption || 'Photo'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}