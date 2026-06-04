<h1 align="center" style="color:#F59E0B">Sistema de Gestión de Proyectos</h1>

<p align="center">
  <strong>Trabajo Final Integrador 2026</strong> · Tecnicatura Universitaria en Desarrollo Web<br>
  Aplicación web full stack para la gestión de clientes, proyectos y tareas de una consultora, con autenticación JWT, reglas de negocio y seis funcionalidades adicionales (una por integrante del equipo).
</p>

---

<h2 style="color:#FBBF24">Tabla de contenidos</h2>

1. [Descripción general](#descripción-general)
2. [Equipo y funcionalidades adicionales](#equipo-y-funcionalidades-adicionales)
3. [Stack tecnológico](#stack-tecnológico)
4. [Arquitectura](#arquitectura)
5. [Requerimientos del enunciado base](#requerimientos-del-enunciado-base)
6. [Estructura del repositorio](#estructura-del-repositorio)
7. [Requisitos previos](#requisitos-previos)
8. [Instalación y ejecución en local](#instalación-y-ejecución-en-local)
9. [URLs y credenciales](#urls-y-credenciales)
10. [API REST](#api-rest)
11. [Frontend — rutas y pantallas](#frontend--rutas-y-pantallas)
12. [Entorno de ejecución y servidores](#entorno-de-ejecución-y-servidores)
13. [Entrega académica](#entrega-académica-recordatorio)
14. [Licencia y autoría](#licencia-y-autoría)

---

<h2 style="color:#F59E0B">Descripción general</h2>

El sistema permite que los empleados de la consultora:

- Inicien sesión de forma segura.
- Registren y administren **clientes**.
- Crean y gestionen **proyectos** asociados a un cliente activo o como proyectos **internos** (sin cliente).
- Agreguen y actualicen **tareas** dentro de cada proyecto.
- Consulten un **dashboard** con estadísticas y gráficos.

No existe borrado físico: las bajas se realizan mediante cambio de estado (`BAJA`). Todos los usuarios activos visualizan los mismos datos (sin propiedad por registro).

---

<h2 style="color:#4ADE80">Equipo y funcionalidades adicionales</h2>

El grupo está conformado por **6 integrantes**. Según la consigna del TFI, **cada integrante agregó una funcionalidad adicional** al sistema. Las seis corresponden a expansiones sugeridas por la cátedra y están implementadas en el código.

Completar la columna **Integrante** con nombre y apellido (debe coincidir con la presentación del video de entrega).

| RF | Funcionalidad adicional | Integrante | Alcance técnico |
|----|------------------------|------------|-----------------|
| **RF15** | Estadísticas globales | _[Nombre Apellido]_ | Backend: `GET /api/v1/estadisticas`. Frontend: dashboard con KPIs y gráficos (Chart.js + PrimeNG). |
| **RF19** | Datos de contacto de clientes | _[Nombre Apellido]_ | Campos opcionales `telefono` y `email` en clientes (API + formulario + columnas en listado). |
| **RF20** | Fecha de finalización de proyecto | _[Nombre Apellido]_ | Campo opcional `fechaFin`; validación si el estado es `FINALIZADO`; visualización en listados y detalle. |
| **RF16** | Búsqueda avanzada | _[Nombre Apellido]_ | Filtrado, ordenamiento y paginación en tablas de proyectos, clientes y tareas (PrimeNG Table, 100 % frontend). |
| **RF17** | Exportación a CSV | _[Nombre Apellido]_ | Descarga de datos visibles (tras filtros) en proyectos, clientes y tareas; helper `shared/csv-export.ts`. |
| **RF18** | Panel visual de tareas (Kanban) | _[Nombre Apellido]_ | Vista `/proyectos/:id/tareas/kanban` con drag-and-drop entre columnas por estado (`@angular/cdk`). |

**Expansiones sugeridas no implementadas** (por complejidad): historial de cambios, configuración de roles, gestión de metas intermedias.

---

<h2 style="color:#60A5FA">Stack tecnológico</h2>

| Capa | Tecnología | Versión referencia |
|------|------------|-------------------|
| Backend | NestJS | 11.x |
| ORM | TypeORM | 0.3.x |
| Base de datos | PostgreSQL | — |
| Autenticación | JWT + bcrypt | — |
| Validación API | class-validator | — |
| Documentación API | Swagger (opcional vía `.env`) | — |
| Frontend | Angular (standalone, zoneless) | 21.x |
| UI | PrimeNG (tema Aura — Midnight & Amber) | 21.x |
| Gráficos | Chart.js | 4.x |
| Kanban | Angular CDK (drag-drop) | 21.x |

**Tecnologías del enunciado académico:** NestJS, TypeORM, PostgreSQL, Angular, **nginx** y **PM2**.  
En este repositorio el flujo de desarrollo y la demostración del TFI se realizan en **entorno local** (ver [Entorno de ejecución y servidores](#entorno-de-ejecución-y-servidores)).

---

<h2 style="color:#C084FC">Arquitectura</h2>

```text
┌─────────────────────────────────────────────────────────────┐
│  Navegador — Angular 21 (http://localhost:4200)             │
│  Login · Dashboard · Clientes · Proyectos · Tareas · Kanban │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP /api/v1/*  (proxy en dev)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  NestJS (http://localhost:3000)                             │
│  auth · clientes · proyectos · tareas · estadísticas          │
└────────────────────────────┬────────────────────────────────┘
                             │ TypeORM
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL (localhost:5432) — base: gestion_proyectos       │
└─────────────────────────────────────────────────────────────┘
```

**Módulos backend**

- `auth` — login y JWT (`AuthGuard` en endpoints protegidos).
- `gestion` — clientes, proyectos, tareas y estadísticas.

**Patrón frontend:** componentes standalone, *api-clients* por dominio, `AuthStore` + `authInterceptor` + `authGuard`.

---

<h2 style="color:#F59E0B">Requerimientos del enunciado base</h2>

| Área | Cumplimiento |
|------|----------------|
| Acceso | Usuario con nombre, clave y estado; login devuelve JWT. |
| Proyectos | Alta, modificación, listado y detalle con tareas y cliente. Estados: `ACTIVO`, `FINALIZADO`, `BAJA`. |
| Clientes | Alta y modificación; solo clientes `ACTIVO` al asignar proyecto; baja de cliente solo si no tiene proyectos. |
| Proyectos internos | Proyecto sin `idCliente` (cliente nulo). |
| Tareas | Alta y modificación por proyecto; baja lógica con estado `BAJA`. |
| Visibilidad | Todos los usuarios ven todos los registros. |

---

<h2 style="color:#FBBF24">Estructura del repositorio</h2>

```text
SistemaGestionProyectos/
├── backend/                          # API NestJS
│   ├── src/
│   │   ├── main.ts                   # Arranque de la aplicación
│   │   ├── app.module.ts             # Módulo raíz y conexión a PostgreSQL
│   │   └── modules/
│   │       ├── auth/                 # Login, JWT, usuarios, AuthGuard
│   │       └── gestion/              # Clientes, proyectos, tareas, estadísticas
│   ├── Script_BD.sql                 # Esquema de BD + usuario inicial
│   ├── datos_prueba.sql              # Datos de ejemplo (opcional)
│   └── .env                          # Variables de entorno (local)
├── frontend/                         # SPA Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                 # Login, guard, interceptor, store
│   │   │   ├── dashboard/            # RF15 — Estadísticas
│   │   │   ├── template/             # Layout sidebar + topbar
│   │   │   ├── proyectos/            # Clientes, proyectos, tareas, kanban
│   │   │   └── shared/               # RF17 — Exportación CSV
│   │   ├── proxy.conf.json           # Proxy /api → backend en desarrollo
│   │   └── styles.css                # Estilos globales y tema
│   └── public/                       # Assets estáticos (logo, etc.)
└── README.md                         # Este archivo
```

---

<h2 style="color:#60A5FA">Requisitos previos</h2>

- **Node.js** y **npm** (recomendado npm 11+ en frontend).
- **PostgreSQL** en ejecución (puerto 5432 por defecto).
- Sistema operativo con bash o terminal equivalente.

---

<h2 style="color:#4ADE80">Instalación y ejecución en local</h2>

<h3 style="color:#FCD34D">1. Base de datos</h3>

```bash
sudo systemctl start postgresql   # Linux; ajustar según el SO

sudo -u postgres psql -c "CREATE DATABASE gestion_proyectos;"

cd backend

sudo -u postgres psql -d gestion_proyectos -f Script_BD.sql

# Opcional: datos de prueba
sudo -u postgres psql -d gestion_proyectos -f datos_prueba.sql
```

<h3 style="color:#FCD34D">2. Backend</h3>

```bash
cd backend
npm install
```

Configurar `backend/.env` (ejemplo):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<tu_clave_postgres>
DB_NAME=gestion_proyectos
DB_LOGGING=true
SWAGGER_HABILITADO=true
JWT_SECRET=<cadena_secreta_para_jwt>
```

```bash
npm run start:dev
```

<h3 style="color:#FCD34D">3. Frontend</h3>

```bash
cd frontend
npm install
npm start
```

El proxy (`frontend/src/proxy.conf.json`) redirige `/api/**` hacia `http://localhost:3000`.

---

<h2 style="color:#C084FC">URLs y credenciales</h2>

| Recurso | URL |
|---------|-----|
| Aplicación (frontend) | http://localhost:4200 |
| API base | http://localhost:3000/api/v1 |
| Swagger (si `SWAGGER_HABILITADO=true`) | http://localhost:3000/api |
| Compodoc backend (opcional) | http://localhost:8081 — `npm run compodoc` en `backend/` |

**Usuario de prueba** (creado por `Script_BD.sql`):

```text
Usuario: usuario
Clave:   clave
```

---

<h2 style="color:#F59E0B">API REST</h2>

Prefijo: `/api/v1`. Todos los endpoints requieren `Authorization: Bearer <token>` salvo el login.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth` | Iniciar sesión |
| `POST` | `/clientes` | Crear cliente |
| `PUT` | `/clientes/:id` | Actualizar cliente |
| `GET` | `/clientes?estado=` | Listar clientes (filtro opcional) |
| `POST` | `/proyectos` | Crear proyecto |
| `PUT` | `/proyectos/:id` | Actualizar proyecto |
| `GET` | `/proyectos` | Listar proyectos |
| `GET` | `/proyectos/:id` | Detalle de proyecto (incluye tareas) |
| `POST` | `/proyectos/:idProyecto/tareas` | Crear tarea |
| `PUT` | `/proyectos/:idProyecto/tareas/:id` | Actualizar tarea |
| `GET` | `/estadisticas` | Métricas globales (RF15) |

---

<h2 style="color:#60A5FA">Frontend — rutas y pantallas</h2>

| Ruta | Pantalla | Protegida |
|------|----------|-----------|
| `/login` | Inicio de sesión | No |
| `/dashboard` | Estadísticas y gráficos (RF15) | Sí |
| `/clientes` | Listado y gestión de clientes (RF19 en formulario) | Sí |
| `/proyectos` | Listado de proyectos (RF16, RF17, RF20) | Sí |
| `/proyectos/:id/tareas` | Tareas del proyecto (tabla) | Sí |
| `/proyectos/:id/tareas/kanban` | Vista Kanban (RF18) | Sí |

La raíz (`/`) redirige a `/dashboard`. Rutas desconocidas redirigen a `/login`.

**Características de UI:** tema oscuro Midnight & Amber, layout con sidebar y topbar, diseño responsive (tablas apiladas en móvil, menú lateral colapsable).

---

<h2 style="color:#FB7185">Entorno de ejecución y servidores</h2>

<h3 style="color:#FCD34D">Desarrollo y entrega del TFI</h3>

Cada integrante del equipo ejecuta el sistema en su propia máquina:

- **PostgreSQL** en local.
- **Backend:** `npm run start:dev` (puerto 3000).
- **Frontend:** `npm start` (puerto 4200).

Esta es la forma prevista para desarrollo, pruebas y **video de presentación** del trabajo (8–12 minutos), donde se demuestra el funcionamiento completo incluidas las seis funcionalidades adicionales.

<h3 style="color:#FCD34D">nginx y PM2</h3>

Forman parte del stack indicado en la consigna académica. La configuración y puesta en marcha de **nginx** y **PM2** se realiza a nivel **local** en cada integrante y se **demuestra en el video de presentación** del TFI. No es necesario desplegar un servidor remoto para clonar y ejecutar el proyecto en desarrollo.

En producción real, el patrón típico sería: Angular compilado servido por nginx, API NestJS gestionada con PM2 detrás de un proxy inverso. Para este TFI, la equivalencia funcional queda cubierta por el entorno local documentado arriba.

---

<h2 style="color:#4ADE80">Entrega académica (recordatorio)</h2>

- Grupo de **4 a 6** integrantes (este proyecto: **6**).
- Entrega en campus: **`.zip`** con código fuente + enlace al video.
- Video: **8–12 min**; todos con cámara y micrófono; cada integrante presenta **su** funcionalidad adicional identificándose.

---

<h2 style="color:#A1A1B5">Licencia y autoría</h2>

Proyecto académico — Tecnicatura Universitaria en Desarrollo Web, 2026.  
Código de autoría del equipo; uso según normas de la cátedra.
