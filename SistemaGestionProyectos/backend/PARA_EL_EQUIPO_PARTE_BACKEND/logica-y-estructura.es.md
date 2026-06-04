# 🏢 Guía técnica del proyecto

> Guía para entender la estructura y la lógica del Sistema de Gestión de Proyectos.  
> Dirigida a todos los integrantes del equipo.

---

## ¿Qué es nuestro proyecto?

Nuestro proyecto es un **sistema de gestión de proyectos** para una consultora. El objetivo es:

- Que los empleados de la empresa entren al sistema con sus cuentas.
- Registren a los **clientes** con los que trabajan.
- Creen **proyectos** (para un cliente, o internos sin cliente).
- Agreguen **tareas** dentro de cada proyecto para organizar el trabajo.

---

## 🧩 Las 4 entidades del sistema

Todo gira alrededor de **4 entidades principales**:

### 1️⃣ Usuario (`Usuario`)

Empleado de la empresa que entra al sistema. Ejemplo:

- Nombre de usuario: `juan.perez`
- Clave: `********` (encriptada)
- Estado: `ACTIVO`

> Solo los usuarios activos pueden iniciar sesión.

### 2️⃣ Cliente (`Cliente`)

La empresa o persona que paga por un servicio. Ejemplo:

- Nombre: `Banco Nacional`
- Estado: `ACTIVO`

### 3️⃣ Proyecto (`Proyecto`)

El trabajo que realiza la consultora. Ejemplo:

- Nombre: `Sitio web del banco`
- Estado: `ACTIVO`
- Cliente: `Banco Nacional` (o vacío si es interno)

### 4️⃣ Tarea (`Tarea`)

Un paso pequeño dentro de un proyecto. Ejemplo:

- Descripción: `Diseñar página de login`
- Estado: `PENDIENTE`
- Proyecto: `Sitio web del banco`

---

## 🔗 ¿Cómo se relacionan estas entidades?

```
Usuario "juan.perez"
       │
       │ (entra al sistema con JWT)
       ▼
Cliente "Banco Nacional"
       │
       │ (tiene varios proyectos)
       ▼
Proyecto "Sitio web del banco"
       │
       │ (contiene varias tareas)
       ▼
Tarea "Diseñar página de login"
Tarea "Implementar autenticación"
Tarea "Conectar con API del banco"
```

O el caso del proyecto interno (sin cliente):

```
Proyecto "Mejora interna del CRM"  ← sin cliente
       │
       ▼
Tarea "Actualizar dependencias"
Tarea "Refactorizar módulo X"
```

---

## 🚪 ¿Cómo arranca todo? (flujo real)

### Escenario: Juan entra a trabajar a la mañana

#### Paso 1: Login

Juan abre la aplicación y mete sus datos:

```http
POST /api/v1/auth
Content-Type: application/json

{
  "nombre": "juan.perez",
  "clave": "miClave123"
}
```

Qué pasa en el código:

- El request llega a `auth.controller.ts`.
- Se lo pasa a `auth.service.ts`.
- `auth.service.ts` busca a Juan en la tabla `usuarios` vía `usuarios.service.ts`.
- Compara la clave ingresada con la encriptada en la base de datos.
- Si coinciden → genera un JWT válido por 8 horas.

```json
{ "accessToken": "eyJhbGc..." }
```

#### Paso 2: Juan ve la lista de proyectos

```http
GET /api/v1/proyectos
Authorization: Bearer eyJhbGc...
```

Qué pasa:

- `AuthGuard` valida primero el token → ✅.
- `proyectos.controller.ts` recibe el request.
- Llama a `proyectos.service.ts` → función `obtenerProyectos()`.
- El service le pide a **TypeORM** que traiga todos los proyectos con sus clientes.
- Devuelve una lista en formato `ListProyectoDTO[]`:

```json
[
  { "id": 1, "nombre": "Sitio web del banco", "estado": "ACTIVO", "cliente": {} },
  { "id": 2, "nombre": "Mejora interna del CRM", "estado": "ACTIVO" }
]
```

#### Paso 3: Juan crea un cliente nuevo

```http
POST /api/v1/clientes

{ "nombre": "Empresa Nueva SA" }
```

Qué pasa:

- `clientes.controller.ts` → `clientes.service.ts` → `crearCliente()`.
- El service crea un objeto `Cliente` y le pone estado `ACTIVO` automáticamente.
- TypeORM lo guarda en la tabla `clientes` y devuelve el id nuevo.

#### Paso 4: Juan crea un proyecto para el nuevo cliente

```http
POST /api/v1/proyectos

{ "nombre": "Aplicación móvil", "idCliente": 7 }
```

Qué pasa:

- `proyectos.service.ts` → `crearProyecto()`.
- **Antes de guardar, valida:** ¿el cliente con id 7 existe y está activo?
  - Llama a `clientesService.existeClienteActivoPorId(7)`.
  - Si no → rechaza con `BadRequestException`.
  - Si sí → guarda el proyecto con estado `ACTIVO`.

