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
Estado: RESUELTO ✅ — dotenvx reporta "10 inyectadas" porque ambos archivos
        suman las mismas claves; la conexión real usa .env.local (override: true,
        FASE 1 - Problema 1.2). Verificado porque toda la FASE 2/3 corre contra
        PostgreSQL local (localhost) sin necesidad de Docker.

---

## FASE 2 — Queries enriquecidas con JOINs + columna `estado` (COMPLETADA ✅)

### Problema 2.1 — CRÍTICO: la tabla `orden_servicio` NO tenía las columnas `estado` ni `fecha_salida`
Síntoma: Los controladores/modelos hacían queries por `estado` (getAbierto, getEntregable, etc.)
         y la columna no existía en la tabla -> fallaría en producción (42P01).
Causa raíz: La migración que debía agregar esas columnas nunca se definió en init-db.

Solución aplicada:
- init-db/05-add-estado.sql (NUEVO): agrega `fecha_salida TIMESTAMP NULL` y
  `estado VARCHAR(30) NOT NULL DEFAULT 'REGISTRADO'` + backfill del seed
  (ORD-2026-001 = LISTO_ENTREGA, ORD-2026-002 = PROCESO_TECNICO).
- Aplicado a la BD local (el otro dev lo recibe vía volumen Docker).

### Problema 2.2 — Zod eliminaba el campo `estado` en PATCH (BUG CRÍTICO)
Síntoma: PATCH /ordenes/:id con {"estado":"EN_DIAGNOSTICO"} devolvía 200 pero el estado
         nunca cambiaba. Además `contador_inicio` se sobreescribía a 0.
Causa raíz 1: ordenSchema NO declaraba `estado`, y zod por defecto hace strip de
              claves desconocidas -> req.body llegaba SIN estado.
Causa raíz 2: contador_inicio tenía .default(0) y fecha_ingreso .default(now).
              validatePartial inyecta los defaults aun en PATCH parcial ->
              el modelo escribía contador_inicio = 0 (dato real sobreescrito).

Solución aplicada:
- ordenSchema.js: se agrega `estado: z.enum(ESTADOS_VALIDOS).nullish()`
  (importa ESTADOS_VALIDOS de stateMachine.js para no duplicar la lista).
- ordenSchema.js: se quitan los .default() de contador_inicio y fecha_ingreso
  (la BD ya aplica CURRENT_TIMESTAMP al crear).
- Todos los modelos con patch() (orden, cliente, equipo, usuario, tecnico, servicio,
  repuesto): se añade `if (value === undefined) continue;` para no escribir NULL
  en columnas que no vienen en el PATCH (zod emite undefined en campos nullish).

### Problema 2.3 — /servicios/:id se identifica por id_orden (no por id_nota)
Síntoma: PATCH /servicios/10 (id_nota) devolvía 200 con body vacío y no actualizaba nada.
Causa raíz: NotaServicioModel (getById/patch/update/delete) filtra por
            `WHERE id_orden = $1`; la ruta /servicios/:id expone :id pero el modelo
            lo interpreta como id de ORDEN. Pasar id_nota no matcheaba filas ->
            res.json(undefined) -> 200 sin body.
Convención del sistema: UNA nota por orden (UNIQUE id_orden). El id correcto para
            /servicios/:id es el id_orden de la nota.
Estado: DOCUMENTADO (@REVISAR agregado). Al conectar el frontend (FASE 5) usar
            /servicios/{id_orden} para actualizar la nota; resolver la ambigüedad
             id_nota/id_orden en una refactorización posterior.

Verificación FASE 2 (todo OK):
- GET /ordenes -> JSON enriquecido (cliente_nombre, equipo_serial, tecnico_nombre,
  recepcion_nombre, diagnostico_falla, trabajo_realizado, contador_final...) ✅
- GET /ordenes?tecnico_id=2 -> solo órdenes de Luis Sánchez ✅
- GET /ordenes?estado=[abierto|recibido|diagnostico|cotizacion|reparacion|entregable|finalizado|cancelado] ✅
- GET /ordenes/1/equipo -> objeto (antes devolvía rows) ✅
- POST /ordenes -> REGISTRADO por default de BD ✅
- PATCH /ordenes/:id (estado) -> aplica transición y conserva otros campos ✅
- Estado parcial correcto: REGISTRADO→EN_DIAGNOSTICO→SOLUCION_COTIZACION→PROCESO_TECNICO→LISTO_ENTREGA→ENTREGADO ✅
- RN-03 bloquea PROCESO_TECNICO sin cotización aprobada ✅
- RN-04 bloquea ENTREGADO sin nota con diagnóstico/contador/monto ✅
- ENTREGADO setea fecha_salida automáticamente ✅
- DELETE /ordenes/:id -> elimina orden + nota ✅

