import { useState, useEffect } from 'react';

const CorsImage = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Try to load the image directly first
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setLoading(false);
        };
        img.onerror = async () => {
          // If direct load fails, try fetching as blob and converting to data URL
          try {
            const response = await fetch(src, {
              mode: 'cors',
              credentials: 'omit'
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const blob = await response.blob();
            const dataUrl = URL.createObjectURL(blob);
            setImageSrc(dataUrl);
          } catch (fetchError) {
            console.warn('Failed to load image with CORS workaround:', src, fetchError);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
        img.src = src;
      } catch (err) {
        console.warn('Image load error:', src, err);
        setError(true);
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center text-gray-400 ${className}`}>
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
        <div className="w-full h-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} {...props} />;
};

export default CorsImage;
