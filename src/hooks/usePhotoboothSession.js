"use client";

import { useState, useCallback } from 'react';

export const usePhotoboothSession = () => {
  const [step, setStep] = useState('preparation');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentCapture, setCurrentCapture] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [cameraReady, setCameraReady] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetSession = useCallback(() => {
    setStep('preparation');
    setCapturedPhotos([]);
    setCurrentCapture(0);
    setCountdown(3);
    setCameraReady(false);
    setFinalResult(null);
    setIsLoading(false);
  }, []);

  const startSession = useCallback(() => {
    setStep('session');
    setCurrentCapture(0);
    setCapturedPhotos([]);
  }, []);

  const addCapturedPhoto = useCallback((photoUrl) => {
    setCapturedPhotos(prev => [...prev, photoUrl]);
  }, []);

  const nextCapture = useCallback(() => {
    setCurrentCapture(prev => prev + 1);
  }, []);

  const setProcessing = useCallback(() => {
    setStep('processing');
    setIsLoading(true);
  }, []);

  const setResult = useCallback((resultUrl) => {
    setFinalResult(resultUrl);
    setStep('result');
    setIsLoading(false);
  }, []);

  return {
    // State
    step,
    capturedPhotos,
    currentCapture,
    countdown,
    cameraReady,
    finalResult,
    isLoading,
    
    // Actions
    setStep,
    setCountdown,
    setCameraReady,
    resetSession,
    startSession,
    addCapturedPhoto,
    nextCapture,
    setProcessing,
    setResult,
    setIsLoading
  };
};
