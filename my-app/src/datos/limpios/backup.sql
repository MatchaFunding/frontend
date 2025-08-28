/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: MatchaFundingDB
-- ------------------------------------------------------
-- Server version	11.8.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `backend_beneficiario`
--

DROP TABLE IF EXISTS `backend_beneficiario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_beneficiario` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `FechaDeCreacion` date NOT NULL,
  `TipoDePersona` varchar(30) NOT NULL,
  `TipoDeEmpresa` varchar(30) NOT NULL,
  `Perfil` varchar(30) NOT NULL,
  `RUTdeEmpresa` varchar(12) NOT NULL,
  `RUTdeRepresentante` varchar(12) NOT NULL,
  `LugarDeCreacion_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_beneficiario_LugarDeCreacion_id_319c7c6a_fk_backend_u` (`LugarDeCreacion_id`),
  CONSTRAINT `backend_beneficiario_LugarDeCreacion_id_319c7c6a_fk_backend_u` FOREIGN KEY (`LugarDeCreacion_id`) REFERENCES `backend_ubicacion` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_beneficiario`
--

LOCK TABLES `backend_beneficiario` WRITE;
/*!40000 ALTER TABLE `backend_beneficiario` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `backend_beneficiario` VALUES
(1,'ASOCIACION CHILE DISENO','2025-01-01','NA','EIRL','EMP','507412300','507412300',1),
(2,'AGRICOLA JULIO GIDDINGS E I R L','2025-01-01','NA','EIRL','EMP','520014225','520014225',1),
(3,'BEATRIZ EDITH ARAYA ARANCIBIA ASESORIAS EN TECNOLOGIAS DE INFORMACION','2025-01-01','NA','EIRL','EMP','520015787','520015787',1),
(4,'SAENS POLIMEROS Y REVESTIMIENTOS LIMITADA','2025-01-01','NA','EIRL','EMP','520035087','520035087',1),
(5,'LACTEOS CHAUQUEN SPA','2025-01-01','NA','EIRL','EMP','520041435','520041435',1),
(6,'CALEB OTONIEL ARAYA CASTILLO','2025-01-01','NA','EIRL','EMP','520043462','520043462',1),
(7,'IQUIQUE TELEVISION PRODUCCIONES TELEVISIVAS Y EVENTOS LIMITADA','2025-01-01','NA','EIRL','EMP','520046666','520046666',1),
(8,'ALEJANDRO MARIO CAEROLS SILVA EIRL','2025-01-01','NA','EIRL','PER','520050310','520050310',1),
(9,'OSCAR ALCIDES TORRES CORTES E.I.R.L.','2025-01-01','NA','EIRL','EMP','520054642','520054642',1),
(10,'SOCIEDAD AGRICOLA Y VIVERO SAN RAFAEL LIMITADA','2025-01-01','NA','EIRL','EMP','533065740','533065740',1),
(11,'FUNDACION DESAFIO','2025-01-01','NA','EIRL','EMP','533090079','533090079',1),
(12,'FUNDACION BASURA','2025-01-01','NA','EIRL','EMP','533232264','533232264',1),
(13,'FRIMA S A','2025-01-01','NA','EIRL','EMP','590291404','590291404',1),
(14,'ACCIONA CONSTRUCCION S.A. AGENCIA CHILE','2025-01-01','NA','EIRL','EMP','590698601','590698601',1),
(15,'ENYSE AGENCIA CHILE S A','2025-01-01','NA','EIRL','EMP','591087800','591087800',1),
(16,'ANGLO AMERICAN TECHNICAL & SUSTAINABILITY SERVICES LTD - AGENCIA EN CHILE','2025-01-01','NA','EIRL','EMP','592803909','592803909',1),
(17,'LABORELEC LATIN AMERICA','2025-01-01','NA','EIRL','EMP','592819600','592819600',1),
(18,'INSTITUTO ANTARTICO CHILENO','2025-01-01','NA','EIRL','EMP','606050003','606050003',1),
(19,'INSTITUTO NACIONAL DE ESTADISTICAS','2025-01-01','NA','EIRL','EMP','607030006','607030006',1),
(20,'CASA DE MONEDA DE CHILE S.A.','2025-01-01','NA','EIRL','EMP','608060006','608060006',1),
(21,'SERVICIO NACIONAL DEL PATRIMONIO CULTURAL','2025-01-01','NA','EIRL','EMP','609050004','609050004',1),
(22,'UNIVERSIDAD DE CHILE','2025-01-01','NA','EIRL','EMP','609100001','609100001',1),
(23,'UNIVERSIDAD DE SANTIAGO DE CHILE','2025-01-01','NA','EIRL','EMP','609110007','609110007',1),
(24,'UNIVERSIDAD DEL BIO','2025-01-01','NA','EIRL','EMP','609110066','609110066',1),
(25,'UNIVERSIDAD DE VALPARAISO','2025-01-01','NA','EIRL','EMP','609210001','609210001',1),
(26,'ACADEMIA POLITECNICA MILITAR','2025-01-01','NA','EIRL','EMP','611010214','611010214',1),
(27,'INSTITUTO DE FOMENTO PESQUERO','2025-01-01','NA','EIRL','EMP','613100008','613100008',1),
(28,'INSTITUTO FORESTAL','2025-01-01','NA','EIRL','EMP','613110003','613110003',1),
(29,'MatchaFunding S.A.','2025-01-01','JU','SA','EMP','12.345.678-9','20.430.363-0',1),
(30,'BlastDynamics','2025-01-01','JU','SPA','EMP','21.123.456-9','21.430.363-0',1);
/*!40000 ALTER TABLE `backend_beneficiario` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_colaborador`
--

