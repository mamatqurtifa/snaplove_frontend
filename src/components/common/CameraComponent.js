"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const CameraComponent = forwardRef(({ 
  onCameraReady, 
  onPermissionDenied, 
  aspectRatio = 4/3,
  className = "" 
}, ref) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useImperativeHandle(ref, () => ({
    captureFrame: () => captureFrame(),
    getVideoElement: () => videoRef.current,
    stopCamera: () => stopCamera()
  }));

  const requestCameraAccess = async () => {
    try {
      console.log('Requesting camera access...');
      setIsLoading(true);
      setError(null);

      // Clean up any existing stream first
      if (streamRef.current) {
        console.log('Stopping existing stream...');
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Reset video element if it exists
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 800 },
          height: { ideal: 600 },
          aspectRatio: aspectRatio,
          facingMode: 'user'
        },
        audio: false
      });

      console.log('Camera stream obtained:', stream);

      // Store the stream and trigger rendering of the video element
      streamRef.current = stream;
      setHasPermission(true);
    } catch (err) {
      console.error('Camera access error:', err);

      // Cleanup on error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      let errorMessage = 'Gagal mengakses kamera. ';

      if (err.name === 'NotAllowedError') {
        errorMessage += 'Silakan berikan izin akses kamera dan refresh halaman.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan. Pastikan kamera terhubung.';
      } else {
        errorMessage += err.message || 'Silakan periksa koneksi kamera dan coba lagi.';
      }

      setError(errorMessage);
      setHasPermission(false);
      onPermissionDenied?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const captureFrame = () => {
    return new Promise((resolve) => {
      if (!videoRef.current || !hasPermission) {
        console.log('Video not ready or no permission');
        resolve(null);
        return;
      }

      // Check if video is actually playing
      if (videoRef.current.readyState !== 4) {
        console.log('Video not ready, readyState:', videoRef.current.readyState);
        resolve(null);
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        // Set canvas size maintaining aspect ratio
        canvas.width = 800;
        canvas.height = 600;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log('Photo captured successfully');
            resolve(url);
          } else {
            console.log('Failed to create blob');
            resolve(null);
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        console.error('Error capturing frame:', error);
        resolve(null);
      }
    });
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    
    setHasPermission(false);
    setError(null);
  };

  // Check permission status on mount
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        console.log('CameraComponent mounted, checking permissions...');
        
        // Wait a bit to ensure component is fully rendered
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' });
          console.log('Camera permission status:', result.state);
          
          if (result.state === 'granted') {
            console.log('Camera permission already granted, auto-requesting...');
            requestCameraAccess();
          } else if (result.state === 'prompt') {
            console.log('Camera permission needs to be requested');
            // Don't auto-request, let user click the button
          } else {
            console.log('Camera permission denied');
          }
        } else {
          console.log('Permissions API not supported, trying direct access...');
          // Auto-request if permissions API not supported
          setTimeout(() => requestCameraAccess(), 1000);
        }
      } catch (e) {
        console.log('Permission check failed, trying direct access...', e);
        setTimeout(() => requestCameraAccess(), 1000);
      }
    };

    checkPermissionStatus();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('CameraComponent unmounting, stopping camera...');
      stopCamera();
    };
  }, []);

  // Attach stream to video when permission granted and element is mounted
  useEffect(() => {
    const attachStream = async () => {
      if (!hasPermission || !streamRef.current || !videoRef.current) return;

      try {
        videoRef.current.srcObject = streamRef.current;

        // Wait for metadata with timeout
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Video loading timeout')), 10000);

          const handleLoadedMetadata = () => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = (e) => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            reject(e || new Error('Video loading failed'));
          };

          if (videoRef.current.readyState >= 1) {
            clearTimeout(timeout);
            resolve();
            return;
          }

          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current.addEventListener('error', handleError);
        });

        try {
          await videoRef.current.play();
        } catch (playError) {
          console.log('Autoplay blocked, user interaction required', playError);
        }

        onCameraReady?.(true);
      } catch (e) {
        console.error('Failed to attach stream to video:', e);
        setError('Gagal menampilkan video dari kamera. Coba refresh halaman.');
        setHasPermission(false);
      }
    };

    attachStream();
    // No cleanup needed here; stopCamera handles it on unmount or manual stop
  }, [hasPermission]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <h3 className="font-semibold text-red-900 mb-2">Camera Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="space-y-2">
          <button
            onClick={requestCameraAccess}
            className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              setError(null);
              setHasPermission(false);
              setIsLoading(false);
              // Force a complete refresh of the component
              setTimeout(() => window.location.reload(), 100);
            }}
            className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="font-semibold text-blue-900 mb-2">Connecting to Camera...</h3>
        <p className="text-blue-700">
          Please wait while we access your camera.
        </p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 text-center ${className}`}>
        <h3 className="font-semibold text-blue-900 mb-2">Camera Access Required</h3>
        <p className="text-blue-700 mb-4">
          We need access to your camera to take photos. Your privacy is important - 
          photos are processed locally and not stored on our servers.
        </p>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={requestCameraAccess}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Requesting Access...
              </>
            ) : (
              'Allow Camera Access'
            )}
          </button>
          
          {/* Manual refresh button */}
          <button
            onClick={() => {
              console.log('Manual refresh clicked');
              setError(null);
              setHasPermission(false);
              setIsLoading(false);
              setTimeout(() => requestCameraAccess(), 100);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Refresh Camera
          </button>
        </div>
        
        {/* Help text */}
        <div className="mt-4 text-xs text-gray-500">
          If you already allowed access but still see this message, try clicking "Refresh Camera" or reload the page.
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[4/3] bg-gray-900 rounded-xl shadow-lg object-cover cursor-pointer"
        onLoadedMetadata={() => {
          console.log('Video metadata loaded');
        }}
        onCanPlay={() => {
          console.log('Video can play');
        }}
        onPlay={() => {
          console.log('Video is playing');
        }}
        onClick={async () => {
          // Handle click to start video if needed
          if (videoRef.current && videoRef.current.paused) {
            try {
              await videoRef.current.play();
              console.log('Video started playing after click');
            } catch (e) {
              console.log('Failed to start video on click:', e);
            }
          }
        }}
      />
      <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-xl pointer-events-none"></div>
      
      {/* Video Status Indicator */}
      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
        Live
      </div>
    </div>
  );
});

CameraComponent.displayName = 'CameraComponent';

export default CameraComponent;
