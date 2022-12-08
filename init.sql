-- MySQL Script generated by MySQL Workbench
-- Thu Dec  8 00:18:30 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Lockerit
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `Lockerit` ;

-- -----------------------------------------------------
-- Schema Lockerit
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Lockerit` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `Lockerit` ;

-- -----------------------------------------------------
-- Table `Alcaldias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Alcaldias` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Alcaldias` (
  `id_Alcaldias` INT NOT NULL AUTO_INCREMENT,
  `nombre_alcaldia` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id_Alcaldias`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_Alcaldias_UNIQUE` ON `Alcaldias` (`id_Alcaldias` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Cliente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cliente` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(60) NOT NULL,
  `apellidoPaterno` VARCHAR(45) NOT NULL,
  `apellidoMaterno` VARCHAR(45) NOT NULL,
  `numeroCelular` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(60) NOT NULL,
  `password` VARCHAR(16) NOT NULL,
  `id_tipoUsuario` INT NOT NULL,
  PRIMARY KEY (`id_cliente`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_cliente_UNIQUE` ON `Cliente` (`id_cliente` ASC) VISIBLE;

SHOW WARNINGS;
CREATE UNIQUE INDEX `correo_UNIQUE` ON `Cliente` (`correo` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Empleados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Empleados` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Empleados` (
  `numeroEmpleado` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(60) NOT NULL,
  `apellidoPaterno` VARCHAR(45) NOT NULL,
  `apellidoMaterno` VARCHAR(45) NOT NULL,
  `numeroCelular` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(60) NOT NULL,
  `password` VARCHAR(16) NOT NULL,
  `id_tipoUsuario` INT NOT NULL,
  PRIMARY KEY (`numeroEmpleado`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `numeroEmpleado_UNIQUE` ON `Empleados` (`numeroEmpleado` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Locker`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Locker` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Locker` (
  `id_locker` INT NOT NULL AUTO_INCREMENT,
  `nombre_locker` VARCHAR(60) NOT NULL,
  `ancho` FLOAT NOT NULL,
  `alto` FLOAT NOT NULL,
  `profundidad` FLOAT NOT NULL,
  `num_taquillasS` INT NOT NULL,
  `num_taquillasM` INT NOT NULL,
  `num_taquillasL` INT NOT NULL,
  `ubicacion` VARCHAR(250) NOT NULL,
  `id_alcaldia` INT NULL,
  `estado_locker` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_locker`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_locker_UNIQUE` ON `Locker` (`id_locker` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Tamanio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Tamanio` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Tamanio` (
  `id_tamanio` INT NOT NULL AUTO_INCREMENT,
  `nombre_tamaño` VARCHAR(25) NOT NULL,
  `alto` FLOAT NOT NULL,
  `ancho` FLOAT NOT NULL,
  `profundidad` FLOAT NOT NULL,
  PRIMARY KEY (`id_tamanio`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_tipoPaquete_UNIQUE` ON `Tamanio` (`id_tamanio` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Taquilla`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Taquilla` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `Taquilla` (
  `id_taquilla` INT NOT NULL AUTO_INCREMENT,
  `id_tamanio` INT NOT NULL,
  `id_locker` INT NULL,
  `estado_taquilla` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_taquilla`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_taquilla_UNIQUE` ON `Taquilla` (`id_taquilla` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `envio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `envio` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `envio` (
  `id_envio` INT NOT NULL AUTO_INCREMENT,
  `hora_solicitud` TIME NOT NULL,
  `fecha_solicitud` DATE NOT NULL,
  `costo` INT NOT NULL,
  `nombre_destinatario` VARCHAR(200) NOT NULL,
  `correo_destinatario` VARCHAR(60) NOT NULL,
  `numeroCelular_destinatario` VARCHAR(10) NOT NULL,
  `id_metodoPago` INT NULL,
  `hora_entrega` TIME NOT NULL,
  `fecha_entrega` DATE NOT NULL,
  `id_cliente` INT NULL,
  `id_lockerOrigen` INT NULL,
  `id_lockerDestino` INT NULL,
  `id_tipoEnvio` INT NOT NULL,
  `id_tamanio` INT NOT NULL,
  `id_estadoEnvio` INT NOT NULL,
  PRIMARY KEY (`id_envio`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_envio_UNIQUE` ON `envio` (`id_envio` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `estadoEnvio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `estadoEnvio` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `estadoEnvio` (
  `id_estadoEnvio` INT NOT NULL AUTO_INCREMENT,
  `nombre_estadoEnvio` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_estadoEnvio`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_estadoEnvio_UNIQUE` ON `estadoEnvio` (`id_estadoEnvio` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `metodoPago`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `metodoPago` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `metodoPago` (
  `id_metodoPago` INT NOT NULL AUTO_INCREMENT,
  `numero_tarjeta` VARCHAR(16) NOT NULL,
  `fecha_expiracion` VARCHAR(5) NOT NULL,
  `metodoPago` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_metodoPago`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `qr`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `qr` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `qr` (
  `id_qr` INT NOT NULL AUTO_INCREMENT,
  `datos_qr` VARCHAR(60) NOT NULL,
  `estado_qr` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_qr`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `datos_qr_UNIQUE` ON `qr` (`datos_qr` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `reporte`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `reporte` (
  `id_reporte` INT NOT NULL AUTO_INCREMENT,
  `id_repartidor` INT NULL,
  `id_envío` INT NOT NULL,
  `id_tipoReporte` INT NOT NULL,
  PRIMARY KEY (`id_reporte`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `taquilla_envio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `taquilla_envio` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `taquilla_envio` (
  `id_taquilla-envio` INT NOT NULL AUTO_INCREMENT,
  `id_taquilla` INT NOT NULL,
  `id_envio` INT NOT NULL,
  `id_qr` INT NOT NULL,
  PRIMARY KEY (`id_taquilla-envio`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_taquilla-envio_UNIQUE` ON `taquilla_envio` (`id_taquilla-envio` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tipoEnvio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tipoEnvio` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tipoEnvio` (
  `id_tipoEnvio` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoEnvio` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_tipoEnvio`))
ENGINE = InnoDB;

SHOW WARNINGS;
CREATE UNIQUE INDEX `id_tipoEnvio_UNIQUE` ON `tipoEnvio` (`id_tipoEnvio` ASC) VISIBLE;

SHOW WARNINGS;
CREATE UNIQUE INDEX `nombre_tipoEnvio_UNIQUE` ON `tipoEnvio` (`nombre_tipoEnvio` ASC) VISIBLE;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tipoReporte`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tipoReporte` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tipoReporte` (
  `id_tipoReporte` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoReporte` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`id_tipoReporte`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `tipoUsuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tipoUsuario` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `tipoUsuario` (
  `id_tipoUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoUsuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipoUsuario`))
ENGINE = InnoDB;


SHOW WARNINGS;
CREATE UNIQUE INDEX `id_tipoUsuario_UNIQUE` ON `tipoUsuario` (`id_tipoUsuario` ASC) VISIBLE;

SHOW WARNINGS;
CREATE UNIQUE INDEX `nombre_tipoUsuario_UNIQUE` ON `tipoUsuario` (`nombre_tipoUsuario` ASC) VISIBLE;

SHOW WARNINGS;

LOCK TABLES `tipoUsuario` WRITE;
/*!40000 ALTER TABLE `tipoUsuario` DISABLE KEYS */;
INSERT INTO `tipoUsuario` VALUES (1,'Administrador'),(3,'Cliente'),(2,'Repartidor');
/*!40000 ALTER TABLE `tipoUsuario` ENABLE KEYS */;
UNLOCK TABLES;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;