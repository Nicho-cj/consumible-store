# 🛠️ Consumible Store - Control de Servicio Técnico

Sistema web para la gestión integral de órdenes de servicio técnico, control de clientes, asignación de equipos y monitoreo de técnicos en taller y campo.

---

## 📁 Estructura del Proyecto

El proyecto está organizado en dos módulos independientes (Frontend y Backend):

```text
consumible-store/
├── frontend/             # Cliente React.js + Vite
│   ├── src/
│   │   ├── assets/       # Recursos estáticos (imágenes, íconos)
│   │   ├── components/   # Componentes UI reutilizables (common, layout)
│   │   ├── pages/        # Vistas principales
│   │   ├── routes/       # Configuración de rutas (AppRoutes)
│   ├── package.json
│
│
└── backend/              # Servidor API REST / Servicios
    ├── src/
    ├── package.json
    └── .env.example

consumible-store/
├── LOG-ERRORES.md
├── PROPUESTA.txt
├── README.md
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── README.md
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── modals/
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── test/
│   │   └── utils/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── app.js
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       └── utils/
└── init-db/
    ├── 01-init-tables.sql
    ├── 02-insert-data.sql
    └── 03-catalogo-repuestos.sql