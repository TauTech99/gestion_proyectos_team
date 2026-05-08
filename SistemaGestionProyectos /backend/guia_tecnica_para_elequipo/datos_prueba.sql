-- CLIENTES
INSERT INTO clientes (nombre, estado) VALUES ('TechCorp', 'ACTIVO');
INSERT INTO clientes (nombre, estado) VALUES ('Banco Nacional', 'ACTIVO');
INSERT INTO clientes (nombre, estado) VALUES ('Supermercados Sur', 'ACTIVO');
INSERT INTO clientes (nombre, estado) VALUES ('Cliente Antiguo', 'BAJA');

-- PROYECTOS (con cliente)
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('App Mobile TechCorp', 'ACTIVO', 1);
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('Portal Web Banco', 'ACTIVO', 2);
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('Sistema de Stock', 'FINALIZADO', 3);
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('E-commerce TechCorp', 'BAJA', 1);

-- PROYECTOS (internos, sin cliente)
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('Infraestructura Interna', 'ACTIVO', NULL);
INSERT INTO proyectos (nombre, estado, id_cliente) VALUES ('Refactor Legacy', 'FINALIZADO', NULL);

-- TAREAS (proyecto 1 - App Mobile TechCorp)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Diseñar pantalla de login', 'FINALIZADA', 1);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Implementar API de usuarios', 'PENDIENTE', 1);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Testing en dispositivos', 'PENDIENTE', 1);

-- TAREAS (proyecto 2 - Portal Web Banco)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Maquetado del dashboard', 'FINALIZADA', 2);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Integración con API del banco', 'PENDIENTE', 2);

-- TAREAS (proyecto 3 - Sistema de Stock)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Módulo de inventario', 'FINALIZADA', 3);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Reportes PDF', 'FINALIZADA', 3);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Capacitación usuarios', 'BAJA', 3);

-- TAREAS (proyecto 5 - Infraestructura Interna)
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Configurar servidor de staging', 'PENDIENTE', 5);
INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES ('Documentar arquitectura', 'PENDIENTE', 5);
