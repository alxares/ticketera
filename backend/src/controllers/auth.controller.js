import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/database.js";
import { registerSchema, loginSchema, passwordSchema } from "../schemas/auth.schema.js";

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
    // Validamos y parseamos datos
    const data = registerSchema.parse(req.body);
    // Derivar username si no viene
    const username = data.username ?? data.email.split('@')[0];

    // 🔒 Prohibir registro directo en IT para no-admin
    if (data.role !== "ADMIN" && data.departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (dept?.name === "IT") {
        return res.status(403).json({ message: "No podés registrarte directamente en el departamento IT." });
      }
    }

    // Chequear duplicados
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username }] },
    });
    if (existing) {
      return res.status(400).json({ message: "Usuario o email ya registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        username,
        password: hashedPassword,
        role: data.role,
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
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: err.errors });
    }
    console.error("❌ Error en registro:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// ✅ Login de usuario
export const loginUser = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: data.usernameOrEmail }, { username: data.usernameOrEmail }] },
    });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
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
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: err.errors });
    }
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// 🔄 Cambio de contraseña de usuario (ADMIN)
export const changeUserPassword = async (req, res) => {
  try {
    const { password } = passwordSchema.parse(req.body);
    const userId = req.params.id;
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: "Contraseña inválida", errors: err.errors });
    }
    console.error("❌ Error cambiando contraseña:", err);
    res.status(500).json({ message: "Error interno" });
  }
};
