-- CLIENTES (RF19: con telefono y email opcionales)
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Mercado Libre', 'ACTIVO', '011-4002-0000', 'contacto@mercadolibre.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('YPF', 'ACTIVO', '0800-222-9760', 'proyectos@ypf.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Globant', 'ACTIVO', '011-5050-3000', 'it@globant.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Arcor', 'ACTIVO', '0351-420-9000', 'compras@arcor.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Techint', 'ACTIVO', NULL, 'sistemas@techint.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Banco Galicia', 'ACTIVO', '0810-444-6400', 'tecnologia@bancogalicia.com');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Aerolíneas Argentinas', 'ACTIVO', '0810-222-8652', 'ti@aerolineas.com.ar');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('La Serenísima', 'ACTIVO', NULL, 'sistemas@laserenisima.com.ar');
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Cervecería y Maltería Quilmes', 'ACTIVO', '011-4319-3000', NULL);
INSERT INTO clientes (nombre, estado, telefono, email) VALUES ('Despegar', 'BAJA', NULL, NULL);

-- PROYECTOS (RF20: uno por cada cliente, con fecha_fin opcionales)
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('App Mobile Mercado Libre', 'ACTIVO', 1, '2026-09-30');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Plataforma de Gestión YPF', 'ACTIVO', 2, '2026-11-20');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Migración Cloud Globant', 'ACTIVO', 3, '2026-08-10');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Sistema de Stock Arcor', 'FINALIZADO', 4, '2026-03-01');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Portal de Proveedores Techint', 'ACTIVO', 5, '2026-10-05');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Portal Web Banco Galicia', 'ACTIVO', 6, '2026-07-15');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Sistema de Reservas Aerolíneas', 'ACTIVO', 7, NULL);
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('Trazabilidad La Serenísima', 'FINALIZADO', 8, '2026-02-28');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('App de Distribución Quilmes', 'ACTIVO', 9, '2026-12-01');
INSERT INTO proyectos (nombre, estado, id_cliente, fecha_fin) VALUES ('E-commerce Despegar', 'BAJA', 10, NULL);

-- TAREAS (proyecto 1 - App Mobile Mercado Libre)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Diseñar pantalla de login', 'FINALIZADA', 1);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Implementar API de usuarios', 'PENDIENTE', 1);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Testing en dispositivos', 'PENDIENTE', 1);

-- TAREAS (proyecto 2 - Portal Web Banco Galicia)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Maquetado del dashboard', 'FINALIZADA', 2);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Integración con API del Banco Galicia', 'PENDIENTE', 2);

-- TAREAS (proyecto 3 - Sistema de Stock Arcor)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Módulo de inventario', 'FINALIZADA', 3);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Reportes PDF', 'FINALIZADA', 3);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Capacitación usuarios', 'BAJA', 3);

-- TAREAS (proyecto 5 - Portal de Proveedores Techint)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Configurar servidor de staging', 'PENDIENTE', 5);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Documentar arquitectura', 'PENDIENTE', 5);
