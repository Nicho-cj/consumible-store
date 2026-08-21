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
