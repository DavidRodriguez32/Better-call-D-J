CREATE DATABASE better_call_dj;
USE better_call_dj;

CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    delito VARCHAR(100)
);

CREATE TABLE expedientes (
    id_caso INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    titulo_caso VARCHAR(100) NOT NULL,
    tipo_delito VARCHAR(100),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE agenteDea (
    id_agente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15)
);

CREATE TABLE clientes_agenteDea (
    id_cliente INT,
    id_agente INT,
    CONSTRAINT pk_clientes_agenteDea PRIMARY KEY (id_cliente, id_agente),
    CONSTRAINT fk_clientes_agenteDea_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_clientes_agenteDea_agente FOREIGN KEY (id_agente) REFERENCES agenteDea(id_agente)
);

INSERT INTO clientes (nombre, alias, telefono, email, delito) VALUES
('Gustavo Fring', 'El Pollero', '611987654', 'info@lospollos.com', 'Evasión de impuestos'),
('Walter Black', 'Heisenberg', '734721945', 'say@myname.com', 'Distribución de "química"'),
('Jessie Pinkman', 'El Jonky', '848292761', 'pink@lasplantas.com', 'Robo de identidad');

INSERT INTO expedientes (id_cliente, titulo_caso, tipo_delito) VALUES
(1, 'Inspección de Sanidad', 'Fiscal'),
(2, 'Laboratorio de metanfetamina', 'Drogas'),
(3, 'Inspección de Sanidad', 'Fiscal');

INSERT INTO agenteDea (nombre, telefono) VALUES
('Hank Schrader', '78939572'),
('Steve Gomez', '773839291'),
('Tuco Salamanca', '848747478');