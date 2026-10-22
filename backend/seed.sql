-- seed.sql: datos de prueba. Corre DESPUÉS del archivo que crea las tablas.
USE padronISSSTE;

-- padron tiene ~60 columnas NOT NULL sin default; con sql_mode vacío MySQL les pone 0 / ''
SET SESSION sql_mode = '';

-- ---------- Catálogos ----------
INSERT INTO regiones (id_region, nombre) VALUES (1,'NORTE'),(2,'SUR'),(3,'ESTE'),(4,'OESTE');

INSERT INTO estados (id_estado, nombre, id_region) VALUES
(1,'Nuevo León',1),
(2,'Chiapas',2),
(3,'Veracruz',3),
(4,'Jalisco',4);

-- ur y ebdi_num son los mismos valores que trae padron; id_estado dice a qué estado pertenece cada estancia
INSERT INTO ebdis (ur, ebdi_num, id_estado, nombre, tipo) VALUES
('019',1,1,'EBDI Monterrey No. 1','PROPIA'),
('019',2,1,'EBDI Monterrey No. 2','CONTRATADA'),
('007',1,2,'EBDI Tuxtla No. 1','PROPIA'),
('030',1,3,'EBDI Xalapa No. 1','OSC'),
('014',1,4,'EBDI Guadalajara No. 1','PROPIA');

-- ---------- Infantes (padron) ----------
INSERT INTO padron
(id_benef_infante, matricula, ur, ebdi, nombre, paterno, materno, genero, fnac, freg, estatus_servicio, fmovimiento, movimiento, activo, usuario)
VALUES
(0,100001,'019',1,'Mateo','Hernández','García','H','2023-02-10',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100002,'019',1,'Sofía','López','Martínez','M','2022-07-21',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100003,'019',1,'Diego','González','Pérez','H','2024-05-03',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100004,'019',2,'Regina','Ramírez','Flores','M','2021-11-30',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100005,'019',2,'Emiliano','Torres','Díaz','H','2023-09-14',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100006,'019',2,'Camila','Cruz','Morales','M','2025-01-08',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100007,'007',1,'Santiago','Reyes','Gutiérrez','H','2022-03-17',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100008,'007',1,'Ximena','Sánchez','Cruz','M','2024-12-02',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100009,'030',1,'Leonardo','Flores','Hernández','H','2021-06-25',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100010,'030',1,'Valentina','García','López','M','2023-04-19',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100011,'014',1,'Iker','Martínez','Torres','H','2025-08-11',CURDATE(),1,CURDATE(),'ALTA',1,'test'),
(0,100012,'014',1,'Renata','Pérez','Reyes','M','2022-10-05',CURDATE(),1,CURDATE(),'ALTA',1,'test');

-- Para insertar usuarios hay que correrlo en el backend para que genera contraseñas con argon2 hasheadas

-- padre001 con dos hijos (Mateo y Sofía)
INSERT INTO padres_infantes (id_usuario, id_infante)
SELECT u.id_usuario, p.id_infante
FROM usuarios u
JOIN padron p ON p.matricula IN (100001, 100002)
WHERE u.usuario = 'padre001';

-- No se puede correr hasta que generamos los usuarios desde el backend con argon2
SET @estancia = (SELECT id_usuario FROM usuarios WHERE usuario = 'estancia_mty1');

INSERT INTO mediciones (id_infante, fecha, peso, talla, talla_blanco_familiar, perimetro_cefalico, id_usuario) VALUES
((SELECT id_infante FROM padron WHERE matricula = 100001), CURDATE() - INTERVAL 100 DAY, 14.2, 95.5, 172, 49.5, @estancia),
((SELECT id_infante FROM padron WHERE matricula = 100001), CURDATE() - INTERVAL 20 DAY,  15.0, 98.0, 172, 49.8, @estancia),
((SELECT id_infante FROM padron WHERE matricula = 100002), CURDATE() - INTERVAL 95 DAY,  15.8, 101.0, 168, 49.0, @estancia),
((SELECT id_infante FROM padron WHERE matricula = 100002), CURDATE() - INTERVAL 10 DAY,  16.5, 103.5, 168, 49.2, @estancia),
((SELECT id_infante FROM padron WHERE matricula = 100003), CURDATE() - INTERVAL 60 DAY,  11.8, 86.0, 175, 48.0, @estancia);

SELECT * FROM mediciones;