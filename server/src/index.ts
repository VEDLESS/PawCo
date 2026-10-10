import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { config } from './config';
import { registerSocketHandlers } from './sockets/socket.handler';

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

registerSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🐾 PetCo API Backend running on port ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`⚡ Real-time Socket.IO initialized`);
  console.log(`=========================================`);
});
