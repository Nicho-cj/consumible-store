# LOG DE ERRORES Y OBSERVACIONES — Consumible Store

Fecha inicio: 2026-09-09
Proyecto: C:\Users\Usuario\Desktop\Consumibles Servicio\consumible-store
Objetivo: llevar el sistema de datos mock a producción local (localhost), luego LAN.

---

## FASE 0 — PostgreSQL (COMPLETADA ✅)

Pasos ejecutados:
- Rol `admin` creado (LOGIN PASSWORD 'admin' CREATEDB) OK
- BD `db` creada (OWNER admin) OK
- 01-create-tables.sql -> 7 tablas OK
- 02-insert-dato.sql -> datos maestros OK
- 03-insert-admin.sql -> admin "jesus" (bcrypt) OK
- 04-alter-orden.sql -> columnas motivo_cambio_tecnico y numero_factura OK

Verificación: \dt muestra 7 tablas, 3 usuarios, 2 órdenes.

ERROR/PROBLEMA: NINGUNO
OBSERVACIÓN: La contraseña del superusuario postgres es "12345" (quedó registrada por el usuario).

---

## FASE 1 — Configurar backend para PostgreSQL local (EN PROGRESO)

### Problema 1.1 — Error SASL "client password must be a string"
Síntoma: POST /auth/login devolvía 500 "Algo salio muy mal en el servidor".
Causa raíz: En ES modules, los imports se evalúan ANTES que el body de app.js.
            `db.js` creaba el Pool con process.env vacío porque el dotenv config
            estaba en app.js (que se ejecuta DESPUÉS de los imports).
            DB_PASSWORD quedaba como undefined.

Solución aplicada:
- Se movió la carga de dotenv a db.js (primer módulo evaluado del grafo de imports).
- Carga .env y luego .env.local (este último sobreescribe).
- Se eliminó el dotenv config de app.js (quedaba duplicado).

Archivos modificados:
- backend/src/config/db.js
- backend/app.js
- backend/.env.local (nuevo, DB_HOST=localhost)

Estado: CORREGIDO. Backend ahora inicia y escucha en :3000.

### Problema 1.2 — .env.local no sobreescribía a .env (RESUELTO ✅)
Síntoma: dotenv mostraba "injected env (0) from .env.local".
Causa raíz: dotenv por defecto NO pisa variables ya presentes en process.env.
            Como .env ya tiene DB_HOST, .env.local no lo reemplazaba.
Solución: agregar `override: true` en la carga de .env.local.

Verificación: tras el fix, el login funcionó:
  POST /auth/login {"nombre":"jesus","contraseña":"123456"}
  -> {"status":"success","token":"eyJ...","usuario":{"id":3,"nombre":"jesus","rol":"ADMIN_RECEPCION"}}

FASE 1: COMPLETADA ✅

---

## FIX DE CAMPO: `contraseña` → `contrasena` (COMPLETADO ✅)

Motivo: el carácter ñ genera problemas de encoding entre PowerShell/curl y JSON.
El usuario pidió eliminar la ñ.

Cambios aplicados:
- DB: ALTER TABLE usuario RENAME COLUMN contraseña TO contrasena (ejecutado vía archivo UTF-8,
  porque el ñ se corrompía en la línea de comandos: "secuencia de bytes inválida UTF8")
- init-db/01, 02, 03: nombre de columna y comentarios actualizados
- backend/src/controllers/auth.js: variables contrasena
- backend/src/models/usuario.js: columnas contrasena
- backend/src/schemas/authSchema.js + usuarioSchema.js: campo contrasena
- backend/src/controllers/backup.js: comentario PGPASSWORD
- frontend/src/App.jsx: body JSON { nombre, contrasena }
- frontend/src/pages/LoginPage.jsx: comentarios

ERROR/PROBLEMA observado: La prueba inicial con curl devolvió 500 "Algo salio muy mal".
Causa: el escape de comillas de PowerShell rompió el JSON ("body: '{\'").
Solución en pruebas: usar --data-binary "@archivo.json" con archivo UTF-8.

Verificación: POST /auth/login {"nombre":"jesus","contrasena":"123456"} -> success + token ✅

### Problema 1.2 — (pendiente de confirmar) env .env.local dice 0 inyectadas
Síntoma: El log de dotenv mostraba "injected env (10) from .env" y
         "injected env (0) from .env.local".
Observación: Los 10 valores vienen de .env; .env.local reporta 0.
            Aunque DB_HOST sigue siendo 172.24.87.158 de .env, el backend
            conecta a localhost... ¿? -> REVISAR si no hay DOS modos de carga.
            (quizá dotenvx maneja los paths con resolve diferente).
Estado: En investigación tras la FASE 1.