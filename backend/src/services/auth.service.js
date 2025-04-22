import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { hashPassword, comparePasswords } from '../utils/helpers.js';

export const registerUser = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);
  
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: 'USER' // Rol por defecto
    }
  });
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await comparePasswords(password, user.password))) {
    throw new Error('Credenciales inválidas');
  }

  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};