FASE 2: COMPLETADA ✅

---

## FASE 3 — Endpoint público GET /tecnicos/publicos (COMPLETADA ✅)

Motivo: la vista técnica comunitaria (sin login) necesita un selector de técnicos.

Cambios:
- backend/src/models/tecnico.js: `getPublicos()` -> SELECT id_tecnico, nombre FROM tecnico WHERE activo = TRUE
- backend/src/controllers/tecnico.js: `getPublicos` handler
- backend/app.js: `app.get('/tecnicos/publicos', ...)` registrada ANTES del montaje /tecnicos (que exige admin)

Verificación:
- GET /tecnicos/publicos SIN token -> [{"id_tecnico":2,"nombre":"Luis Sánchez"},{"id_tecnico":1,"nombre":"Pedro Martínez"}] ✅

---

## FASE 5a — Escrituras de vista técnica SIN auth + codigo_orden autogenerado (COMPLETADA ✅)

### Decisión tomada (confirmada por el usuario)
La vista técnica es comunitaria (sin login) pero debe poder diagnosticar, enviar a cotización,
finalizar trabajo y gestionar repuestos = ESCRITURA al backend. El usuario aprobó RELAJAR la auth:
- /ordenes, /servicios, /repuestos quedan SIN auth (lectura Y escritura publicas) hasta que exista login de técnico.
- /equipos se mantiene con soloLectura (GET público, escritura admin).
- /clientes, /tecnicos, /usuarios, /reportes, /backup siguen protegidos con admin.

Marcado: `@REVISAR FASE 6` en app.js para volver a proteger cuando haya login de técnico.

### codigo_orden autogenerado
Problema: el frontend generaba códigos localmente (ORD-2026-XXX) con riesgo de colisión con el UNIQUE.
Solución: backend/src/models/orden.js `create()` -> si no viene codigo_orden, genera
`ORD-{YYYY}-{MAX(id_orden)+1 pad 3}`. La secuencia deriva de id_orden (SERIAL monotónico),
por lo que NUNCA se reutiliza tras un borrado ni colisiona.
Schema: ordenSchema codigo_orden pasa a nullish().

Verificación:
- POST /ordenes SIN token y SIN codigo -> autogenera ORD-2026-003 ✅
- PATCH /ordenes/:id estado SIN token -> funciona (antes: 401) ✅
- PATCH /servicios/{id_orden} SIN token -> funciona ✅
- GET /clientes SIN token -> 401 (sigue protegido) ✅

ERROR/PROBLEMA: NINGUNO

---

## FASE 4 — Capa API frontend (COMPLETADA ✅)

Nueva carpeta `frontend/src/api/` que centraliza el acceso al backend y mapea snake_case↔camelCase
(decisión del usuario: las páginas NO cambian sus campos):

