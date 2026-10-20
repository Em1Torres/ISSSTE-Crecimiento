
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
    fecha DATE NOT NULL,  -- Para validar que hayan pasado 45 días para tomar una nueva medición
    peso FLOAT NOT NULL,               -- kg
    talla FLOAT NOT NULL,              -- cm
    talla_blanco_familiar FLOAT NOT NULL,
    perimetro_cefalico FLOAT NOT NULL, -- cm
    id_usuario INT UNSIGNED DEFAULT NULL,         -- quién la capturó
    FOREIGN KEY (id_infante) REFERENCES padron(id_infante),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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




    