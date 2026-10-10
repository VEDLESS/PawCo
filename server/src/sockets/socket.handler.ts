import { Server as SocketIOServer, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@petco/shared';
import { verifyAccessToken } from '../utils/jwt';

export const registerSocketHandlers = (io: SocketIOServer) => {
  // Socket auth middleware
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication required for socket connection'));
      }

      const decoded = verifyAccessToken(token);
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid socket authentication token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`[Socket Connected] User: ${user?.email} (ID: ${user?.userId}) - Socket: ${socket.id}`);

    // Automatically join personal notification room
    if (user?.userId) {
      socket.join(`user:${user.userId}`);
    }

    // Join booking chat room
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (room: string) => {
      socket.join(room);
      console.log(`[Socket] User ${user?.userId} joined room ${room}`);
    });

    // Leave room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (room: string) => {
      socket.leave(room);
      console.log(`[Socket] User ${user?.userId} left room ${room}`);
    });

    // Live helper GPS broadcast during an active booking
    socket.on(SOCKET_EVENTS.HELPER_LOCATION_UPDATE, (data: { bookingId: string; latitude: number; longitude: number }) => {
      if (data.bookingId) {
        socket.to(`booking:${data.bookingId}`).emit(SOCKET_EVENTS.HELPER_LOCATION_UPDATE, {
          userId: user.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(),
        });
      }
    });

    // Instant Chat Message Dispatch
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (data: { bookingId: string; message: any }) => {
      if (data.bookingId) {
        socket.to(`booking:${data.bookingId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, data.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected] User: ${user?.userId} - Socket: ${socket.id}`);
    });
  });
};
