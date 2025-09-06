"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiCamera, FiRotateCcw, FiDownload, FiShare2, FiHome, FiPlay, FiX, FiClock, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import CameraComponent from '@/components/common/CameraComponent';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PhotoboothInstructions from '@/components/common/PhotoboothInstructions';
import { createPhotoboothResult } from '@/lib/photoboothUtils';
import { frameService } from '@/services/frame';
import { userService } from '@/services/user';
import { useAuth } from '@/context/AuthContext';
import { playSound, triggerHapticFeedback } from '@/lib/audioUtils';

// Utility functions for image handling
const downloadImage = (imageUrl, filename) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const shareImage = async (imageUrl, title) => {
  if (navigator.share) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'snaplove-photobooth.jpg', { type: 'image/jpeg' });
      
      await navigator.share({
        title: title,
        text: 'Check out my SnapLove photobooth result!',
        files: [file]
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  } else {
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      return false;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
};

// Component yang menggunakan useSearchParams
const PhotoboothContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState('preparation'); // preparation, session, countdown, capture, processing, result
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentCapture, setCurrentCapture] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [cameraReady, setCameraReady] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [frameData, setFrameData] = useState(null);
  const [loadingFrame, setLoadingFrame] = useState(true);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const cameraRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const countdownTimeoutRef = useRef(null);
  const isCapturingRef = useRef(false);
  const sessionDoneRef = useRef(false);

  // Clear all timers
  const clearTimers = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }
  };

  // Get URL parameters
  const frameId = searchParams.get('frameId');
  const layout = searchParams.get('layout') || '2x1';
  const frameTitle = searchParams.get('title') || 'SnapLove Frame';

  // Calculate max captures based on layout
  const MAX_CAPTURES = layout === '4x1' ? 4 : layout === '3x1' ? 3 : 2;

  // Camera ready callback
  const handleCameraReady = (ready) => {
    console.log('Camera ready callback:', ready);
    setCameraReady(ready);
  };

  // Camera permission denied callback
  const handlePermissionDenied = (error) => {
    console.error('Camera permission denied:', error);
  };

  // Load frame data
  useEffect(() => {
    const loadFrameData = async () => {
      if (!frameId) {
        setLoadingFrame(false);
        return;
      }

      try {
        setLoadingFrame(true);
        const frame = await frameService.getPublicFrameById(frameId);
        setFrameData(frame);
      } catch (error) {
        console.error('Failed to load frame:', error);
        // If frame not found, redirect to discover
        router.push('/discover');
      } finally {
        setLoadingFrame(false);
      }
    };

    loadFrameData();
  }, [frameId, router]);

  // Redirect if no frameId provided
  useEffect(() => {
    if (!loadingFrame && !frameId) {
      router.push('/discover');
    }
  }, [frameId, loadingFrame, router]);

  // Start photobooth session
  const startSession = () => {
    // Reset session flags and timers
    clearTimers();
    sessionDoneRef.current = false;
    isCapturingRef.current = false;
    setCapturedPhotos([]);
    setCurrentCapture(0);
    setStep('session');
    // Start the first countdown
    startCountdown();
  };

  // Countdown before capture
  const startCountdown = () => {
    // Prevent overlapping countdowns
    clearTimers();
    setStep('countdown');
    setCountdown(3);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          // Trigger capture immediately after countdown ends
          capturePhoto();
          return 0;
        }
        // Feedback tick each second
        playSound('countdown');
        triggerHapticFeedback('light');
        return prev - 1;
      });
    }, 1000);
  };

  // Capture photo
  const capturePhoto = async () => {
    if (sessionDoneRef.current) return;
    if (isCapturingRef.current) return;
    if (!cameraRef.current) {
      console.error('Camera reference not available');
      return;
    }

    isCapturingRef.current = true;
    console.log(`Capturing photo ${currentCapture + 1} of ${MAX_CAPTURES}`);
    setStep('capture');
    
    // Play capture sound and haptic feedback
    playSound('capture');
    triggerHapticFeedback('medium');
    
    try {
      // Try a few times in case video needs a moment
      let photoUrl = null;
      for (let i = 0; i < 5; i++) {
        photoUrl = await cameraRef.current.captureFrame();
        if (photoUrl) break;
        await new Promise(r => setTimeout(r, 150));
      }
      if (photoUrl) {
        console.log(`Photo ${currentCapture + 1} captured successfully`);

        // Update photos and decide next step atomically
        setCapturedPhotos(prev => {
          const updated = [...prev, photoUrl];
          const total = updated.length;
          const nextIndex = total; // 1-based count equals next index

          if (total < MAX_CAPTURES) {
            setCurrentCapture(nextIndex); // move to next capture index
            // Start next countdown after a short flash
            countdownTimeoutRef.current = setTimeout(() => {
              startCountdown();
            }, 300);
          } else {
            // Done capturing
            sessionDoneRef.current = true;
            console.log('All photos captured, processing result...');
            processResult(updated);
          }
          return updated;
        });
      } else {
        console.error('Failed to capture photo - no URL returned');
        alert('Failed to capture photo. Please try again.');
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
      alert('Error capturing photo: ' + error.message);
    } finally {
      isCapturingRef.current = false;
    }
  };

  // Process final result with frame
  const processResult = async (photos) => {
    setStep('processing');
    setIsLoading(true);

    try {
      let resultUrl = null;

      if (frameData) {
        // Use frame data for processing
        const frameUrl = frameData.thumbnail_url || frameData.thumbnail || frameData.image_url;
        resultUrl = await createPhotoboothResult(photos, layout, frameUrl);
      } else {
        // Fallback to default frame
        resultUrl = await createPhotoboothResult(photos, layout);
      }

      setFinalResult(resultUrl);
      setStep('result');

      // Play success sound and haptic feedback
      playSound('complete');
      triggerHapticFeedback('heavy');
    } catch (error) {
      console.error('Error processing result:', error);
      alert('Failed to process your photobooth result. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save photo to backend
  const savePhoto = async (photoUrl, title) => {
    if (!isAuthenticated || !user?.username || !frameData) {
      return;
    }

    try {
      setSavingPhoto(true);

      // Convert photo URL to blob
      const response = await fetch(photoUrl);
      const photoBlob = await response.blob();

      // Create photo data
      const photoData = {
        images: [photoBlob],
        frameId: frameData._id || frameData.id,
        title: title,
        desc: `Photobooth session with ${frameData.title || 'SnapLove Frame'}`
      };

      await userService.capturePhoto(user.username, photoData);

      // Show success message
      alert('Photo saved successfully!');

    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo. Please try again.');
    } finally {
      setSavingPhoto(false);
    }
  };

  // Download result
  const downloadResult = () => {
    if (!finalResult) return;
    downloadImage(finalResult, `snaplove-photobooth-${Date.now()}.jpg`);
  };

  // Share result
  const shareResult = async () => {
    if (!finalResult) return;

    try {
      const shared = await shareImage(finalResult, 'My SnapLove Photobooth');
      if (!shared) {
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Sharing failed. You can download the image instead.');
    }
  };

  // Reset session
  const resetSession = () => {
    console.log('Resetting photobooth session...');
  clearTimers();
  sessionDoneRef.current = false;
  isCapturingRef.current = false;
    setCapturedPhotos([]);
    setCurrentCapture(0);
    setFinalResult(null);
    setCountdown(3);
    setStep('preparation');
    
    // Stop camera and reset camera ready state
    if (cameraRef.current) {
      cameraRef.current.stopCamera();
    }
    setCameraReady(false);
  };

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      clearTimers();
      if (cameraRef.current) {
        cameraRef.current.stopCamera();
      }
    };
  }, []);

  // Get TTL info based on user role
  const getTTLInfo = () => {
    if (!user?.role) return { days: 3, label: '3 days' };

    const roleLimits = {
      basic: { days: 3, label: '3 days' },
      verified_basic: { days: 7, label: '7 days' },
      verified_premium: { days: -1, label: 'Unlimited' },
      official: { days: -1, label: 'Unlimited' },
      developer: { days: -1, label: 'Unlimited' }
    };

    return roleLimits[user.role] || roleLimits.basic;
  };

  const ttlInfo = getTTLInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/discover" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <FiHome className="h-5 w-5" />
              <span>Back to Discover</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              SnapLove Photobooth
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Camera Area (single instance for all steps) */}
        <div className="mb-8">
          <div className="relative mx-auto w-full max-w-lg">
            <CameraComponent
              ref={cameraRef}
              onCameraReady={handleCameraReady}
              onPermissionDenied={handlePermissionDenied}
            />

            {/* Countdown Overlay */}
            {step === 'countdown' && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-8xl font-bold mb-4 animate-bounce">
                    {countdown}
                  </div>
                  <p className="text-xl">Get Ready!</p>
                </div>
              </div>
            )}

            {/* Flash Effect */}
            {step === 'capture' && (
              <div className="absolute inset-0 bg-white/90 rounded-xl animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Preparation Step */}
        {step === 'preparation' && !showInstructions && (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <FiCamera className="h-16 w-16 mx-auto text-pink-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Photobooth Session
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Get ready to take {MAX_CAPTURES} amazing photos with the selected frame!
                </p>

                <button
                  onClick={() => setShowInstructions(true)}
                  className="text-pink-600 hover:text-pink-700 font-medium underline mb-6"
                >
                  First time? View instructions
                </button>
              </div>

              {/* Frame Information */}
              {frameData && (
                <div className="mb-8 bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Frame</h3>
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative w-24 h-36 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={frameData.thumbnail_url || frameData.thumbnail || frameData.image_url}
                        alt={frameData.title || 'Frame'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-lg text-gray-900">{frameData.title || frameTitle}</h4>
                      <p className="text-gray-600">Layout: {layout.toUpperCase()}</p>
                      <p className="text-gray-600">Photos needed: {MAX_CAPTURES}</p>
                      {isAuthenticated && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <FiClock className="w-4 h-4" />
                          <span>TTL: {ttlInfo.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {cameraReady ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-2">Camera Ready!</h3>
                      <p className="text-green-700">
                        Position yourself in the frame and click &quot;Start Session&quot; when you&apos;re ready.
                        You&apos;ll have exactly 3 seconds per photo.
                      </p>
                    </div>

                    <button
                      onClick={startSession}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FiPlay className="h-5 w-5 mr-3" />
                      Start Photobooth Session
                    </button>
                  </>
                ) : (
                  <div className="mt-2 text-sm text-gray-600">
                    Allow camera access above to begin. You can test after it&apos;s ready.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-lg w-full">
              <PhotoboothInstructions 
                onClose={() => setShowInstructions(false)}
              />
            </div>
          </div>
        )}

        {/* Session Steps */}
  {(step === 'session' || step === 'countdown' || step === 'capture') && (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-center space-x-4 mb-4">
                  {Array.from({ length: MAX_CAPTURES }, (_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        index < currentCapture
                          ? 'bg-gradient-to-r from-green-500 to-blue-600'
                          : index === currentCapture
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  Photo {currentCapture + 1} of {MAX_CAPTURES}
                </p>
              </div>

              {/* Camera View is now always rendered above */}

              {/* Captured Photos Preview */}
              {capturedPhotos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Captured Photos</h3>
                  <div className="flex justify-center space-x-4">
                    {capturedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Captured photo ${index + 1}`}
                          className="w-20 h-16 object-cover rounded-lg shadow-md border-2 border-green-500"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-600">
                {step === 'countdown' 
                  ? `Photo ${currentCapture + 1} in ${countdown} seconds...`
                  : step === 'capture'
                  ? `Taking photo ${currentCapture + 1}...`
                  : 'Get ready for your photo!'
                }
              </p>

              {/* Debug info - remove in production */}
              <div className="mt-2 text-xs text-gray-400">
                Debug: Step={step}, Current={currentCapture}, Photos={capturedPhotos.length}
              </div>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <LoadingSpinner 
                size="xlarge" 
                text="Creating Your Masterpiece... Almost done!" 
                className="mb-4"
              />
            </div>
          </div>
        )}

        {/* Result */}
        {step === 'result' && finalResult && (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Photobooth Result is Ready! 🎉
              </h2>
              {frameData && (
                <p className="text-xs text-gray-500 mb-2">Frame: {frameData.title || frameTitle}</p>
              )}

              {/* Final Result Image */}
              <div className="mb-8">
                <div className="relative mx-auto w-full max-w-sm">
                  <img
                    src={finalResult}
                    alt="Photobooth Result"
                    className="w-full rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* TTL Information */}
              {isAuthenticated && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <FiClock className="w-5 h-5" />
                    <span className="font-medium">
                      Photo will be saved for: {ttlInfo.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => downloadImage(finalResult, `snaplove-photobooth-${Date.now()}.jpg`)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiDownload className="h-5 w-5 mr-2" />
                  Download
                </button>

                <button
                  onClick={() => shareImage(finalResult, 'My SnapLove Photobooth')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiShare2 className="h-5 w-5 mr-2" />
                  Share
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => savePhoto(finalResult, `Photobooth - ${frameData?.title || frameTitle}`)}
                    disabled={savingPhoto}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {savingPhoto ? (
                      <FiLoader className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <FiCamera className="h-5 w-5 mr-2" />
                    )}
                    {savingPhoto ? 'Saving...' : 'Save Photo'}
                  </button>
                )}

                <button
                  onClick={resetSession}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiRotateCcw className="h-5 w-5 mr-2" />
                  Take Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading component untuk suspense fallback
const PhotoboothLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
    <div className="text-center">
      <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
      <p className="text-gray-600">Loading photobooth...</p>
    </div>
  </div>
);

// Main component dengan Suspense wrapper
const PhotoboothPage = () => {
  return (
    <Suspense fallback={<PhotoboothLoading />}>
      <PhotoboothContent />
    </Suspense>
  );
};

export default PhotoboothPage;