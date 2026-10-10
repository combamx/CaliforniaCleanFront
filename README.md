# 🧼 California Clean - Frontend (React + TypeScript)

Frontend moderno desarrollado para la gestión operativa y comercial de **California Clean**, conectado a la API RESTful de **ASP.NET Core 8**.

---

## 🚀 Tecnologías

- **React 19** + **TypeScript**
- **Vite** (con proxy inverso a la API para evitar problemas de CORS)
- **Tailwind CSS** (estilos profesionales y responsivos)
- **Lucide React** (iconografía moderna)
- **Axios** (cliente HTTP con interceptores JWT automáticos y captura de paginación)
- **React Router Dom** (enrutamiento protegido)

---

## 📁 Estructura del Proyecto

```text
CaliforniaCleanFront/
├── src/
│   ├── components/
│   │   ├── common/         # Button, Input, Select, Modal, Badge, Pagination, etc.
│   │   └── layout/         # Layout, Navbar, Sidebar, ProtectedRoute
│   ├── context/            # AuthContext (Sesión y JWT)
│   ├── pages/
│   │   ├── login/          # Inicio de sesión con JWT
│   │   ├── dashboard/      # Métricas, accesos rápidos y proyectos recientes
│   │   ├── projects/       # Listado de proyectos (vListProjects), filtros, creación y detalle
│   │   ├── workOrders/     # Órdenes de trabajo, fechas, cuadrillas y bitácora de comentarios
│   │   ├── customers/      # Directorio de clientes comerciales
│   │   └── workers/        # Cuadrillas de trabajadores en campo
│   ├── services/           # apiClient, authService, projectService, customerService, workOrderService, catalogService
│   ├── types/              # Tipos TypeScript alineados con DTOs de C#
│   ├── App.tsx             # Enrutador principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Directivas Tailwind
├── tailwind.config.js
└── vite.config.ts          # Proxy a http://localhost:5055/api
```

---

## ⚙️ Configuración y Ejecución

### 1. Iniciar el Backend (.NET API)
Asegúrate de que la API esté corriendo en `D:\Proyectos\CaliforniaClean\Api.CaliforniaClean`:
```bash
cd D:\Proyectos\CaliforniaClean\Api.CaliforniaClean
dotnet run
```
Por defecto, la API escucha en `http://localhost:5055` y `https://localhost:7055`.

### 2. Iniciar el Frontend
En la carpeta `D:\Proyectos\CaliforniaCleanFront`:
```bash
npm run dev
```
La aplicación estará disponible en:
```
http://localhost:3000
```

---

## 🔐 Credenciales de Prueba

- **Usuario:** `admin`
- **Contraseña:** `admin123`

*(En la pantalla de login dispones además de un botón de autocompletado para agilizar las pruebas).*
