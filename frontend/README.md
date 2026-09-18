# React + Vite

## Despliegue en produccion (dominio local)

El frontend se sirve con Nginx (mismo origen) y el backend queda detras de el:

- Dominio local a usar: `consumiblestore.ordenes.local`.
- En el router: IP estatica para la PC servidor.
- En cada PC de la red: agregar en `C:\Windows\System32\drivers\etc\hosts`
  una linea `IP_SERVIDOR consumiblestore.ordenes.local`.
- En `nginx.conf`: el campo `server_name` usa ese dominio y hace de reverse proxy:
  `/api/...` y `/ws` hacia el servicio `backend:3000` de Docker Compose.
- El build no necesita variables de entorno: las peticiones son relativas (`/api/...`)
  y las resuelve Nginx. `VITE_API_BASE` solo como override absoluto si se requiere.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
