// /src/hooks/useSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Use API URL as base for socket connection
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const socketURL = baseURL.replace('/api', '').replace('http://', 'ws://').replace('https://', 'wss://');

    socketRef.current = io(socketURL, {
      auth: {
        token: token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to socket server, attempt:', attemptNumber);
      setIsConnected(true);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    // Cleanup on unmount or dependency change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, user]);

  return {
    socket: socketRef.current,
    isConnected
  };
};