#### Paso 5: Juan agrega una tarea al proyecto

```http
POST /api/v1/proyectos/15/tareas

{ "descripcion": "Diseñar interfaz de usuario" }
```

Qué pasa:

- `tareas.controller.ts` toma el id del proyecto de la URL (`15`) y el DTO del body.
- `tarea.service.ts` → `crearTarea()`.
- Crea la tarea con estado `PENDIENTE` automáticamente, asociada al proyecto 15.

#### Paso 6: La tarea terminó → Juan actualiza el estado

```http
PUT /api/v1/proyectos/15/tareas/89

{ "estado": "FINALIZADA" }
```

#### Paso 7: Juan quiere "eliminar" una tarea

> ⚠️ En nuestro sistema, el borrado físico no existe.

```http
PUT /api/v1/proyectos/15/tareas/90

{ "estado": "BAJA" }
```

La tarea no se borra de la base de datos. Queda guardada con estado `BAJA`, no aparece como activa, pero el historial se mantiene.

---

## 🛡️ Las reglas inteligentes del sistema

Nuestro sistema tiene controles que previenen errores:

### Regla 1: No se puede asociar un proyecto a un cliente que no esté activo

```
Juan intenta: POST /proyectos { "idCliente": 5 }
         ▼
proyectos.service.ts valida:
  ¿el cliente 5 está activo?
         ▼
       ❌ no (estado = BAJA)
         ▼
Rechaza: "Se debe especificar un cliente activo"
```

Razón lógica: no podés iniciar trabajo nuevo para un cliente que ya se fue de la empresa.

### Regla 2: No se puede dar de baja un cliente que tiene proyectos

```
Juan intenta: PUT /clientes/3 { "estado": "BAJA" }
         ▼
clientes.service.ts valida:
  ¿el cliente 3 tiene proyectos activos o finalizados?
         ▼
       ✅ sí
         ▼
Rechaza: "No se puede dar de baja un cliente con proyectos relacionados"
```

Razón lógica: no perdés el registro de clientes con los que trabajaste.

### Regla 3: Proyectos internos sin cliente

```
Juan intenta: POST /proyectos { "nombre": "Mejora interna" }
        (sin idCliente)
         ▼
proyectos.service.ts valida:
  no hay idCliente → no valida cliente
         ▼
Guarda el proyecto con id_cliente = NULL
         ▼
✅ Proyecto interno
```

### Regla 4: Filtrado por estado

Al pedir la lista de clientes, podés filtrarla:

```
GET /clientes?estado=ACTIVO  ← solo los clientes activos
GET /clientes?estado=BAJA    ← solo los dados de baja
GET /clientes                ← todos
```

---

## 📂 ¿Por qué este orden de carpetas?

La estructura del proyecto no es arbitraria. Cada carpeta tiene un sentido:

```
modules/
  ├── auth/              ← todo lo relacionado a la identidad del usuario
  │
  └── gestion/           ← todo lo relacionado al trabajo diario
      ├── clientes       ← clientes de la consultora
      ├── proyectos      ← proyectos que ejecuta la consultora
      └── tareas         ← tareas que componen cada proyecto
```

**¿Por qué separamos `auth` de `gestion`?**

Porque resuelven dos problemas distintos:

- `auth` responde a la pregunta: **"¿Quién sos?"**
- `gestion` responde a la pregunta: **"¿Qué querés hacer?"**

Si mañana decidimos cambiar la forma de login (por ejemplo, usar Google OAuth), modificamos solo `auth` y no tocamos `gestion`.

---

## 🔄 ¿Por qué separamos Controller y Service?

En nuestro sistema, al crear un proyecto, el código pasa por dos capas:

### Capa 1: `proyectos.controller.ts`

```
recibe HTTP
pasa los datos
devuelve la respuesta
```

**No hace nada lógico.**

### Capa 2: `proyectos.service.ts`

```
valida que el cliente esté activo
pone el estado por defecto
guarda en la base de datos
```

**Toda la lógica está acá.**

**¿Por qué este corte?**

Imaginate que en el futuro querés crear un proyecto desde una **tarea programada (cron)** en vez de HTTP. Si la lógica estuviera en el Controller, tendrías que repetirla. Pero como está en el Service, llamás directamente a `proyectosService.crearProyecto()` desde donde quieras.

---

## 🎯 ¿Por qué DTOs (Data Transfer Objects)?

En nuestro sistema, cuando llega un request para crear un proyecto, los datos vienen del mundo exterior. **No se puede confiar en ellos.**

`CreateProyectoDto` define:

- `nombre`: tiene que ser un string no vacío.
- `idCliente`: número opcional.

```
Juan manda datos → ValidationPipe los valida con class-validator
                     ▼
           ✅ correctos → siguen al Controller
           ❌ inválidos → 400 Bad Request automático
```

