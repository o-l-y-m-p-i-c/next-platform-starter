'use client';

import { io, Socket } from 'socket.io-client';
import { SocketContext } from '../context';
import { getBackendURL } from '../helpers/urlHelper';
import { useEffect, useState } from 'react';

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(getBackendURL('ws'), {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setSocket(socket);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected. Reason:', reason);
      setSocket(null);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };
