import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import departmentRoutes from './routes/department.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reportRoutes from './routes/report.routes.js';
import settingsRoutes from './routes/settings.routes.js';

import errorHandler from './middleware/errorHandler.js';
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

const app = express();

// ✅ Middleware para archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// 🌐 Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// 🔀 Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use("/api/notifications", notificationRoutes);

// ⚠️ Manejo de errores global
app.use(errorHandler);

export default app;
export const PORT = process.env.PORT || 5000;
