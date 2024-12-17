DROP DATABASE IF EXISTS  La_Desesperanza;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `La_Desesperanza` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `La_Desesperanza`;

CREATE TABLE `Usuario` (
  `id_usuario` INT AUTO_INCREMENT,
  `rol`ENUM('Admin', 'Cliente') DEFAULT 'Cliente' NOT NULL,
  `nombre` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `contrasena` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Cliente` (
  `id_cliente` INT AUTO_INCREMENT,
  `telefono` VARCHAR(20) NOT NULL,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_cliente`),
  FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Direccion` (
  `id_direccion` INT AUTO_INCREMENT,
  `calle` VARCHAR(100) NOT NULL,
  `numero_interior` VARCHAR(10) NOT NULL,
  `numero_exterior` VARCHAR(10) NOT NULL,
  `colonia` VARCHAR(100) NOT NULL,
  `alcaldia_municipio` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(100) NOT NULL,
  `codigo_postal` VARCHAR(10) NOT NULL,
  `id_cliente` INT NOT NULL,
  PRIMARY KEY (`id_direccion`),
  FOREIGN KEY (`id_cliente`) REFERENCES `Cliente`(`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Productos
CREATE TABLE `Producto` (
  `id_producto` INT AUTO_INCREMENT,
  `nombre_producto` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `precio_producto` DECIMAL(10, 2) NOT NULL,
  `cantidad_producto` INT NOT NULL,
  `imagen_producto` VARCHAR(255) NOT NULL,
  `categoria`enum ('Temporada','Salado','Dulce','Pastel'),
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Pedidos
CREATE TABLE `Pedido` (
  `id_pedido` INT AUTO_INCREMENT,
  `estado` ENUM('pendiente', 'listo') DEFAULT 'pendiente' NOT NULL,
  `fecha_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `precio_total` DECIMAL(10, 2) NOT NULL,
  `id_cliente` INT NOT NULL,
  PRIMARY KEY (`id_pedido`),
  FOREIGN KEY (`id_cliente`) REFERENCES `Cliente`(`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `PedidoProducto` (
  `id_pedido` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,  -- la cantidad por el precio del producto
  PRIMARY KEY (`id_pedido`, `id_producto`),
  FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`) ON DELETE CASCADE,
  FOREIGN KEY (`id_producto`) REFERENCES `Producto`(`id_producto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Facturas que se emiten solo cuando un pedido está marcado como listo
CREATE TABLE `Factura` (
  `id_factura` INT AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `dinero_recibido` INT NOT NULL,
  `cambio`INT NOT NULL,
  PRIMARY KEY (`id_factura`),
  FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO Usuario (rol, nombre, correo, contrasena)
VALUES ('Admin', 'Almita',  'el.amor.de.mi.vida@gmail.com', 'Aa$12345');

INSERT INTO Usuario (rol, nombre, correo, contrasena)
VALUES ('Cliente', 'tu',  'tu@gmail.com', 'Aa$12345');

INSERT INTO Cliente ( telefono, id_usuario)
VALUES ('1234567890', '2');

-- Inserción de productos
INSERT INTO producto (nombre_producto, precio_producto, cantidad_producto, imagen_producto, categoria) VALUES
('Tronco Navideño', 35.00, 10, 'images/tronco.png', 'Temporada'),
('Tronco Nevado', 2.50, 20, 'images/tronco_nevado.png', 'Temporada'),
('Bollo Navideño', 8.00, 15, 'images/bollo_navideño.png', 'Temporada'),
('Pastel de Santa Claus', 8.00, 15, 'images/pastel_santaclaus.png', 'Temporada'),
('Pan de Muerto', 35.00, 10, 'images/pan_muerto_mediano.png', 'Dulce'),
('Bolillo', 2.50, 20, 'images/bolillo.png', 'Salado'),
('Bollo Relleno de Queso', 8.00, 15, 'images/bollo_relleno.png', 'Salado'),
('Chapata', 8.00, 15, 'images/chapata.png', 'Salado'),
('Baguette Chico', 8.00, 15, 'images/baguette_chico.png', 'Salado'),
('Baguette Grande', 24.00, 10, 'images/baguette_grande.png', 'Salado'),
('Pambazo', 3.50, 20, 'images/pambazo.png', 'Salado'),
('Tablera', 2.50, 25, 'images/tablera.png', 'Salado'),
('Tablera con Ajonjolí', 2.50, 25, 'images/tablera_ajonjoli.png', 'Salado'),
('Concha de Vanilla', 11.00, 30, 'images/concha_vainilla.png', 'Dulce'),
('Concha de Chocolate', 11.00, 30, 'images/concha_chocolate.png', 'Dulce'),
('Dona de Chocolate', 8.00, 20, 'images/dona_chocolate.png', 'Dulce'),
('Dona de Azucar', 8.00, 20, 'images/dona_azucar.png', 'Dulce'),
('Oreja', 11.00, 30, 'images/oreja.png', 'Dulce'),
('Oreja de Chocolate', 11.00, 30, 'images/oreja_chocolate.png', 'Dulce'),
('Costra de Piña', 8.00, 20, 'images/costra_piña.png', 'Dulce'),
('Mantecada', 8.00, 20, 'images/mantecada.png', 'Dulce'),
('Beso', 11.00, 30, 'images/beso.png', 'Dulce'),
('Rebanada de Mantequilla', 11.00, 30, 'images/rebanada_mantequilla.png', 'Dulce'),
('Corbata', 8.00, 20, 'images/corbata.png', 'Dulce'),
('Canasta', 8.00, 20, 'images/Canasta.png', 'Dulce'),
('Pastel de Calabaza', 350.00, 5, 'images/pastel_calabaza.png', 'Pastel'),
('Pastel de Conejito', 375.00, 30, 'images/pastel_conejito.png', 'Pastel'),
('Pastel de Carlos V', 375.00, 5, 'images/pastel_carlosV.png', 'Pastel'),
('Pastel de Chocolate', 350.00, 5, 'images/pastel_chocolate.png', 'Pastel'),
('Pastel de Coco', 350.00, 5, 'images/pastel_coco.png', 'Pastel'),
('Pastel de Zanahoria', 350.00, 5, 'images/pastel_zanahoria.png', 'Pastel'),
('Pastel de Durazno', 350.00, 5, 'images/pastel_durazno.png', 'Pastel'),
('Pastel de Fresa', 350.00, 5, 'images/pastel_fresa.png', 'Pastel');


INSERT INTO Pedido (`estado`, `fecha_pedido`, `precio_total`, `id_cliente`) 
VALUES
('pendiente','2024-11-27 00:54:23', 39.00, 1);

INSERT INTO PedidoProducto (`id_pedido`, `id_producto`, `cantidad`, `precio`) 
VALUES
(1, 21, 3, 24.00),
(1, 6, 5, 15.00);

INSERT INTO `Direccion` 
(`calle`, `numero_interior`, `numero_exterior`, `colonia`, `alcaldia_municipio`, `estado`, `codigo_postal`, `id_cliente`) 
VALUES 
('Av. Reforma', '101', '456', 'Centro', 'Cuauhtémoc', 'Ciudad de México', '06500', 1);


select*from `Direccion`;
select*from `usuario`;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;