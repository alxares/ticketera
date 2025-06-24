# 🎟️ Ticketera — Sistema de Gestión de Tickets Empresariales

**Ticketera** es una aplicación web moderna y ágil diseñada para gestionar tickets internos en empresas. Permite registrar solicitudes, asignarlas a usuarios por departamento, chatear en tiempo real y administrar toda la estructura organizativa desde una interfaz intuitiva, todo según el rol del usuario.

---

## 🛠️ Tecnologías

**Frontend**: React + Bootstrap Icons + Toastify
**Backend**: Node.js + Express + Prisma + PostgreSQL
**Tiempo real**: Socket.IO (WebSocket)
**Validación**: Zod
**Autenticación**: JWT

---

## 🚀 Funcionalidades

* 🔐 Registro e inicio de sesión con JWT
* 👤 Dashboards personalizados por rol: Usuario / Manager / Admin
* 🎟️ Crear, editar, eliminar y asignar tickets
* 🗃️ Estados, prioridades, adjuntos y departamentos por ticket
* 💬 Chat en tiempo real entre usuarios del mismo ticket
* 🔔 Notificaciones push con WebSocket
* 👥 Gestión de usuarios y departamentos (admin)
* 📊 Generación de reportes internos
* ⚙️ Configuración general del sistema

---

## 🗂️ Estructura del Proyecto

### 📁 Backend — `/backend/`

```
backend/
├── prisma/               # Migraciones y schema.prisma
├── scripts/              # Scripts para inicializar admin y departamentos
│   ├── seed-department-it.js
│   └── seed-admin.js
├── src/
│   ├── config/           # Conexiones (DB, Socket)
│   ├── controllers/      # Controladores de recursos
│   ├── middleware/       # JWT, manejo de roles, errores
│   ├── models/           # (Opcional) Lógica de modelo
│   ├── routes/           # Endpoints API por recurso
│   ├── schemas/          # Validaciones con Zod
│   ├── uploads/          # Archivos adjuntos
│   ├── app.js            # Configuración Express
│   └── server.js         # Arranque del servidor y WebSocket
├── .env                  # Variables de entorno
└── package.json
```

### 📁 Frontend — `/frontend/`

```
frontend/
├── public/               # HTML base, íconos
├── src/
│   ├── components/
│   │   ├── Auth/         → Login, Registro
│   │   ├── Chat/         → ChatPage, WebSocket
│   │   ├── Common/       → Sidebar, Topbar, Notification
│   │   ├── Dashboard/    → Vistas por rol
│   │   ├── Departments/  → ABM de departamentos
│   │   ├── Layout/       → Componentes de layout base
│   │   ├── Reports/      → Visualización de reportes
│   │   ├── Settings/     → Configuración general
│   │   ├── Tickets/      → Crear, editar, listar tickets
│   │   └── Users/        → Gestión de usuarios
│   ├── routes/           → Rutas públicas y protegidas
│   ├── services/         → Axios + autenticación
│   ├── styles/           → global.css, modal.css, etc.
│   ├── App.js / index.js
├── .env                  # Variables de entorno Frontend
└── package.json
```

---

## ⚙️ Instalación y ejecución

### 🔌 Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
# Inicializar datos de prueba (seeds)
node src/scripts/seeds/seed-department-it.js
node src/scripts/seeds/seed-admin.js
npm run dev
```

Archivo `.env` requerido:

```env
PORT=4000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ticketera
JWT_SECRET=supersecreto
FRONTEND_URL=http://localhost:3000
```

### 💻 Frontend

```bash
cd frontend
npm install
npm start
```

Archivo `.env` del frontend:

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_SOCKET_URL=http://localhost:4000
```

---

## 🥪 ¿Cómo usar Ticketera?

1. Asegúrate de haber ejecutado los seeds en el backend para crear el departamento IT y el usuario admin.
2. Regístrate como nuevo usuario o inicia sesión con:

   * **Email:** `admin@prueba.com`
   * **Password:** `admin12345`
3. Accede a tu dashboard según tu rol.
4. Gestiona tickets, usuarios o departamentos.
5. Interactúa vía chat y recibe notificaciones en tiempo real.

---

## 📃 Licencia

MIT © 2025 — Proyecto educativo y empresarial libre para organizaciones que necesiten una solución moderna de soporte interno.

---

## ✨ Autor

Desarrollado por **Alexander Argüello** 🚀
