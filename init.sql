-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Lockerit
-- -----------------------------------------------------


-- -----------------------------------------------------
-- Schema Lockerit
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Lockerit` DEFAULT CHARACTER SET utf8 ;
USE `Lockerit` ;

-- -----------------------------------------------------
-- Table `tipoEnvio`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS `Lockerit`.`tipoEnvio` (
  `id_tipoEnvio` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoEnvio` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_tipoEnvio`),
  UNIQUE INDEX `id_tipoEnvio_UNIQUE` (`id_tipoEnvio` ASC) VISIBLE,
  UNIQUE INDEX `nombre_tipoEnvio_UNIQUE` (`nombre_tipoEnvio` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `tipoUsuario`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`tipoUsuario` (
  `id_tipoUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoUsuario` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_tipoUsuario`),
  UNIQUE INDEX `id_tipoUsuario_UNIQUE` (`id_tipoUsuario` ASC) VISIBLE,
  UNIQUE INDEX `nombre_tipoUsuario_UNIQUE` (`nombre_tipoUsuario` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Cliente`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Cliente` (
 `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `apellidoPaterno` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `apellidoMaterno` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `numeroCelular` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `correo` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `password` VARCHAR(16) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `id_tipoUsuario` INT NOT NULL,
  `tk_Cliente` INT(6) NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `id_cliente_UNIQUE` (`id_cliente` ASC) VISIBLE,
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE,
  CONSTRAINT `fk_tipoUsuario_Cliente`
    FOREIGN KEY (`id_tipoUsuario`)
    REFERENCES `tipoUsuario` (`id_tipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Empleados`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Empleados` (
  `numeroEmpleado` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `apellidoPaterno` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `apellidoMaterno` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `numeroCelular` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `correo` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `password` VARCHAR(16) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `id_tipoUsuario` INT NOT NULL,
  PRIMARY KEY (`numeroEmpleado`),
  UNIQUE INDEX `numeroEmpleado_UNIQUE` (`numeroEmpleado` ASC) VISIBLE,
  CONSTRAINT `fk_tipoUsuario_Empleados`
    FOREIGN KEY (`id_tipoUsuario`)
    REFERENCES `tipoUsuario` (`id_tipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Tamanio`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Tamanio` (
  `id_tamanio` INT NOT NULL AUTO_INCREMENT,
  `nombre_tamanio` VARCHAR(25) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `alto` FLOAT NOT NULL,
  `ancho` FLOAT NOT NULL,
  `profundidad` FLOAT NOT NULL,
  `Precio` FLOAT NOT NULL,
  PRIMARY KEY (`id_tamanio`),
  UNIQUE INDEX `id_tipoPaquete_UNIQUE` (`id_tamanio` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `estadoEnvio`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`estadoEnvio` (
  `id_estadoEnvio` INT NOT NULL AUTO_INCREMENT,
  `nombre_estadoEnvio` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_estadoEnvio`),
  UNIQUE INDEX `id_estadoEnvio_UNIQUE` (`id_estadoEnvio` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Alcaldias`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Alcaldias` (
  `id_Alcaldias` INT NOT NULL AUTO_INCREMENT,
  `nombre_alcaldia` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_Alcaldias`),
  UNIQUE INDEX `id_Alcaldias_UNIQUE` (`id_Alcaldias` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Locker`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Locker` (
  `id_locker` INT NOT NULL AUTO_INCREMENT,
  `nombre_locker` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `ancho` FLOAT NOT NULL,
  `alto` FLOAT NOT NULL,
  `profundidad` FLOAT NOT NULL,
  `num_taquillasS` INT NOT NULL,
  `num_taquillasM` INT NOT NULL,
  `num_taquillasL` INT NOT NULL,
  `ubicacion` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `id_alcaldia` INT NULL,
  `estado_locker` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_locker`),
  UNIQUE INDEX `id_locker_UNIQUE` (`id_locker` ASC) VISIBLE,
  CONSTRAINT `fk_Alcaldias_Locker`
    FOREIGN KEY (`id_alcaldia`)
    REFERENCES `Alcaldias` (`id_Alcaldias`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `Taquilla`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`Taquilla` (
  `id_taquilla` INT NOT NULL AUTO_INCREMENT,
  `id_tamanio` INT NOT NULL,
  `id_locker` INT NULL,
  `estado_taquilla` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_taquilla`),
  UNIQUE INDEX `id_taquilla_UNIQUE` (`id_taquilla` ASC) VISIBLE,
  CONSTRAINT `fk_Tamanio_Taquilla`
    FOREIGN KEY (`id_tamanio`)
    REFERENCES `Tamanio` (`id_tamanio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Locker_Taquilla`
    FOREIGN KEY (`id_locker`)
    REFERENCES `Locker` (`id_locker`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `metodoPago`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`metodoPago` (
  `id_metodoPago` INT NOT NULL AUTO_INCREMENT,
  `numero_tarjeta` VARCHAR(16) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `fecha_expiracion` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `metodoPago` VARCHAR(45) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `id_cliente` INT NULL,
  PRIMARY KEY (`id_metodoPago`),
  CONSTRAINT `fk_Cliente_metodoPago`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `Cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `envio`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`envio` (
  `id_envio` INT NOT NULL AUTO_INCREMENT,
  `hora_solicitud` TIME NOT NULL,
  `fecha_solicitud` DATE NOT NULL,
  `costo` INT NOT NULL,
  `nombre_destinatario` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `correo_destinatario` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `numeroCelular_destinatario` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `id_metodoPago` INT NULL,
  `hora_entrega` TIME NOT NULL,
  `fecha_entrega` DATE NOT NULL,
  `id_cliente` INT NULL,
  `id_lockerOrigen` INT NULL,
  `id_lockerDestino` INT NULL,
  `id_tipoEnvio` INT NOT NULL,
  `id_tamanio` INT NOT NULL,
  `id_estadoEnvio` INT NOT NULL,
  PRIMARY KEY (`id_envio`),
  UNIQUE INDEX `id_envio_UNIQUE` (`id_envio` ASC) VISIBLE,
  CONSTRAINT `fk_metodoPago_envio`
    FOREIGN KEY (`id_metodoPago`)
    REFERENCES `metodoPago` (`id_metodoPago`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_remitente_envio`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `Cliente` (`id_cliente`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_origen_envio`
    FOREIGN KEY (`id_lockerOrigen`)
    REFERENCES `Locker` (`id_locker`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_destino_envio`
    FOREIGN KEY (`id_lockerDestino`)
    REFERENCES `Locker` (`id_locker`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tipoEnvio_envio`
    FOREIGN KEY (`id_tipoEnvio`)
    REFERENCES `tipoEnvio` (`id_tipoEnvio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tamanio_envio`
    FOREIGN KEY (`id_tamanio`)
    REFERENCES `Tamanio` (`id_tamanio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_estadoEnvio_envio`
    FOREIGN KEY (`id_estadoEnvio`)
    REFERENCES `estadoEnvio` (`id_estadoEnvio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `qr`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`qr` (
  `id_qr` INT NOT NULL AUTO_INCREMENT,
  `datos_qr` VARCHAR(60) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  `estado_qr` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_qr`),
  UNIQUE INDEX `datos_qr_UNIQUE` (`datos_qr` ASC) VISIBLE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `taquilla_envio`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`taquilla_envio` (
  `id_taquilla_envio` INT NOT NULL AUTO_INCREMENT,
  `id_taquilla` INT NOT NULL,
  `id_envio` INT NOT NULL,
  `id_qr` INT NOT NULL,
  PRIMARY KEY (`id_taquilla_envio`),
  UNIQUE INDEX `id_taquilla-envio_UNIQUE` (`id_taquilla_envio` ASC) VISIBLE,
  CONSTRAINT `fk_taquilla_taquilla_envio`
    FOREIGN KEY (`id_taquilla`)
    REFERENCES `Taquilla` (`id_taquilla`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_envio_taquilla_envio`
    FOREIGN KEY (`id_envio`)
    REFERENCES `envio` (`id_envio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_qr_taquilla_envio`
    FOREIGN KEY (`id_qr`)
    REFERENCES `qr` (`id_qr`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `tipoReporte`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`tipoReporte` (
  `id_tipoReporte` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipoReporte` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_spanish_ci' NOT NULL,
  PRIMARY KEY (`id_tipoReporte`))
ENGINE = InnoDB;

 

-- -----------------------------------------------------
-- Table `reporte`
-- -----------------------------------------------------


 
CREATE TABLE IF NOT EXISTS `Lockerit`.`reporte` (
  `id_reporte` INT NOT NULL AUTO_INCREMENT,
  `id_repartidor` INT NULL,
  `id_envío` INT NOT NULL,
  `id_tipoReporte` INT NOT NULL,
  PRIMARY KEY (`id_reporte`),
  CONSTRAINT `fk_Empleados_reporte`
    FOREIGN KEY (`id_repartidor`)
    REFERENCES `Empleados` (`numeroEmpleado`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Envio_reporte`
    FOREIGN KEY (`id_envío`)
    REFERENCES `envio` (`id_envio`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tipoReporte_reporte`
    FOREIGN KEY (`id_tipoReporte`)
    REFERENCES `tipoReporte` (`id_tipoReporte`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

 

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`tipoUsuario` VALUES (1,'Administrador'),(3,'Cliente'),(2,'Repartidor');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`Alcaldias` (`id_Alcaldias`, `nombre_alcaldia`) VALUES ('1', 'Alvaro Obregon') ,('2', 'Azcapotzalco') ,('3', 'Benito Juarez') ,('4', 'Coyoacan') ,('5', 'Cuajimalpa') ,('6', 'Cuahtemoc') ,('7', 'Gustavo A. Madero') ,('8', 'Iztacalco') ,('9', 'Iztapalapa') ,('10', 'Magdalena Contreras') ,('11', 'Miguel Hidalgo') ,('12', 'Milpa Alta') ,('13', 'Tlahuac') ,('14', 'Tlalpan') ,('15', 'Venustiano Carranza') ,('16', 'Xochimilco');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`tipoEnvio` (`id_tipoEnvio`, `nombre_tipoEnvio`) VALUES ('1', 'Tradicional'), ('2', 'Express');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`Tamanio` (`id_tamanio`, `nombre_tamanio`, `alto`, `ancho`, `profundidad`,`precio`) VALUES ('1', 'Chico', '10.922', '40.64', '63.5','100'), ('2', 'Mediano', '24.13', '40.64', '63.5','125'), ('3', 'Grande', '50.8', '40.64', '63.5','175');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`estadoEnvio` (`id_estadoEnvio`, `nombre_estadoEnvio`) VALUES ('1', 'En espera de entrega para recoleccion') ,('2', 'En espera de recoleccion') ,('3', 'En traslado') ,('4', 'En espera de recepcion del destinatario') ,('5', 'En almacen') ,('6', 'Completado') ,('7', 'Cancelado');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`Cliente` (`nombres`,`apellidoPaterno`,`apellidoMaterno`,`numeroCelular`,`correo`,`password`,`id_tipoUsuario`) VALUES('Edgar Josue', 'Varillas', 'Figueroa', '5534315125','teamedgaar01@gmail.com','MeL4stimas.','3');
COMMIT;

START TRANSACTION;
USE `Lockerit`;
INSERT INTO `Lockerit`.`Locker` (`id_locker`, `nombre_locker`, `ancho`, `alto`, `profundidad`, `num_taquillasS`, `num_taquillasM`, `num_taquillasL`, `ubicacion`, `id_alcaldia`, `estado_locker`) VALUES ('1', 'Reforma 222', '99.9998', '199.009', '63.5', '5', '6', '2', 'Av. Paseo de la Reforma 222, Juárez, Cuauhtémoc, 06600 Cuauhtemoc, CDMX, {lat:19.428809314912836, lon:-99.16169126910391}', '6', 'Disponible'), ('2', 'Plaza lindavista', '99.9998', '199.009', '63.5', '5', '6', '2', 'Av. Montevideo 363, Lindavista Sur, Gustavo A. Madero, 07300 Ciudad de México, CDMX, {lat:19.49215147959578, lon:-99.13359960338582}', '7', 'Disponible'), ('3', 'Patio Tlalpan', '99.9998', '199.009', '63.5', '5', '6', '2', 'Av. Insurgentes Sur 4177, Sta Úrsula Xitla, Tlalpan, 14420 Ciudad de México, CDMX, {lat:19.28380112062941, lon:-99.1771035356514}', '14', 'Disponible'), ('4', 'Plaza Antara', '99.9998', '199.009', '63.5', '5', '6', '2', 'Av. Ejército Nacional Mexicano 843-B, Granada, Miguel Hidalgo, 11520 Ciudad de México, CDMX, {lat:19.43902613507273, lon:-99.20223391079132}', '11', 'Disponible');
COMMIT;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
