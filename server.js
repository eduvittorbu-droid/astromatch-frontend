import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import profileRoutes from './routes/profile.js';
import searchRoutes from './routes/search.js';
import likeRoutes from './routes/like.js';
import reportRoutes from './routes/report.js';
import pool from './db.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/report', reportRoutes);

// Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token não fornecido'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch { next(new Error('Token inválido')); }
});

io.on('connection', (socket) => {
  socket.on('join-match', ({ matchId }) => socket.join(`match-${matchId}`));
  socket.on('send-message', async ({ matchId, message }) => {
    const newMsg = await pool.query('INSERT INTO messages (match_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *', [matchId, socket.userId, message]);
    io.to(`match-${matchId}`).emit('new-message', newMsg.rows[0]);
  });
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