- `client.js`: apiFetch (base URL VITE_API_BASE || http://localhost:3000, headers, errores normalizados).
- `auth.js`: loginAdmin (POST /auth/login), sesión en localStorage (cs_token/cs_rol/cs_usuario),
  accessTechnician (vista técnica comunitaria).
- `mappers.js`: normalizeOrden / normalizeCliente / normalizeEquipo / normalizeTecnico /
  normalizeRepuesto + denyormalizeOrdenPayload / denyormalizeNotaPayload. normalizeOrden produce
  campos planos (clienteNombre, equipoSerie, tecnicoAsignado...) y shorthand anidado (cliente/equipo)
  para que OrdenDetalleModal, OrdenEnvioModal y TecnicoDiagnosticoModal funcionen sin tocar su UI.
- `ordenes.js`: listOrdenes (estado/tecnicoId), getOrden, createOrden, patchOrden, responderCotizacion,
  getNota, patchNota (con fallback POST /servicios si la nota no existe = orden sin técnico), repuestos CRUD + syncRepuestos.
- `entidades.js`: clientes/equipos/tecnicos (GET /tecnicos/publicos público, resto admin).
- `reportes.js`: reporteServicios (FASE 5-3) y descargarBackup.

ERROR/PROBLEMA: NINGUNO

---

## FASE 5-1 — Frontend conectado al backend: núcleo (COMPLETADA ✅)

Cambios:
- App.jsx: login vía api/auth; handleSaveOrder crea la orden REAL (POST /ordenes con id_cliente,
  id_equipo, id_tecnico, id_usuario_recep del token; el backend autogenera codigo_orden). Se quitó
  el código random local y el mapa hardcodeado de técnicos.
- NewOrderModal: búsqueda de cliente/equipo contra el backend; si no existen, se CREAN (cliente por
  cédula/RIF, equipo por serial) y se usan sus ids; dropdown de técnicos desde GET /tecnicos.
- OrdenesPage: fetch real por tab + botón Actualizar; OrdenDetalleModal: aprobar/rechazar via
  PATCH /ordenes/:id/cotizacion, entregar via PATCH /ordenes/:id { estado ENTREGADO, contador_final, monto_cobro }.
- TecnicosOrdenesPage: eliminado CURRENT_TECNICO_ID=2; selector de técnico del catálogo real (GET
  /tecnicos/publicos) + fetch con tecnicoId. TecnicoDiagnosticoModal: acciones reales (aceptar,
  guardar avance, enviar a cotización, finalizar) + repuestos persistidos en BD (POST/DELETE con sync).
- Modales técnicos se remontan con key={order.id} (evita setState en effects, lint limpio).

### Problema 5.1.1 — RN-04 rechazaba la entrega aunque se enviaban contador_final + monto_cobro
Causa: `contador_final` NO estaba declarado en ordenSchema -> zod lo eliminaba en el PATCH parcial
(mismo patrón que el bug 2.2 de `estado`). El backend validaba `nota.contador_final` en la nota,
pero la decisión de negocio (confirmada con el usuario) es que el contador final y el monto se
registran en la ORDEN al entregar.
Solución:
- ordenSchema.js: se agrega `contador_final: z.number().int().min(0).nullish()`.
- stateMachine.js validarCierreCompleto: valida `orden.contador_final` (no nota.contador_final).
- controllers/ordenes.js patch: llama validarCierreCompleto con `{ ...ordenActual, ...data }`
  (los datos de la entrega entran en la validación).
Verificado: PATCH ENTREGADO {contador_final:15430, monto_cobro:45.5} -> 200 + fecha_salida ✅

### Problema 5.1.2 — DELETE /ordenes/:id fallaba con repuestos registrados (FK code 23001)
Causa: `fk_repuesto_orden` estaba con ON DELETE RESTRICT mientras nota_servicio tenía CASCADE.
Solución: init-db/06-fk-repuesto-cascade.sql -> re-crea la FK con ON DELETE CASCADE.
Verificado: DELETE de la orden de prueba eliminó orden + nota + repuestos ✅

### Verificación FASE 5-1 (contrato completo UI → API, todo OK):
- POST /ordenes (sin token, sin codigo) -> ORD-2026-003 autogenerado, nota_servicio creada al asignar técnico ✅
- GET /ordenes/17 -> JOIN con cliente/equipo/tecnico/recepcion/nota ✅
- PATCH EN_DIAGNOSTICO → PATCH /servicios/{id_orden} (nota) → POST+GET /repuestos/orden ✅
- PATCH SOLUCION_COTIZACION → PATCH /cotizacion {aprobada:true} -> PROCESO_TECNICO (RN-03) ✅
- PATCH LISTO_ENTREGA → PATCH ENTREGADO {contador_final,monto_cobro} (RN-04) ✅
- Registro de repuestos exige `descripcion` (schema length 1..100); el frontend manda nombre como descripcion ✅
- lint: 0 errores en archivos FASE 4/5-1 (quedan 8 preexistentes a limpiar en FASE 6) ✅
- build (vite): OK ✅

---

## FASE 5-2 — Páginas Clientes / Equipos / Técnicos conectadas al backend (COMPLETADA ✅)

### Cambio de esquema (aprobado por el usuario): RF-03 ficha técnica de equipo
Problema: la tabla `equipo` solo tenía nro_serial, marca, modelo, descripcion -> no había dónde
persistir tipo, cliente propietario ni contadores (la pantalla Equipos los usa).
Solución: init-db/07-equipo-ficha.sql (aplicado localmente con psql):
- `tipo_equipo VARCHAR(40)`, `contador_bn INTEGER DEFAULT 0`, `contador_color INTEGER DEFAULT 0`
- `id_cliente INTEGER` + FK fk_equipo_cliente -> cliente(id_cliente) ON DELETE RESTRICT
Backend:
- equipoSchema.js: + tipo_equipo (nullish), id_cliente (int>0 nullish), contador_bn/color (int>=0 default 0)
- models/equipo.js: getAll/getById/getBySerial ahora hacen LEFT JOIN cliente
  (exponen cliente_nombre); create/update/patch incluyen las nuevas columnas.
Frontend:
- mappers normalizeEquipo: tipo desde tipo_equipo, cliente desde cliente_nombre, contadores reales.
- entidades.js createEquipo: envía tipo_equipo, id_cliente, contador_bn/color.

### Páginas
- ClientesPage: listClientes() real (auth) + refresh + estados loading/error.
- ClienteDetalleModal: historial real vía GET /clientes/:id/ordenes y /clientes/:id/equipos
  (antes mockOrdenes/mockEquipos). Se remonta con key={cliente.id} para resetear el loading.
- EquiposPage: listEquipos() + listOrdenes() (cuenta de servicios por serial). Alta RF-03 vía
  createEquipo (select de tipo, select de cliente propietario, contadores B/N y Color).
  Expediente RF-04 real con GET /equipos/:id/ordenes (columnas: N° orden, fecha, técnico,
  diagnóstico, estado; repuestos se elimina del expediente porque el JOIN no expone la lista).
- TecnicosPage: listTecnicos() + listOrdenes() para las tarjetas de stats y las "órdenes actuales"
  por técnico. Alta vía createTecnico({nombre, activo}). El campo "Cargo/Especialidad" se eliminó
  del formulario porque la tabla tecnico no lo persiste (@REVISAR si se quiere en el futuro).
- TecnicoHistorialModal: listOrdenes({tecnicoId}) real filtrado a ENTREGADO/LISTO_ENTREGA.
  (Nota: la tarjeta "Ver todas las órdenes" sigue con alert; redirección a /tecnico con
  preselección queda como @REVISAR en FASE 6.)

### Limpieza de lint preexistente (de paso, FASE 6)
- OrdenEnvioModal: quitado `import React` sin usar.
- ClienteDetalleModal: quitados CheckCircle2/Clock sin usar; useMemo movido ANTES del early return.
- TecnicoHistorialModal: useMemo movido antes del early return; quitado CheckCircle2.
- modalData.js: quitado import ORDER_STATUS sin usar.
- reportesData.js: quitado import getTecnicoNombre sin usar.
- ReportesPage: ReportContent extraído a nivel de módulo (era componente creado durante el render).

### Verificación FASE 5-2 (curl, todo OK):
- POST /equipos (auth) con tipo_equipo/id_cliente/contadores -> id_equipo nuevo ✅
- GET /equipos (público) -> expone cliente_nombre ✅
- GET /clientes/1/ordenes y /clientes/1/equipos (auth) -> JOIN real ✅
- GET /equipos/:id/ordenes (público) ✅
- POST /tecnicos {nombre, activo} (auth) -> id_tecnico nuevo ✅
- Limpieza: se borraron el equipo y el técnico de prueba (BD vuelve a seeds) ✅
- lint: 0 errores (los 8 preexistentes ahora corregidos) ✅
- build (vite): OK ✅

ERROR/PROBLEMA observado en pruebas: con `-d` literal de curl.exe en PowerShell el JSON se
rompía (body: {nombre:Eloy...}) -> 500. Solución: usar siempre --data-binary "@archivo.json".

---

## FASE 5-3 — Dashboard + Reportes conectados al backend (COMPLETADA ✅)

Cambios frontend:
- DashboardPage: KPIs (contadores por estado) y tabla "Órdenes en Flujo" desde GET /ordenes reales
  (antes mockOrdenes). Botón refrescar.
- ReportesPage:
  - Tab LIQUIDACION: usa GET /reportes/servicios real (auth). Fila -> {codigo, tecnico (tecnico_nombre),
    cliente, equipo (marca+modelo), serial, trabajoRealizado, fechaIngreso, montoTotal}.
    El filtro de técnico pasa a valor = id_tecnico (options desde GET /tecnicos/publicos); antes comparaba por nombre.
  - Tab RESPALDOS: botón "Respaldo" ahora llama GET /backup real y descarga un .sql (antes generaba JSON
    local con mocks). Se quitó la nota de "Último respaldo automático" (no hay job) -> se indica "Manual".
  - Tab LOGS: se mantiene con data mock (mockAuditLogsData) marcado como '@REVISAR FASE 6':
    NO existe endpoint de auditoría en el backend.
  - ReportContent extraído a nivel de módulo y recibe las filas por props (React no permite crear
    componentes durante el render).

### Problema 5.3.1 — /backup fallaba: pg_dump no estaba en el PATH del proceso Windows
Síntoma: GET /backup -> 500 "Verifique que pg_dump esté instalado y accesible".
Causa: el controller ejecutaba `pg_dump` vía exec() (cmd) y el binario no está en el PATH del
proceso node; además el quoting `"pg_dump"` en cmd rompe el comando.
Solución aplicada (controllers/backup.js):
- resolverPGDump(): prueba rutas absolutas conocidas existentes
  (PG_DUMP_PATH, C:\Program Files\PostgreSQL\{18,17,16,15}\bin\pg_dump.exe) y solo cae a
  `pg_dump` del PATH si ninguna existe. Si tiene ruta con separador, se cotillea en el comando.
Verificado: GET /backup (auth) devuelve dump SQL de la BD (18.6) incluyendo las columnas nuevas
de equipo (tipo_equipo etc.) ✅

### Verificación FASE 5-3 (flujo E2E con orden temporal, todo OK):
- POST /ordenes (ORD-2026-003) -> EN_DIAGNOSTICO -> /servicios/{id} (nota) -> SOLUCION_COTIZACION
  -> /cotizacion {aprobada:true} -> LISTO_ENTREGA -> ENTREGADO (monto_cobro 95.50, fecha_salida auto) ✅
- GET /reportes/servicios lista la orden entregada con JOINs (tecnico/cliente/equipo/nota) ✅
- DELETE de la orden temporal -> /reportes/servicios vuelve a [] (BD limpia, seeds intactos) ✅
- GET /backup -> dump SQL válido ✅
- lint: 0 errores ✅
- build (vite): OK ✅

---

## FASE 6 — Limpieza de mocks muertos (COMPLETADA ✅)

- Eliminados de frontend/src/data/: clientesData.js, equiposData.js, ordenesData.js,
  tecnicosData.js, modalData.js (nada los referenciaba tras FASE 5-1/5-2/5-3).
- OrdenesPage y TecnicosOrdenesPage importan ORDER_STATUS directamente de utils/status.
- reportesData.js queda solo con mockAuditLogsData (usado por el tab LOGS de ReportesPage)
  con comentario @REVISAR FASE 7: no hay endpoint de auditoría en el backend.
- lint: 0 errores ✅ | build: OK ✅

---

## FASE 7 — Verificación final (COMPLETADA ✅)

- Tests de ReportesPage actualizados para la versión conectada al API:
  - Se mockean ../api/reportes (reporteServicios/descargarBackup) y ../api/entidades
    (listTecnicosPublicos), y 'react-to-print' (la página ya usa useReactToPrint, ya no
    window.print()).
  - Se verifican métricas calculadas reales ($135.50 total, ticket $67.75) en vez de títulos
    vacíos de mocks.
- vitest: 10/10 tests en verde (3 archivos).
- lint: 0 errores ✅ | build production: OK ✅
- Smoke E2E final (backend en caliente): login admin ✅, /ordenes ✅, /reportes/servicios ✅,
  /clientes (3) ✅, /equipos (3) ✅, /tecnicos/publicos (2) ✅, /backup devuelve dump SQL ✅.
- BD sin registros de prueba: quedan las 3 órdenes seed (solo 1 y 2 activas), 3 clientes,
  3 equipos, 2 técnicos originales. ✅

Notas pendientes (no bloquean): tab LOGS de ReportesPage sigue con data mock (@REVISAR):
no existe endpoint de auditoría en el backend. La vista técnica usa métodos de escritura
expuestos (decidido en FASE 5a) y Login no distingue rol por ahora.
---

## FASE 8 — Auditoría real + aclaración de acceso por roles (COMPLETADA ✅)

Entregado a petición del usuario: bitácora real (RNF-07). ACLARACIÓN CLAVE (según PROPUESTA.txt
y decisión del usuario): los TECNICOS NO tienen usuario ni login; usan SIEMPRE la vista
COMUNITARIA (sin credenciales, con toda la funcionalidad: lectura y escritura). El login es
SOLO para ADMINISTRADOR/RECEPCION. RNF-05 se cumple restringiendo la gestión administrativa
al admin logueado y limitando al técnico a su estación.

### Corrección de un malentendido previo
- Se habia creado (version previa de esta FASE) usuarios TECNICO de login (Pedro Martínez y
  Luis Sánchez) y la columna usuario.id_tecnico para "personalizar" la estación. El usuario
  lo descarto: los técnicos no inician sesion.
- Revert aplicado SIN migracion nueva: se edito init-db/08 (ya no crea esas cuentas ni la
  columna) y se ejecuto directo en la BD local:
    DELETE FROM usuario WHERE rol='TECNICO';   (2 filas)
    ALTER TABLE usuario DROP COLUMN IF EXISTS id_tecnico;
  Quedan solo admins: maria, danirys, jesus.
- auth.js: guard defensivo -> si existiera un usuario rol TECNICO responde 401
  "Los técnicos usan la vista comunitaria (sin login)"; el token ya no lleva id_tecnico.

### Backend (lo que queda)
- init-db/08: tabla log_auditoria + GRANTs para el rol admin (la tabla la crea postgres,
  sin GRANT el rol admin recibe 42501). Aplicada a la BD local.
- utils/auditoria.js: registrarAuditoria(req, {modulo, accion, detalles, usuario}) con try/catch
  silencioso (nunca rompe la operacion). id_usuario = actor.id_usuario ?? actor.id; rol por
  defecto "SISTEMA" (acciones comunitarias quedan sin usuario).
- models/controllers/routes de auditoria (nuevos); app.js monta /auditoria solo admin.
- Nuevos eventos auditados: ordenes (crear, cambio de estatus, asignacion de tecnico, cotizacion
  aprobada/rechazada, cambio de tecnico, factura, eliminar), servicio (crear/patch/delete),
  repuesto (crear/delete), clientes/equipos/tecnicos/usuarios (crear/patch/delete), backup, login.
- Login (auth.js): registra "Inicio de sesion" en auditoria (con id_usuario correcto).
- Politica de acceso: POST/PATCH/DELETE de /ordenes /servicios /repuestos /equipos ABIERTOS
  (sin token) para que la vista comunitaria funcione; GET publicos; la gestion exclusiva
  (/clientes /tecnicos /usuarios /reportes /backup /auditoria) es solo ADMIN_RECEPCION.

### Frontend
- LoginPage: "Ingresa tus credenciales de administrador", placeholder jesus; se mantiene el
  boton de Acceso Interfaz Técnica Comunitaria (sin credenciales).
- AppRoutes: tras login SIEMPRE /dashboard; guard del dashboard reforzado exige rol
  ADMIN_RECEPCION Y currentUser (sesion real); /ordenes y /equipos exigen sesion;
  /clientes /tecnicos /reportes solo admin; "/" va a /login si no hay sesion.
- TecnicosOrdenesPage: vista comunitaria pura - selector de tecnico libre, toggle
  "solo mis ordenes / todas" manual. Sin personalizacion por usuario (no hay login de tecnico).
- ReportesPage tab LOGS: consume GET /auditoria real via listAuditoria() (api/reportes.js);
  mapeo LOG-x, fecha legible, usuario_nombre||rol, modulo, accion, detalles; filtro de modulo
  con los 9 modulos del backend. Se elimino data/reportesData.js (y mockAuditLogsData).
- ReportesPage.test.jsx: mock de listAuditoria agregado + test nuevo del tab LOGS (11 tests).

### Verificacion
- cURL: login jesus -> 200 (token, rol ADMIN_RECEPCION, respuesta SIN id_tecnico);
  login Pedro Martínez -> 401 (cuenta eliminada); POST/PATCH/DELETE /ordenes sin token -> 200
  (comunitaria OK, con limpieza); /clientes /auditoria /backup sin token -> 401;
  /auditoria admin -> 200 (36 eventos con actor/rol/modulo correctos).
- BD: solo usuarios ADMIN_RECEPCION (maria, danirys, jesus).
- lint: 0 errores | vitest: 11/11 | build production: OK.
- Puertos vivos: :3000 (backend) y :5173 (vite dev).

---

## FASE 9 — Calidad de datos, UX de cotización/entrega y tiempo real (COMPLETADA ✅)

### 1. Normalizacion al escribir en la BD (sin comas, todo minusculas)
- utils/text.js: sanitizeForApi() ahora TAMBIEN elimina comas (ademas de acentos,
  minusculas y colapso de espacios).
- api/mappers.js: denormalizeOrdenPayload() y denormalizeNotaPayload() sanitizan el texto
  de usuario (tipo_servicio, falla_reportada, diagnostico, trabajo, observaciones).
  El campo "estado" JAMAS pasa por ahi (se envia directo como enum, no sanitiza).
- api/entidades.js: createCliente() / createEquipo() (incluye nro_serial) / createTecnico()
  sanitizan antes de enviar. Las busquedas siguen comparando con toUpperCase, ningun break.
- utils/text.test.js: 3 tests nuevos (comas eliminadas + valores no string). Total 8/8.
  Nota: sanitizeForApi(undefined) con parametro por defecto devuelve '' (no undefined).

### 2. Cotizacion: el modal se cierra con aviso (Toast) al aprobar/rechazar
- components/common/Toast.jsx (NUEVO): aviso flotante autohide 4s (exito/error + boton cerrar).
- OrdenDetalleModal.jsx: nueva prop onNotify; al aprobar -> "Cotización aprobada. La orden
  volvió a la vista del técnico" y cierra; al rechazar -> "Cotización rechazada. La orden fue
  cancelada" y cierra.
- OrdenesPage.jsx y DashboardPage.jsx: toast + onNotify; Dashboard ahora pasa
  onUpdateOrder={reload} (era la causa raiz del modal colgado: aprobaba pero nada refrescaba).

### 3. Reporte de pago de tecnicos: incluye LISTO_ENTREGA + ENTREGADO
- controllers/reportes.js: serviciosPorTecnico() -> WHERE o.estado IN ('LISTO_ENTREGA',
  'ENTREGADO') (antes: fecha_salida IS NOT NULL, dejaba fuera las listas); el rango de fechas
  ahora filtra por fecha_ingreso (consistente con el filtro del frontend); SELECT ahora trae
  o.estado. liquidacionPorTecnico() igual (estado en vez de fecha_salida).
- ReportesPage.jsx: mapeo agrega "estado" + nueva columna "Estado" con StatusBadge
  (nuevo import).

### 4. Entrega: factura opcional + cierre automatico con aviso
- OrdenDetalleModal.jsx: campo "N° Factura (opcional)" en el formulario de entrega; handleDeliver
  solo envia numero_factura si trae numeros (parseInt de digitos, evita "abc"); tras guardar
  cierra el modal y avisa con el numero de factura registrado.

### 5. Tiempo real por WebSockets (backend + frontend)
- Backend: dependencia "ws" instalada; utils/realtime.js (NUEVO): WebSocketServer en la ruta
  /ws sobre el MISMO http.Server del app.listen; token OPCIONAL (vista comunitaria sin login);
  si el token es invalido -> close 4001; heartbeat 30s para limpiar muertas; notificarOrdenes()
  emite {type:'ordenes:update'} a todos.
- app.js: captura el server de app.listen y llama setupRealtime(server).
- Emisores del evento: OrdenController (create, update, patch, delete, responderCotizacion
  aprobada/rechazada, cambiarTecnico, registrarFactura), ServicioController (create, update,
  patch), DetalleRepuestoController (create, delete).
- Frontend: api/realtime.js (NUEVO). WebSocket nativo (sin dependencia). Gestor singleton por
  pestana: un solo socket, suscriptores Set, reconexion con backoff (1s->15s), reconexion al
  cambiar el token (sessionStorage), no conecta si window undefined (tests). Hook
  useOrdenesRealtime(cb, deps) -> el ref se actualiza dentro de un useEffect (regla
  react-hooks/refs de eslint) y la suscripcion se recrea con las deps.
- Páginas suscritas: OrdenesPage, TecnicosOrdenesPage y DashboardPage -> recarga SILENCIOSA
  (re-fetch sin tocar loading, mantiene filtros/tabs/modal abiertos).

### Verificacion (FASE 9)
- Login jesus -> 200 (sin regresion; se detecto y descarto un falso 500 por quoting de curl).
- Reporte con datos de prueba: filas LISTO_ENTREGA (sin fecha_salida) y ENTREGADO aparecen,
  con campo estado. Registros de prueba eliminados; la BD queda con las ordenes reales
  (ORD-2026-001 CANCELADO, ORD-2026-003 y ORD-2026-004 ENTREGADO).
- WebSocket: conexion /ws OK; al crear y borrar una orden de prueba llegan 2 mensajes
  "ordenes:update"; token invalido -> close 4001. La orden ORD-2026-005 de prueba fue eliminada.
- Frontend: lint 0 errores | vitest 13/13 | build production OK.
- Backend reiniciado con el codigo de la FASE 9 (boot sin errores, escucha en :3000).

---

## FASE 10 — Factura en detalle, aviso estilizado y activar/desactivar técnico (COMPLETADA ✅)

### 1. N° Factura visible al consultar una orden (RF-10 en UI)
- OrdenDetalleModal.jsx: en la barra inferior (Técnico Asignado / Contador Inicial) se agrego
  el item "N° Factura" (icono Hash verde) cuando order.numeroFactura existe (ya venia del JOIN
  via normalizeOrden -> raw.numero_factura). La barra pasa a flex-wrap para acomodar 3 items.
- Como Control de Órdenes y Dashboard Panel de Control usan el MISMO modal, el cambio cubre
  ambos sitios. NO se agrego columna en las tablas (decision del usuario: solo al consultar).

### 2. "Ver todas las órdenes" estilizado (se elimino el alert())
- components/modals/TecnicoOrdenesModal.jsx (NUEVO): reutiliza Modal + StatusBadge (mismo
  estilo de TecnicoHistorialModal), muestra "Órdenes Activas - {nombre}" con N° Orden + Estatus.
- TecnicosPage.jsx: el alert() de "apertura" se reemplaza por abrir el modal (handleViewOrdenes).
  Los alert() de error que quedan en otros modales no se tocaron (fuera de alcance).

### 3. Activar / Desactivar técnico desde la UI (sin tocar la BD)
- Backend: NO requirio cambios (PATCH /tecnicos/:id ya acepta "activo" via whitelist, solo admin).
- api/entidades.js: nuevo updateTecnico(id, { activo }) -> PATCH /tecnicos/:id con auth.
- TecnicoCard.jsx: boton reutilizando Button con icono Power -> "Desactivar" (variant danger)
  si esta Activo, "Activar" (variant primary) si no.
- TecnicosPage.jsx: handleToggleStatus llama updateTecnico, actualiza la lista en memoria y
  avisa con el Toast de la FASE 9 ("Técnico X activado/desactivado"); guard contra doble click.

### Verificacion (FASE 10)
- PATCH /tecnicos/1 activo:false (con token) -> 200 y GET /tecnicos/publicos LO EXCLUYE;
  activo:true -> 200 y vuelve a aparecer. Quedo reactivado (4 tecnicos visibles).
- Flujo E2E de entrega con factura (orden temporal ORD-2026-011): REGISTRADO -> EN_DIAGNOSTICO
  (con tecnico) -> SOLUCION_COTIZACION -> aprobada (PROCESO_TECNICO) -> LISTO_ENTREGA ->
  nota completa (PATCH /servicios, exigido por RN-04) -> ENTREGADO con contador_final,
  monto_cobro y numero_factura=12345. GET /ordenes/11 (JOINs) devuelve numero_factura=12345,
  por lo que el modal de Control y Dashboard lo renderiza como "N° Factura".
  Registros de prueba eliminados (orden, nota en cascada, equipo SN-FAC*, cliente V-99999999);
  sin restos en la BD.
- Frontend: lint 0 errores | vitest 13/13 | build production OK.
- El backend temporal usado para las pruebas se detuvo: el puerto :3000 quedo libre para
  correr "npm run dev" sin EADDRINUSE.

---
