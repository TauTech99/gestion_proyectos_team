CREATE TYPE estados_usuarios AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_clientes AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_proyectos AS ENUM ('ACTIVO','FINALIZADO','BAJA');
CREATE TYPE estados_tareas AS ENUM ('PENDIENTE','FINALIZADA','BAJA');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_clientes NOT NULL
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_proyectos NOT NULL,
    id_cliente INT,
    CONSTRAINT fk_proyectos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
);

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    estado estados_tareas NOT NULL,
    id_proyecto INT NOT NULL,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id)
);

CREATE TABLE historial_cambios (
    id SERIAL PRIMARY KEY,
    entidad TEXT NOT NULL,
    id_registro INT NOT NULL,
    accion TEXT NOT NULL,
    usuario_nombre TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

insert into usuarios (nombre, clave, estado) values ('usuario', crypt('clave', gen_salt('bf', 10)), 'ACTIVO');

-- RF19: Datos de contacto de clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefono TEXT NULL;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email TEXT NULL;

-- RF20: Fecha de finalización de proyecto
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS fecha_fin DATE NULL;

