
USE padronISSSTE;

CREATE TABLE regiones(  -- Tabla regiones para poder ligar ebdis o usuarios a cierta region 
    id_region TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Esta información no se encuentra en la base de datos por eso la agregamos
    nombre VARCHAR(10) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE estados( -- Nuevamente, la base de datos do cuenta con un identificador claro de estaodo
    id_estado TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Agregamos esta tabla para poder referenciar el nombre del estaod donde se encuentra una EBDI
    nombre VARCHAR(40) NOT NULL,   
    id_region TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_region) REFERENCES regiones(id_region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ebdis(  -- Creamos esta tabla para poder referenciar mas datos de las EBDI como su tipo, nombre y poder ligarla a usuarios y/o lugraes
    id_ebdi INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Esta llave primaria la creamos aparte del par (uv, ebdi_num) para poder juntar con las demás tablas con un id numerico 
    ur VARCHAR(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,  -- y que no dependa de un par de varchar()
    ebdi_num INT NOT NULL,
    id_estado TINYINT UNSIGNED NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    tipo ENUM('PROPIA','CONTRATADA','OSC') NOT NULL DEFAULT 'PROPIA',
    UNIQUE KEY (ur, ebdi_num),  -- Esta unique key la usamos como la "llave primaria" para poder referenciar la tabla Padron del socioformador
    FOREIGN KEY (id_estado) REFERENCES estados(id_estado)  -- Parece ser que el id ur y ebdi en padron indican el identificador de una ebdi por eso la ocupamos para unir ambas tablas
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuarios(  -- Creamos una tabla usuarios porque la base de datos no contaba con registros para los usuarios ni contraseñas, solo tenía la matrícula del infante
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- lo cual no sería seguro para ocupar como log in
    usuario VARCHAR(30) NOT NULL UNIQUE,  
    password_hash VARCHAR(255) NOT NULL,   
    rol ENUM('admin','regional','estancia','padre') NOT NULL, -- Basada en esta columana con WHERE podemos filtrar los permisos
    id_region TINYINT UNSIGNED NULL,  -- Necesitamos referenciar la region para roles de administrador regional, usaríamos WHERE
    id_ebdi INT UNSIGNED NULL,     -- Para los roles de instance necesitamos referencias solo la EBDI que corresponde
    activo BOOLEAN NOT NULL DEFAULT TRUE, 
    FOREIGN KEY (id_region) REFERENCES regiones(id_region),
    FOREIGN KEY (id_ebdi) REFERENCES ebdis(id_ebdi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE padres_infantes(   -- Tabla puente entre usuarios y padron para la relacion M:M (padres con varios hijos)
    id_usuario INT UNSIGNED NOT NULL, -- Esto implica que un usuario puede ver informacion de varios hijos
    id_infante INT NOT NULL,          -- y también que padre o madre pueden tener 2 usuarios distintos por ende repitiendo los mismos hijos por usuario
    PRIMARY KEY (id_usuario, id_infante), -- el par padre e hijo es único (padre1, hijo2)
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_infante) REFERENCES padron(id_infante)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mediciones(
    id_medicion INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_infante INT NOT NULL,                  -- mismo tipo que padron.id_infante
    fecha DATE NOT NULL,
    peso FLOAT NOT NULL,               -- kg
    talla FLOAT NOT NULL,              -- cm
    talla_blanco_familiar FLOAT NOT NULL,
    perimetro_cefalico FLOAT NOT NULL, -- cm
    id_usuario INT UNSIGNED NOT NULL,         -- quién la capturó
    FOREIGN KEY (id_infante) REFERENCES padron(id_infante),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP PROCEDURE IF EXISTS anadirMedicion;
DELIMITER $$
CREATE PROCEDURE anadirMedicion(
    IN matricula2 INT,
    IN peso2 FLOAT,
    IN talla2 FLOAT,
    IN talla_blanco_familiar2 FLOAT,
    IN perimetro_cefalico2 FLOAT,
    IN id_ebdi2 INT,
    IN id_usuario2 INT
)
BEGIN
    SET @id_infante2 = NULL;

    SELECT p.id_infante INTO @id_infante2
    FROM padron AS p
    INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi
    WHERE p.matricula = matricula2
    AND p.activo = 1 AND e.id_ebdi = id_ebdi2;

    INSERT INTO mediciones (
        id_infante, fecha, peso, talla, talla_blanco_familiar,
        perimetro_cefalico, id_usuario
    )
    VALUES (
        @id_infante2, CURDATE(), peso2, talla2, talla_blanco_familiar2,
        perimetro_cefalico2, id_usuario2
    );
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS anadirInfante;
    DELIMITER $$
    CREATE PROCEDURE anadirInfante(IN matricula2 INT(10),
    IN ebdi_name VARCHAR(80),
    IN nombre2 VARCHAR(50),
    IN paterno2 VARCHAR(50),
    IN materno2 VARCHAR(50),
    IN genero2 VARCHAR(1),
    IN fnac2 DATE)
        BEGIN
            SET SESSION sql_mode = ''; -- Hacemos esto para que con este modo Mysql les ponga 0 o ''

            SET @ur2 = NULL; SET @ebdi_num2 = NULL;

            SELECT e.ur , e.ebdi_num INTO @ur2, @ebdi_num2 
            FROM ebdis AS e
            WHERE e.nombre = ebdi_name;

            INSERT INTO padron
            (id_benef_infante, matricula, ur, ebdi, nombre, paterno, materno, genero, fnac, freg, estatus_servicio, fmovimiento, movimiento, activo, usuario)
            VALUES
            (0,matricula2,@ur2,@ebdi_num2,nombre2,paterno2,materno2,genero2,fnac2,CURDATE(),1,CURDATE(),'ALTA',1,'test');
        END$$
    DELIMITER ;

DROP PROCEDURE IF EXISTS editarInfante;
    DELIMITER $$
    CREATE PROCEDURE editarInfante(IN matricula2 INT(10),  -- 1
    IN nombre2 VARCHAR(50), -- 2
    IN paterno2 VARCHAR(50), -- 3
    IN materno2 VARCHAR(50), -- 4
    IN genero2 VARCHAR(1), -- 5
    IN fnac2 DATE, -- 6
    IN ebdi_name VARCHAR(80), -- 7
    IN id_infante2 int(11)) -- 8
        BEGIN
            SET @ur2 = NULL; SET @ebdi_num2 = NULL;

            SELECT e.ur , e.ebdi_num INTO @ur2, @ebdi_num2 
            FROM ebdis AS e
            WHERE e.nombre = ebdi_name;

            UPDATE padron SET matricula = matricula2, nombre = nombre2, paterno = paterno2, materno = materno2, 
            genero = genero2, fnac = fnac2, ur=@ur2, ebdi=@ebdi_num2 
            WHERE id_infante = id_infante2;
        END$$
    DELIMITER ;

-- The following are necessary additions for the graphs

CREATE TABLE cdc_imc_percentiles (
    sexo CHAR(1) NOT NULL,                 -- 'H' = niño, 'M' = niña (igual que padron.genero)
    edad_meses TINYINT UNSIGNED NOT NULL,  -- meses cumplidos, de 24 (2 años) a 72 (6 años)
    p5  DECIMAL(5,2) NOT NULL,             -- debajo de este IMC: bajo peso
    p85 DECIMAL(5,2) NOT NULL,             -- desde aquí: sobrepeso
    p95 DECIMAL(5,2) NOT NULL,             -- desde aquí: obesidad
    PRIMARY KEY (sexo, edad_meses)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cdc_imc_percentiles (sexo, edad_meses, p5, p85, p95) VALUES
('H',24,14.72,18.12,19.28),
('H',25,14.68,18.04,19.16),
('H',26,14.65,17.96,19.06),
('H',27,14.61,17.88,18.95),
('H',28,14.58,17.81,18.85),
('H',29,14.55,17.74,18.76),
('H',30,14.51,17.67,18.67),
('H',31,14.48,17.60,18.59),
('H',32,14.45,17.54,18.51),
('H',33,14.42,17.48,18.43),
('H',34,14.39,17.43,18.36),
('H',35,14.36,17.38,18.30),
('H',36,14.33,17.33,18.24),
('H',37,14.30,17.28,18.18),
('H',38,14.27,17.23,18.13),
('H',39,14.25,17.19,18.08),
('H',40,14.22,17.15,18.04),
('H',41,14.19,17.12,18.00),
('H',42,14.17,17.08,17.97),
('H',43,14.14,17.05,17.93),
('H',44,14.12,17.02,17.91),
('H',45,14.10,16.99,17.88),
('H',46,14.08,16.97,17.86),
('H',47,14.05,16.95,17.85),
('H',48,14.03,16.93,17.84),
('H',49,14.01,16.91,17.83),
('H',50,13.99,16.89,17.82),
('H',51,13.98,16.88,17.82),
('H',52,13.96,16.87,17.82),
('H',53,13.94,16.86,17.83),
('H',54,13.92,16.85,17.83),
('H',55,13.91,16.84,17.84),
('H',56,13.89,16.84,17.86),
('H',57,13.88,16.84,17.87),
('H',58,13.86,16.84,17.89),
('H',59,13.85,16.84,17.91),
('H',60,13.84,16.84,17.94),
('H',61,13.83,16.85,17.97),
('H',62,13.82,16.85,18.00),
('H',63,13.80,16.86,18.03),
('H',64,13.79,16.87,18.06),
('H',65,13.79,16.88,18.10),
('H',66,13.78,16.90,18.14),
('H',67,13.77,16.91,18.18),
('H',68,13.76,16.93,18.22),
('H',69,13.75,16.95,18.27),
('H',70,13.75,16.97,18.31),
('H',71,13.74,16.99,18.36),
('H',72,13.74,17.01,18.41),
('M',24,14.38,17.97,19.06),
('M',25,14.35,17.89,18.97),
('M',26,14.31,17.80,18.88),
('M',27,14.28,17.73,18.80),
('M',28,14.24,17.65,18.72),
('M',29,14.21,17.58,18.64),
('M',30,14.18,17.51,18.58),
('M',31,14.15,17.44,18.51),
('M',32,14.12,17.38,18.45),
('M',33,14.09,17.32,18.40),
('M',34,14.06,17.27,18.35),
('M',35,14.03,17.22,18.30),
('M',36,14.00,17.17,18.25),
('M',37,13.97,17.12,18.22),
('M',38,13.95,17.08,18.18),
('M',39,13.92,17.04,18.15),
('M',40,13.90,17.00,18.12),
('M',41,13.87,16.96,18.10),
('M',42,13.85,16.93,18.08),
('M',43,13.82,16.90,18.06),
('M',44,13.80,16.88,18.05),
('M',45,13.78,16.85,18.04),
('M',46,13.76,16.83,18.03),
('M',47,13.74,16.82,18.03),
('M',48,13.71,16.80,18.03),
('M',49,13.69,16.79,18.03),
('M',50,13.68,16.78,18.04),
('M',51,13.66,16.77,18.05),
('M',52,13.64,16.76,18.06),
('M',53,13.62,16.76,18.07),
('M',54,13.61,16.76,18.09),
('M',55,13.59,16.76,18.11),
('M',56,13.57,16.77,18.14),
('M',57,13.56,16.77,18.16),
('M',58,13.55,16.78,18.19),
('M',59,13.53,16.79,18.22),
('M',60,13.52,16.80,18.26),
('M',61,13.51,16.82,18.29),
('M',62,13.50,16.83,18.33),
('M',63,13.49,16.85,18.37),
('M',64,13.48,16.87,18.42),
('M',65,13.47,16.89,18.46),
('M',66,13.46,16.92,18.51),
('M',67,13.45,16.94,18.56),
('M',68,13.45,16.97,18.61),
('M',69,13.44,17.00,18.66),
('M',70,13.43,17.03,18.72),
('M',71,13.43,17.07,18.78),
('M',72,13.43,17.10,18.84);

ALTER TABLE mediciones
ADD COLUMN imc DECIMAL(5,2) NULL AFTER perimetro_cefalico;

DROP TRIGGER IF EXISTS calcular_IMC;
DELIMITER $$
CREATE TRIGGER calcular_IMC
BEFORE INSERT ON mediciones
FOR EACH ROW
BEGIN
    IF NEW.talla > 0 THEN
        SET NEW.imc = ROUND(NEW.peso / NEW.talla / NEW.talla * 10000, 2);
    ELSE
        SET NEW.imc = NULL;
    END IF;
END$$
DELIMITER ;

    