DROP TABLE IF EXISTS `backend_colaborador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_colaborador` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Persona_id` bigint(20) NOT NULL,
  `Proyecto_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_colaborador_Persona_id_c406811b_fk_backend_persona_ID` (`Persona_id`),
  KEY `backend_colaborador_Proyecto_id_4917ea19_fk_backend_proyecto_ID` (`Proyecto_id`),
  CONSTRAINT `backend_colaborador_Persona_id_c406811b_fk_backend_persona_ID` FOREIGN KEY (`Persona_id`) REFERENCES `backend_persona` (`ID`),
  CONSTRAINT `backend_colaborador_Proyecto_id_4917ea19_fk_backend_proyecto_ID` FOREIGN KEY (`Proyecto_id`) REFERENCES `backend_proyecto` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_colaborador`
--

LOCK TABLES `backend_colaborador` WRITE;
/*!40000 ALTER TABLE `backend_colaborador` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_colaborador` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_consorcio`
--

DROP TABLE IF EXISTS `backend_consorcio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_consorcio` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PrimerBeneficiario_id` bigint(20) NOT NULL,
  `SegundoBeneficiario_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_consorcio_PrimerBeneficiario_i_b6ef7ee0_fk_backend_b` (`PrimerBeneficiario_id`),
  KEY `backend_consorcio_SegundoBeneficiario__bdc99fa0_fk_backend_b` (`SegundoBeneficiario_id`),
  CONSTRAINT `backend_consorcio_PrimerBeneficiario_i_b6ef7ee0_fk_backend_b` FOREIGN KEY (`PrimerBeneficiario_id`) REFERENCES `backend_beneficiario` (`ID`),
  CONSTRAINT `backend_consorcio_SegundoBeneficiario__bdc99fa0_fk_backend_b` FOREIGN KEY (`SegundoBeneficiario_id`) REFERENCES `backend_beneficiario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_consorcio`
--

LOCK TABLES `backend_consorcio` WRITE;
/*!40000 ALTER TABLE `backend_consorcio` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_consorcio` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_financiador`
--

DROP TABLE IF EXISTS `backend_financiador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_financiador` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `FechaDeCreacion` date NOT NULL,
  `TipoDePersona` varchar(30) NOT NULL,
  `TipoDeEmpresa` varchar(30) NOT NULL,
  `Perfil` varchar(30) NOT NULL,
  `RUTdeEmpresa` varchar(12) NOT NULL,
  `RUTdeRepresentante` varchar(12) NOT NULL,
  `LugarDeCreacion_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_financiador_LugarDeCreacion_id_d8f71306_fk_backend_u` (`LugarDeCreacion_id`),
  CONSTRAINT `backend_financiador_LugarDeCreacion_id_d8f71306_fk_backend_u` FOREIGN KEY (`LugarDeCreacion_id`) REFERENCES `backend_ubicacion` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_financiador`
--

LOCK TABLES `backend_financiador` WRITE;
/*!40000 ALTER TABLE `backend_financiador` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_financiador` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_instrumento`
--

DROP TABLE IF EXISTS `backend_instrumento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_instrumento` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(200) NOT NULL,
  `Descripcion` varchar(1000) NOT NULL,
  `FechaDeApertura` date NOT NULL,
  `FechaDeCierre` date NOT NULL,
  `DuracionEnMeses` int(11) NOT NULL,
  `Beneficios` varchar(1000) NOT NULL,
  `Requisitos` varchar(1000) NOT NULL,
  `MontoMinimo` int(11) NOT NULL,
  `MontoMaximo` int(11) NOT NULL,
  `Estado` varchar(30) NOT NULL,
  `TipoDeBeneficio` varchar(30) NOT NULL,
  `TipoDePerfil` varchar(30) NOT NULL,
  `EnlaceDelDetalle` varchar(300) NOT NULL,
  `EnlaceDeLaFoto` varchar(300) NOT NULL,
  `Financiador_id` bigint(20) NOT NULL,
  `Alcance_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_instrumento_Financiador_id_0b587c15_fk_backend_f` (`Financiador_id`),
  KEY `backend_instrumento_Alcance_id_da2081fb_fk_backend_ubicacion_ID` (`Alcance_id`),
  CONSTRAINT `backend_instrumento_Alcance_id_da2081fb_fk_backend_ubicacion_ID` FOREIGN KEY (`Alcance_id`) REFERENCES `backend_ubicacion` (`ID`),
  CONSTRAINT `backend_instrumento_Financiador_id_0b587c15_fk_backend_f` FOREIGN KEY (`Financiador_id`) REFERENCES `backend_financiador` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_instrumento`
--

LOCK TABLES `backend_instrumento` WRITE;
/*!40000 ALTER TABLE `backend_instrumento` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_instrumento` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_miembro`
--

DROP TABLE IF EXISTS `backend_miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_miembro` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Beneficiario_id` bigint(20) NOT NULL,
  `Persona_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_miembro_Beneficiario_id_efa3b813_fk_backend_b` (`Beneficiario_id`),
  KEY `backend_miembro_Persona_id_1e107dcd_fk_backend_persona_ID` (`Persona_id`),
  CONSTRAINT `backend_miembro_Beneficiario_id_efa3b813_fk_backend_b` FOREIGN KEY (`Beneficiario_id`) REFERENCES `backend_beneficiario` (`ID`),
  CONSTRAINT `backend_miembro_Persona_id_1e107dcd_fk_backend_persona_ID` FOREIGN KEY (`Persona_id`) REFERENCES `backend_persona` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_miembro`
--

LOCK TABLES `backend_miembro` WRITE;
/*!40000 ALTER TABLE `backend_miembro` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_miembro` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_persona`
--

DROP TABLE IF EXISTS `backend_persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_persona` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(200) NOT NULL,
  `Sexo` varchar(30) NOT NULL,
  `RUT` varchar(12) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_persona`
--

LOCK TABLES `backend_persona` WRITE;
/*!40000 ALTER TABLE `backend_persona` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_persona` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_postulacion`
--

DROP TABLE IF EXISTS `backend_postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_postulacion` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Resultado` varchar(30) NOT NULL,
  `MontoObtenido` int(11) NOT NULL,
  `FechaDePostulacion` date NOT NULL,
  `FechaDeResultado` date NOT NULL,
  `Detalle` varchar(1000) NOT NULL,
  `Beneficiario_id` bigint(20) NOT NULL,
  `Instrumento_id` bigint(20) NOT NULL,
  `Proyecto_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_postulacion_Beneficiario_id_33a8b4c0_fk_backend_b` (`Beneficiario_id`),
  KEY `backend_postulacion_Instrumento_id_6de725d9_fk_backend_i` (`Instrumento_id`),
  KEY `backend_postulacion_Proyecto_id_4e2b289e_fk_backend_proyecto_ID` (`Proyecto_id`),
  CONSTRAINT `backend_postulacion_Beneficiario_id_33a8b4c0_fk_backend_b` FOREIGN KEY (`Beneficiario_id`) REFERENCES `backend_beneficiario` (`ID`),
  CONSTRAINT `backend_postulacion_Instrumento_id_6de725d9_fk_backend_i` FOREIGN KEY (`Instrumento_id`) REFERENCES `backend_instrumento` (`ID`),
  CONSTRAINT `backend_postulacion_Proyecto_id_4e2b289e_fk_backend_proyecto_ID` FOREIGN KEY (`Proyecto_id`) REFERENCES `backend_proyecto` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_postulacion`
--

LOCK TABLES `backend_postulacion` WRITE;
/*!40000 ALTER TABLE `backend_postulacion` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_postulacion` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_proyecto`
--

DROP TABLE IF EXISTS `backend_proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_proyecto` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(300) NOT NULL,
  `Descripcion` varchar(500) NOT NULL,
  `DuracionEnMesesMinimo` int(11) NOT NULL,
  `DuracionEnMesesMaximo` int(11) NOT NULL,
  `Area` varchar(100) NOT NULL,
  `Beneficiario_id` bigint(20) NOT NULL,
  `Alcance_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_proyecto_Beneficiario_id_83f3b5bc_fk_backend_b` (`Beneficiario_id`),
  KEY `backend_proyecto_Alcance_id_1a668a88_fk_backend_ubicacion_ID` (`Alcance_id`),
  CONSTRAINT `backend_proyecto_Alcance_id_1a668a88_fk_backend_ubicacion_ID` FOREIGN KEY (`Alcance_id`) REFERENCES `backend_ubicacion` (`ID`),
  CONSTRAINT `backend_proyecto_Beneficiario_id_83f3b5bc_fk_backend_b` FOREIGN KEY (`Beneficiario_id`) REFERENCES `backend_beneficiario` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_proyecto`
--

LOCK TABLES `backend_proyecto` WRITE;
/*!40000 ALTER TABLE `backend_proyecto` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `backend_proyecto` VALUES
(1,'Actividades de Consultoria de Gestion','Servicios de consultoría en gestión empresarial, optimización de procesos y estrategias de crecimiento.',6,12,'Consultoría',1,1),
(2,'Actividades de Asociaciones Profesionales','Promoción y desarrollo de actividades de colaboración entre profesionales y organizaciones del sector diseño.',6,12,'Diseño',1,1),
(3,'011101 - Cultivo de Trigo','Cultivo de trigo, incluyendo el cultivo de trigos para consumo humano y animal.',6,12,'Agricultura',2,1),
(4,'011902 - Cultivos Forrajeros En Praderas Mejoradas o Sembradas','Cultivo de forraje para consumo animal y alimentación.',6,12,'Agricultura',2,1),
(5,'012600 - Cultivo de Frutos Oleaginosos (incluye El Cultivo de Aceitunas)','Cultivo de aceitunas, incluyendo el cultivo de aceitunas para consumo humano y animal.',6,12,'Agricultura',2,1),
(6,'Alquiler de Bienes Inmuebles Amoblados o con Equipos y Maquinarias','Asesoría en tecnologías de información, incluyendo la gestión de propiedades y la prestación de servicios de apoyo a empresas.',6,12,'Servicios de Apoyo a Empresas',3,1),
(7,'Compra, Venta y Alquiler (excepto Amoblados) de Inmuebles','Compra, venta y alquiler de inmuebles, excluyendo propiedades amobladas.',6,12,'Inmobiliaria',3,1),
(8,'Otras Actividades de Servicios de Apoyo N.C.P.','Prestación de servicios de apoyo a empresas.',6,12,'Servicios Personales',3,1),
(9,'Otras Actividades de Servicios Personales N.C.P.','Prestación de servicios personales.',6,12,'Servicios Personales',3,1),
(10,'Constccion de Otras Obras de Ingenieria Civil','Construccion de otras obras de ingeniería civil.',6,12,'Ingenieria Civil',4,1),
(11,'Otras Actividades Especializadas de Construccion','Otras actividades especializadas de construcción.',6,12,'Construccion',4,1),
(12,'Otras Actividades de Servicios de Apoyo A Las Empresas N.C.P.','Servicios de apoyo a empresas N.C.P.',6,12,'Servicios de Apoyo',4,1),
(13,'Elaboracion de Productos Lacteos','Producción y comercialización de productos lácteos.',6,12,'Alimentos y Bebidas',5,1),
(14,'Fabricacion de Otros Productos Elaborados de Metal','Fabricación de diversos productos metálicos, incluyendo piezas personalizadas.',6,12,'Fabricacion',6,1),
(15,'Terminacion y Acabado de Edificios','Proceso de finalización de obras de construcción y remodelación.',6,12,'Construcción',7,1),
(16,'Otros Actividades de Transporte de Pasajeros Por Via Terrestre','Transporte de pasajeros por carretera.',6,12,'Transporte',7,1),
(17,'Transmisiones de Radio','Transmisión de radio.',6,12,'Comunicación',7,1),
(18,'Programacion y Transmisiones de Television','Programación y transmisión de televisión.',6,12,'Comunicación',7,1),
(19,'Servicios de Publicidad Prestados Por Empresas','Prestación de servicios de publicidad.',6,12,'Servicios',7,1),
(20,'Elaboracion de Vinos','Produccion de vinos de alta calidad, con enfoque en la excelencia y la tradición.',6,12,'Vinos',8,1),
(21,'Produccion de Aguas Minerales y Otras Aguas Embotelladas','Produccion de aguas minerales y otras aguas embotelladas, con control de calidad y trazabilidad.',6,12,'Agua Mineral',8,1),
(22,'Suministro de Comidas Por Encargo (servicios de Banqueteria)','Proporcionamiento de servicios de catering para eventos y reuniones.',6,12,'Servicios de Catering',8,1),
(23,'Otras Actividades de Esparcimiento y Recreativas N.C.P.','Actividades de promoción y recreación, con enfoque en la calidad y la innovación.',6,12,'Esparcimiento y Recreativas',8,1),
(24,'Servicios Profesionales de Ingenieria y Actividades Conexas de Consultoria Tecnica','Ofrece servicios de ingeniería y consultoría técnica especializada empaquetados en soluciones de negocio.',6,12,'Servicios Profesionales de Ingenieria y Actividades Conexas de Consultoria Tecnica',9,1),
(25,'Cultivo de Plantas Vivas','Cultivo de plantas vivas, incluyendo la producción en viveros.',6,12,'Agricultura',10,1),
(26,'Venta Al Por Menor de Libros En Comercios Especializados','Venta de libros especializados a través de una red de comercios.',6,12,'Venta al Por Menor',11,1),
(27,'Otras Actividades de Servicios de Apoyo A Las Empresas N.C.P.','Ofrecimiento de servicios de apoyo a empresas.',6,12,'Servicios de Apoyo a Empresas',11,1),
(28,'Fundaciones y Corporaciones, Asociaciones Que Promueven Actividades Culturales o Recreativas','Promoción de actividades culturales y recreativas.',6,12,'Organizaciones Sin P. Juridica',11,1),
(29,'Fundación Basura','Programa de reciclaje y gestión de residuos sólidos urbanos.',6,12,'Reciclaje y Gestión de Residuos',12,1),
(30,'Cria de Ganado Bovino para La Produccion de Carne o Como Ganado Reproductor','El proyecto se enfoca en la producción de ganado bovino, con énfasis en la carne y la reproducción, optimizando la eficiencia y la rentabilidad.',6,12,'Ganadería',13,1),
(31,'Explotacion de Mataderos de Bovinos, Ovinos, Equinos, Caprinos, Porcinos y Camelidos','Se trata de la explotación de mataderos de animales de granja, con el objetivo de maximizar la producción y la eficiencia de la operación.',6,12,'Ganadería',13,1),
(32,'Transporte de Carga Por Carretera','El proyecto implica la operación de transporte de carga por carretera, asegurando la entrega eficiente de mercancías.',6,12,'Transporte',13,1),
(33,'Procesamiento de Datos, Hospedaje y Actividades Conexas','Se trata de la prestación de servicios de procesamiento de datos, alojamiento y otras actividades relacionadas con la tecnología.',6,12,'Servicios',13,1),
(34,'Otras Actividades de Servicios de Apoyo A Las Empresas N.C.P.','El proyecto se enfoca en ofrecer servicios de apoyo a las empresas N.C.P.',6,12,'Servicios',13,1),
(35,'Construccion de Carreteras y Lineas de Ferrocarril','Diseño, construcción y mantenimiento de infraestructuras de transporte por carretera y ferrocarril.',6,12,'Transporte y Construcción',14,1),
(36,'Construccion de Proyectos de Servicio Publico','Construccion de proyectos de infraestructura de servicios públicos.',6,12,'Servicios Públicos',14,1),
(37,'Fondos y Sociedades de Inversion y Entidades Financieras','Inversiones y gestión de activos financieros.',6,12,'Inversión y Financiamiento',14,1),
(38,'Servicios de Arquitectura (diseño de Edificios, Dibujo de Planos de Construccion, Entre Otros)','Diseño y elaboración de planos de construcción, dibujo de planos de construcción y otros servicios relacionados.',6,12,'Arquitectura',14,1),
(39,'Servicios Profesionales de Ingenieria y Actividades Conexas de Consultoria Tecnica','Servicios de consultoría y diseño técnico.',6,12,'Ingeniería y Consultoría',14,1),
(40,'Construccion de Carreteras y Lineas de Ferrocarril','Proyectos de construcción de carreteras y líneas de ferrocarril.',6,12,'Construccion de Carreteras y Lineas de Ferrocarril',15,1),
(41,'Empresas de Servicios de Ingenieria y Actividades Conexas de Consultoria Tecnica','Servicios de ingeniería y actividades conexas de consultoría técnica para empresas.',6,12,'Servicios de Ingeniería y Consultoría',16,1),
(42,'Venta Al Por Mayor No Especializada','Venta de productos a granel a clientes.',6,12,'Venta al Por Mayor',17,1),
(43,'Investigaciones y Desarrollo Experimental En El Campo de Las Ciencias Naturales y La Ingenieria','Investigación y desarrollo en ciencias naturales y ingeniería.',6,12,'Investigaciones y Desarrollo Experimental',17,1),
(44,'Actividades de La Administracion Publica En General','El proyecto se centra en la administración pública general, incluyendo la gestión de recursos y servicios públicos.',6,12,'Administración Pública',18,1),
(45,'Actividades de La Administracion Publica En General','El proyecto se centra en la recopilación y análisis de datos estadísticos para mejorar la toma de decisiones.',6,12,'Administración Publica',19,1),
(46,'Actividades de Servicios Relacionadas con La Impresion','Servicios de impresión de diversos productos de metal, incluyendo la fabricación de piezas personalizadas y la impresión de materiales de marketing.',6,12,'Fabricacion de Otros Productos Elaborados de Metal',20,1),
(47,'Actividades de Servicios de Apoyo A Las Empresas','Ofrecemos servicios de apoyo a empresas, incluyendo la gestión de documentos, la asistencia técnica y la creación de informes.',6,12,'Servicios de Apoyo A Las Empresas',20,1),
(48,'Actividades de La Administracion Publica En General','El proyecto se centra en la gestión de recursos públicos y la prestación de servicios administrativos.',6,12,'Administración Publica',21,1),
(49,'Actividades de Bibliotecas y Archivos','La actividad implica la conservación, gestión y acceso a materiales bibliográficos y archivos.',6,12,'Bibliotecas y Archivos',21,1),
(50,'Actividades de Museos, Gestion de Lugares y Edificios Historicos','El proyecto se enfoca en la preservación y promoción de lugares históricos y museos.',6,12,'Museos y Lugares Históricos',21,1),
(51,'Actividades de Hospitales y Clinicas Publicas','Servicios de atención médica y hospitalización para pacientes públicos.',6,12,'Salud Pública',22,1),
(52,'Fabricacion de Computadores y Equipo Periferico','Producción de hardware y periféricos informáticos.',6,12,'Informática y Tecnología de la Información',23,1),
(53,'Venta Al Por Mayor de Libros','Venta de libros a granel.',6,12,'Comercio Minorista',23,1),
(54,'Venta Al Por Menor de Libros En Comercios Especializados','Venta de libros a minoristas.',6,12,'Comercio Minorista',23,1),
(55,'Venta Al Por Menor de Libros','Venta de libros a minoristas.',6,12,'Comercio Minorista',23,1),
(56,'Actividades de Restaurantes y de Servicio Movil de Comidas','Servicio de comidas en restaurantes y servicios de entrega.',6,12,'Servicios de Comida',23,1),
(57,'Edicion de Libros','Producción de libros.',6,12,'Libros',23,1),
(58,'Transmisiones de Radio','Transmisión de radio.',6,12,'Comunicación',23,1),
(59,'Programacion y Transmisiones de Television','Programación y transmisión de televisión.',6,12,'Comunicación',23,1),
(60,'Compra, Venta y Alquiler (excepto Amoblados) de Inmuebles','Compra, venta y alquiler de inmuebles.',6,12,'Inmobiliaria',23,1),
(61,'Fotocopiado, Preparacion de Documentos y Otras Actividades Especializadas de Apoyo de Oficina','Servicios de apoyo de oficina.',6,12,'Servicios de Oficina',23,1),
(62,'Enseñanza Superior En Universidades Publicas','Formación superior.',6,12,'Educación',23,1),
(63,'Enseñanza Superior En Universidades Publicas','Actividades de Apoyo A La Enseñanza',6,12,'Enseñanza Superior',24,1),
(64,'Cultivo de Hortalizas y Melones','Cultivo de hortalizas y melones',6,12,'Agricultura',25,1),
(65,'Cria de Otros Animales N.C.P. 325001','Cria de otros animales',6,12,'Animales',25,1),
(66,'Actividades de Laboratorios Dentales','Servicios de laboratorio dental',6,12,'Salud',25,1),
(67,'Venta Al Por Mayor de Libros','Venta de libros',6,12,'Comercio Minorista',25,1),
(68,'Venta Al Por Menor de Libros En Comercios Especializados','Venta de libros en comercios especializados',6,12,'Comercio Minorista',25,1),
(69,'Venta Al Por Menor de Articulos de Papeleria y Escritorio En Comercios Especializados','Venta de artículos de papeleria y escritura',6,12,'Comercio Minorista',25,1),
(70,'Venta Al Por Menor de Inmuebles','Compra, Venta y Alquiler de Inmuebles',6,12,'Inmobiliaria',25,1),
(71,'Otros Actividades de Gestion','Actividades de gestión',6,12,'Administración',25,1),
(72,'Enseñanza Superior En Universidades Publicas','Formación superior',6,12,'Educación',25,1),
(73,'Actividades de Consultoria de Gestion','Servicios de consultoría',6,12,'Consultoría',25,1),
(74,'Actividades de Defensa','842200 - Actividades de Defensa',6,12,'Defensa',26,1),
(75,'Investigaciones y Desarrollo Experimental En El Campo de Las Ciencias Sociales y Las Humanidades','Investigación en ciencias sociales y humanidades.',6,12,'Investigaciones y Desarrollo Experimental',27,1),
(76,'Investigaciones y Desarrollo Experimental En El Campo de Las Ciencias Naturales y La Ingenieria','Investigación y desarrollo experimental en el campo de las ciencias naturales y la ingeniería, incluyendo la investigación de nuevos métodos de cultivo y la mejora de las técnicas de conservación.',6,12,'Ciencias Naturales y Ingeniería',28,1),
(77,'Actividades de Investigacion (incluye Actividades de Investigadores y Detectives Privados)','Actividades de investigación y desarrollo experimental en el campo de las ciencias sociales y las humanidades, enfocadas en la investigación de temas como la historia, la literatura y las artes.',6,12,'Ciencias Sociales y Humanidades',28,1);
/*!40000 ALTER TABLE `backend_proyecto` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_ubicacion`
--

DROP TABLE IF EXISTS `backend_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_ubicacion` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Region` varchar(30) NOT NULL,
  `Capital` varchar(30) NOT NULL,
  `Calle` varchar(300) NOT NULL,
  `Numero` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_ubicacion`
--

LOCK TABLES `backend_ubicacion` WRITE;
/*!40000 ALTER TABLE `backend_ubicacion` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `backend_ubicacion` VALUES
(1,'RM','Santiago','Av. Libertador Bernardo O\'Higgins',123);
/*!40000 ALTER TABLE `backend_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `backend_usuario`
--

DROP TABLE IF EXISTS `backend_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_usuario` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NombreDeUsuario` varchar(200) NOT NULL,
  `Contrasena` varchar(200) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Persona_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `backend_usuario_Persona_id_0d597647_fk_backend_persona_ID` (`Persona_id`),
  CONSTRAINT `backend_usuario_Persona_id_0d597647_fk_backend_persona_ID` FOREIGN KEY (`Persona_id`) REFERENCES `backend_persona` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_usuario`
--

LOCK TABLES `backend_usuario` WRITE;
/*!40000 ALTER TABLE `backend_usuario` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `backend_usuario` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `django_migrations` VALUES
(1,'backend','0001_initial','2025-08-21 14:39:53.640097');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-08-21 14:06:07
