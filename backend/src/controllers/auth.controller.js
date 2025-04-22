import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/database.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

dotenv.config();

// 🔐 Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Registro de usuario
export const registerUser = async (req, res) => {
  try {
    console.log("BODY RECIBIDO", req.body);
    const data = registerSchema.parse(req.body);

    // 🔒 Validar que no se registren en IT
    if (data.role !== "ADMIN" && data.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });

      if (dept?.name === "IT") {
        return res.status(403).json({
          message: "No podés registrarte directamente en el departamento IT.",
        });
      }
    }

    // Verificar existencia previa
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Usuario o email ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role || "USER",
        departmentId: data.departmentId || null,
      },
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        departmentId: newUser.departmentId,
      },
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error en registro:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// ✅ Login de usuario
export const loginUser = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.usernameOrEmail }, { username: data.usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generateToken(user);

    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      },
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
