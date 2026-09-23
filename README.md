# 🛠️ Consumible Store - Control de Servicio Técnico

Sistema web para la gestión integral de órdenes de servicio técnico, control de clientes, asignación de equipos y monitoreo de técnicos en taller y campo.

---

## 📁 Estructura del Proyecto

El proyecto está organizado en dos módulos independientes (Frontend y Backend):

```text

consumible-store/
├── LOG-ERRORES.md
├── PROPUESTA.txt
├── README.md
├── docker-compose.yml
├── frontend/                       # Cliente React.js + Vite
│   ├── Dockerfile                  # Contenedor NGINX para despliegue del Frontend
│   ├── README.md
│   ├── nginx.config                # Configuracion del servidor NGINX
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── api/
│       ├── components/             # Componentes UI reutilizables (common, layout)
│       │   ├── common/
│       │   ├── layout/
│       │   └── modals/
│       ├── index.css
│       ├── main.jsx
│       ├── pages/                  # Vistas principales
│       ├── routes/                 # Configuración de rutas (AppRoutes)
│       ├── test/
│       └── utils/
├── backend/                        # Servidor API REST / Servicios
│   ├── Dockerfile                  # Contenedor Node
│   ├── package.json
│   ├── package-lock.json
│   ├── app.js                      # Configuración de middlewares
│   ├── server.js                   # Punto de incio y despliegue del servidor backend
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