Los DTOs protegen el sistema de datos malos antes de que lleguen a la base.

---

## 💾 ¿Cómo guarda el sistema en la base de datos?

Nuestro sistema no escribe SQL a mano. Usa **TypeORM** que traduce el código a SQL automáticamente:

### Código en `proyectos.service.ts`:

```ts
const proyecto = this.repository.create(dto);
proyecto.estado = EstadosProyectosEnum.ACTIVO;
await this.repository.save(proyecto);
```

### Lo que hace TypeORM realmente:

```sql
INSERT INTO proyectos (nombre, estado, id_cliente)
VALUES ('Aplicación móvil', 'ACTIVO', 7)
RETURNING id;
```

Cada **Entity** del sistema = una tabla en la base de datos:

- `Usuario` → tabla `usuarios`
- `Cliente` → tabla `clientes`
- `Proyecto` → tabla `proyectos`
- `Tarea` → tabla `tareas`

---

## 🔐 El recorrido del JWT en el sistema

Cuando Juan se loguea, recibe un token con su info:

```json
{
  "nombre": "juan.perez",
  "sub": 12,
  "iat": 1715000000,
  "exp": 1715028800
}
```

En cada request siguiente:

```
Juan manda el token en el header
         ▼
AuthGuard lo decodifica
         ▼
Valida: ¿el token es correcto? ¿no está vencido?
         ▼
✅ Mete los datos de Juan en request['usuario']
   y permite que el request llegue al Controller
```

> Nota: actualmente en el sistema no se usa la info de `request['usuario']` en ningún lado. Solo nos aseguramos de que el request venga de un usuario logueado. Eso cumple con el requisito:  
> *"Todos los proyectos, clientes y tareas son visibles para todos los usuarios"*

---

## 📊 Tabla de rutas (URLs) disponibles

| Método | Ruta | Función | ¿Requiere JWT? |
|--------|------|---------|----------------|
| `POST` | `/api/v1/auth` | Login | ❌ no |
| `POST` | `/api/v1/clientes` | Crear cliente | ✅ sí |
| `PUT` | `/api/v1/clientes/:id` | Editar cliente | ✅ sí |
| `GET` | `/api/v1/clientes` | Listar clientes | ✅ sí |
| `POST` | `/api/v1/proyectos` | Crear proyecto | ✅ sí |
| `PUT` | `/api/v1/proyectos/:id` | Editar proyecto | ✅ sí |
| `GET` | `/api/v1/proyectos` | Listar proyectos | ✅ sí |
| `GET` | `/api/v1/proyectos/:id` | Detalle de un proyecto | ✅ sí |
| `POST` | `/api/v1/proyectos/:id/tareas` | Agregar tarea | ✅ sí |
| `PUT` | `/api/v1/proyectos/:id/tareas/:idTarea` | Editar tarea | ✅ sí |

---

## 🎭 Estados posibles (Enums)

```
Usuarios:   ACTIVO  /  BAJA
Clientes:   ACTIVO  /  BAJA
Proyectos:  ACTIVO  /  FINALIZADO  /  BAJA
Tareas:     PENDIENTE  /  FINALIZADA  /  BAJA
```

🌟 **Muy importante:** **¡no existe el borrado físico en el sistema!**  
"Eliminar" = cambiar el estado a `BAJA` (borrado lógico).

**¿Por qué?** Porque en un sistema de gestión profesional querés mantener la historia. Nunca borrás.

---

## 🎁 Resumen en nuestro contexto real

| Pregunta | Respuesta |
|----------|-----------|
| ¿Quién entra al sistema? | Empleados (`Usuario`) vía JWT |
| ¿Qué administran? | Clientes, proyectos, tareas |
| ¿Hay borrado físico? | No, solo estado `BAJA` (borrado lógico) |
| ¿Puede haber un proyecto sin cliente? | Sí, sería un proyecto interno |
| ¿Se puede dar de baja un cliente con proyectos? | No |
| ¿Se puede asociar un proyecto a un cliente no activo? | No |
| ¿Quién ve los datos? | Todos los usuarios activos (no hay propiedad) |
| ¿Cuántos módulos hay? | Dos: `auth` y `gestion` |
| ¿Por qué están separados? | Cada uno resuelve un problema distinto |

---

## 🛠️ Tecnologías usadas

| Tecnología | Uso |
|------------|-----|
| **NestJS** | Framework principal del backend |
| **TypeORM** | ORM para hablar con la base de datos |
| **PostgreSQL** | Base de datos |
| **JWT** | Autenticación (tokens) |
| **bcrypt** | Encriptación de claves |
| **class-validator** | Validación de datos de entrada |
| **Swagger** | Documentación de la API |
| **Helmet** | Protección HTTP |

---

> 📝 **Esta guía existe para que todos los integrantes del equipo entiendan el proyecto de la misma forma.**  
> Si tenés una duda, preguntá antes de modificar.
