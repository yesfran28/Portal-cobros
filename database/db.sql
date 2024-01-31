CREATE DATABASE sistema_automatico;
use sistema_automatico;
CREATE TABLE suscripcion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    suscripcion_push VARCHAR(500) NOT NULL,
    celular VARCHAR(60) NOT NULL,
    endpoint VARCHAR(600) NOT NULL
    smtp VARCHAR(600) NOT NULL  
);

CREATE TABLE estado_cuenta(
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(80) NOT NULL
);
CREATE TABLE turno(
    id INT PRIMARY KEY AUTO_INCREMENT,
    turno VARCHAR(80) NOT NULL
);

CREATE TABLE cliente(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(120), 
    apellidos VARCHAR(120) NOT NULL,
    id_turno INT NOT NULL,
    Foreign Key (id_suscripcion) REFERENCES suscripcion(id),
    Foreign Key (id_turno) REFERENCES turno(id)
);
CREATE TABLE credito(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_estado_cuenta INT NOT NULL,
    id_cliente INT NOT NULL,
    monto DOUBLE NOT NULL,
    Foreign Key (id_estado_cuenta) REFERENCES estado_cuenta(id),
    Foreign Key (id_cliente) REFERENCES cliente(id)
);
CREATE TABLE estado_producto(
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(250) NOT NULL
);
CREATE TABLE producto(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_estado INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(250) NOT NULL,
    precio DOUBLE NOT NULL,
    Foreign Key (id_estado) REFERENCES estado_producto(id)
);

CREATE TABLE detalle_credito(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    id_credito INT NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    hora VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    Foreign Key (id_producto) REFERENCES producto(id),
    Foreign Key (id_credito) REFERENCES credito(id)
);
CREATE TABLE autenticacion(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(100) NOT NULL,
    email VARCHAR(250) NOT NULL,
    contrasena VARCHAR(350) NOT NULL,
    intentos INT NOT NULL
);
CREATE TABLE recuperacion(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_autenticado INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    fecha VARCHAR(30) NOT NULL,
    Foreign Key (id_autenticado) REFERENCES autenticacion(id)
);

CREATE TABLE solicitud_push ( id INT PRIMARY KEY AUTO_INCREMENT, auth VARCHAR(650) NOT NULL,pdt256 VARCHAR(650) NOT NULL, endpoint VARCHAR(700) NOT NULL, fecha VARCHAR(40), hora VARCHAR(40))

