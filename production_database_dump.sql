-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: imbesdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category_milestones`
--

DROP TABLE IF EXISTS `category_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_milestones` (
  `milestoneId` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `milestoneName` varchar(255) NOT NULL,
  `description` text,
  `sequenceOrder` int NOT NULL,
  `userId` int DEFAULT NULL,
  `voided` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`milestoneId`),
  KEY `userId` (`userId`),
  KEY `fk_category_milestones_category` (`categoryId`),
  CONSTRAINT `category_milestones_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `fk_category_milestones_category` FOREIGN KEY (`categoryId`) REFERENCES `kemri_categories` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_milestones`
--

LOCK TABLES `category_milestones` WRITE;
/*!40000 ALTER TABLE `category_milestones` DISABLE KEYS */;
INSERT INTO `category_milestones` VALUES (1,1,'sdsd test','dsd',1,1,0,'2025-08-08 22:27:14','2025-08-12 11:25:03'),(2,1,'Walling','ww',2,1,0,'2025-08-08 22:27:59','2025-08-08 22:27:59'),(3,1,'Roofing','2',3,1,0,'2025-08-08 22:28:18','2025-08-08 22:28:18'),(4,1,'Plumbing','',5,1,0,'2025-08-08 22:28:48','2025-08-08 22:28:48'),(5,1,'Finishing','',6,1,0,'2025-08-08 22:29:14','2025-08-08 22:29:14'),(6,1,'Painting','dd',6,1,0,'2025-08-08 22:30:27','2025-08-08 22:30:27'),(7,1,'Electrical works','',7,1,0,'2025-08-08 22:31:03','2025-08-08 22:31:03'),(8,1,'aa','aa',8,1,0,'2025-08-08 22:43:44','2025-08-08 22:43:44'),(9,1,'ssd','sdsd',9,1,0,'2025-08-08 22:44:18','2025-08-08 22:44:18'),(10,1,'Signage Installation','dsds',10,1,0,'2025-08-09 00:35:53','2025-08-09 00:35:53'),(11,1,'Landscapping and Installation of Gates','dsds',12,1,0,'2025-08-09 01:25:32','2025-08-09 01:25:32'),(12,1,'fdfd','fdfd',13,1,0,'2025-08-09 02:07:54','2025-08-09 02:07:54'),(15,3,'Data Collection Phase',NULL,1,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(16,3,'Environmental assessments',NULL,2,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(17,3,'Community health surveys','Implement community health surveys.',3,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(18,3,'Water source sampling',NULL,4,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(19,3,'Assessment of Vector breeding sites',NULL,5,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(20,3,'Document land use changes','sasas',6,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(21,3,'asante sana te','weda moses',7,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(22,3,'ASDUE has delayed','sema',8,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(23,3,'were','dsds',9,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(24,3,'weqwewqe','wewqe',10,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(25,3,'Baseline Household Survey','Conduct initial household surveys to collect demographic and health data.',11,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(26,3,'Climate Data Acquisition','Obtain historical and real-time climate data (temperature, rainfall) from meteorological departments.',12,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(27,3,'Vector Breeding Site Mapping','Identify and map potential mosquito breeding sites in target sub-counties.',13,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(28,3,'Community Health Worker Training','Train local community health workers on data collection protocols and questionnaire administration.',14,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(29,3,'Data Entry and Cleaning','Enter collected survey data into the project database and perform data cleaning/validation.',15,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(30,3,'Statistical Analysis of Baseline Data','Perform preliminary statistical analysis on baseline health and climate data.',16,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(31,3,'Develop Predictive Model Prototype','Create a prototype predictive model for disease outbreaks based on climate data.',17,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(32,3,'Stakeholder Feedback Workshop','Organize a workshop with local stakeholders to review initial findings and model utility.',18,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(33,3,'ASAS','SA',19,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(34,3,'ASASus','South african man',20,NULL,0,'2025-08-12 11:16:18','2025-08-12 13:04:25'),(46,2,'Bush Clearing','',1,1,0,'2025-08-12 12:46:58','2025-08-12 12:46:58'),(47,4,'ICT Equipment Supply','',1,1,0,'2025-08-13 19:22:23','2025-08-13 19:22:23'),(48,4,'Equipment Configuration','',2,1,0,'2025-08-13 19:22:44','2025-08-13 19:22:44'),(49,4,'Installation of SSL Certificates','',3,1,0,'2025-08-13 19:23:09','2025-08-13 19:23:09');
/*!40000 ALTER TABLE `category_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message_reactions`
--

DROP TABLE IF EXISTS `chat_message_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message_reactions` (
  `message_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction_type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`,`user_id`,`reaction_type`),
  KEY `fk_chat_reactions_user` (`user_id`),
  CONSTRAINT `fk_chat_reactions_message` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message_reactions`
--

LOCK TABLES `chat_message_reactions` WRITE;
/*!40000 ALTER TABLE `chat_message_reactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_message_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message_text` text,
  `message_type` enum('text','file','image','system','announcement') DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `reply_to_message_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`message_id`),
  KEY `fk_chat_messages_room` (`room_id`),
  KEY `fk_chat_messages_sender` (`sender_id`),
  KEY `fk_chat_messages_reply` (`reply_to_message_id`),
  KEY `idx_chat_messages_created_at` (`created_at`),
  KEY `idx_chat_messages_room_created` (`room_id`,`created_at`),
  CONSTRAINT `fk_chat_messages_reply` FOREIGN KEY (`reply_to_message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_chat_messages_room` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,12,2,'hghgfhgfh','text',NULL,NULL,NULL,NULL,'2025-10-02 15:53:50',NULL,0),(2,12,31,'niko poa how are you','text',NULL,NULL,NULL,NULL,'2025-10-02 15:54:38',NULL,0),(3,12,2,'dsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 16:02:22',NULL,0),(4,12,2,'sdsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 16:02:27',NULL,0),(5,12,2,NULL,'file','/uploads/chat-files/1759420964744-595003802.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 16:02:44',NULL,0),(6,12,2,NULL,'file','/uploads/chat-files/1759421009939-367479377.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 16:03:29',NULL,0),(7,12,2,'here is the report','text',NULL,NULL,NULL,NULL,'2025-10-02 16:03:38',NULL,0),(8,12,2,'dsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 16:43:45',NULL,0),(9,12,2,NULL,'file','/uploads/chat-files/1759423442096-436047433.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 16:44:02',NULL,0),(10,12,2,'dsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 16:44:05',NULL,0),(11,12,2,'sdsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 16:45:45',NULL,0),(12,12,2,NULL,'file','/uploads/chat-files/1759423555728-306812729.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 16:45:55',NULL,0),(13,12,2,'dsds','text',NULL,NULL,NULL,NULL,'2025-10-02 16:52:28',NULL,0),(14,12,2,NULL,'file','/uploads/chat-files/1759423961113-678958785.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 16:52:41',NULL,0),(15,12,2,'here is the list of projects','text',NULL,NULL,NULL,NULL,'2025-10-02 16:52:51',NULL,0),(16,12,2,NULL,'file','/uploads/chat-files/1759425271724-251066064.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 17:14:31',NULL,0),(17,12,2,'sdsdsd','text',NULL,NULL,NULL,NULL,'2025-10-02 17:14:34',NULL,0),(18,12,2,NULL,'file','/uploads/chat-files/1759425282999-573352039.xlsx','enhanced_projects_template.xlsx',13011,NULL,'2025-10-02 17:14:43',NULL,0),(19,12,2,'xcxc','text',NULL,NULL,NULL,NULL,'2025-10-02 17:16:32',NULL,0),(20,12,2,NULL,'file','/uploads/chat-files/1759426052154-593580726.xlsx','enhanced_strategic_plan_template.xlsx',7749,NULL,'2025-10-02 17:27:32',NULL,0),(21,12,2,'ddf','text',NULL,NULL,NULL,NULL,'2025-10-02 17:27:40',NULL,0),(22,12,2,'ttt','text',NULL,NULL,NULL,NULL,'2025-10-02 17:56:36',NULL,0),(23,12,2,NULL,'file','/uploads/chat-files/1759427855698-693918302.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 17:57:35',NULL,0),(24,12,2,'ere','text',NULL,NULL,NULL,NULL,'2025-10-02 17:58:27',NULL,0),(25,12,31,'ddfdfdfd','text',NULL,NULL,NULL,NULL,'2025-10-02 17:59:00',NULL,0),(26,12,31,'semeni','text',NULL,NULL,NULL,NULL,'2025-10-02 17:59:42',NULL,0),(27,12,31,'5t6556','text',NULL,NULL,NULL,NULL,'2025-10-02 18:32:03',NULL,0),(28,12,31,'r3r43r3r','text',NULL,NULL,NULL,NULL,'2025-10-02 18:33:08',NULL,0),(29,12,31,'tyytyty','text',NULL,NULL,NULL,NULL,'2025-10-02 18:33:15',NULL,0),(30,12,31,'4343r3rrer','text',NULL,NULL,NULL,NULL,'2025-10-02 18:33:35',NULL,0),(31,11,31,NULL,'file','/uploads/chat-files/1759430046056-171667113.xlsx','PROJECTS.xlsx',9068,NULL,'2025-10-02 18:34:06',NULL,0),(32,12,2,NULL,'image','/uploads/chat-files/1759432017109-68326504.jpeg','Untitled.jpeg',7434,NULL,'2025-10-02 19:06:57',NULL,0),(33,12,2,'dfdf','text',NULL,NULL,NULL,NULL,'2025-10-02 19:07:00',NULL,0),(34,12,2,'how are you','text',NULL,NULL,NULL,NULL,'2025-10-02 19:34:04',NULL,0),(35,11,2,'Helo','text',NULL,NULL,NULL,NULL,'2025-10-02 19:35:48',NULL,0),(36,13,2,'assdsad','text',NULL,NULL,NULL,NULL,'2025-10-03 07:49:44',NULL,0),(37,13,2,'cxcx','text',NULL,NULL,NULL,NULL,'2025-10-03 07:55:01',NULL,0),(38,13,2,NULL,'file','/uploads/chat-files/1759478118943-703137383.docx','wilco-letterhead.pdf mama Ngina-4.docx',26962,NULL,'2025-10-03 07:55:18',NULL,0),(39,13,2,'that is the files','text',NULL,NULL,NULL,NULL,'2025-10-03 07:55:36',NULL,0),(40,11,2,'dfdfdfdf','text',NULL,NULL,NULL,NULL,'2025-10-03 08:15:10',NULL,0),(41,12,2,'sdsdsadas','text',NULL,NULL,NULL,NULL,'2025-10-03 08:16:01',NULL,0),(42,12,2,'iko wapi','text',NULL,NULL,NULL,NULL,'2025-10-03 08:21:04',NULL,0),(43,12,2,'we are still working','text',NULL,NULL,NULL,NULL,'2025-10-04 12:18:40',NULL,0),(44,12,16,'i am am here','text',NULL,NULL,NULL,NULL,'2025-10-04 12:28:16',NULL,0),(45,11,2,'you are welcome','text',NULL,NULL,NULL,NULL,'2025-10-12 17:38:29',NULL,0),(46,12,2,'Great day','text',NULL,NULL,NULL,NULL,'2025-10-12 17:39:23',NULL,0),(47,12,2,NULL,'file','/uploads/chat-files/1760290793224-450111216.pdf','wilco-letterhead.pdf mama Ngina-4.pdf',881636,NULL,'2025-10-12 17:39:53',NULL,0);
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_participants`
--

DROP TABLE IF EXISTS `chat_room_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_participants` (
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `is_muted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`room_id`,`user_id`),
  KEY `fk_chat_participants_user` (`user_id`),
  KEY `idx_chat_participants_user` (`user_id`),
  CONSTRAINT `fk_chat_participants_room` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_participants_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_participants`
--

LOCK TABLES `chat_room_participants` WRITE;
/*!40000 ALTER TABLE `chat_room_participants` DISABLE KEYS */;
INSERT INTO `chat_room_participants` VALUES (1,1,'2025-10-02 11:51:36',NULL,1,0),(1,2,'2025-10-02 13:33:38','2025-10-12 17:47:09',0,0),(1,32,'2025-10-02 15:39:56',NULL,0,0),(2,1,'2025-10-02 11:51:36',NULL,1,0),(2,2,'2025-10-02 13:33:38','2025-10-12 17:42:17',0,0),(2,32,'2025-10-02 15:39:56',NULL,0,0),(3,1,'2025-10-02 11:51:36',NULL,1,0),(3,2,'2025-10-02 13:33:38','2025-10-12 18:06:53',0,0),(3,32,'2025-10-02 15:39:56',NULL,0,0),(4,1,'2025-10-02 11:51:51',NULL,1,0),(5,1,'2025-10-02 11:51:51',NULL,1,0),(6,1,'2025-10-02 11:51:51',NULL,1,0),(7,1,'2025-10-02 12:46:37',NULL,1,0),(8,1,'2025-10-02 12:46:37',NULL,1,0),(9,1,'2025-10-02 12:46:37',NULL,1,0),(10,2,'2025-10-02 14:24:52','2025-10-12 17:47:07',1,0),(11,2,'2025-10-02 14:29:12','2025-10-12 17:57:35',1,0),(11,31,'2025-10-02 14:29:13',NULL,0,0),(12,2,'2025-10-02 14:52:28','2025-10-14 09:19:55',1,0),(12,16,'2025-10-02 14:52:29','2025-10-04 12:30:13',0,0),(12,29,'2025-10-02 14:52:29',NULL,0,0),(12,31,'2025-10-02 14:52:28','2025-10-02 18:52:54',0,0),(13,1,'2025-10-03 07:43:46',NULL,0,0),(13,2,'2025-10-03 07:43:46','2025-10-14 05:13:55',0,0),(13,3,'2025-10-03 07:43:46',NULL,0,0),(13,4,'2025-10-03 07:43:46',NULL,0,0),(13,5,'2025-10-03 07:43:46',NULL,0,0),(13,6,'2025-10-03 07:43:46',NULL,0,0),(13,7,'2025-10-03 07:43:46',NULL,0,0),(13,8,'2025-10-03 07:43:46',NULL,0,0),(13,11,'2025-10-03 07:43:46',NULL,0,0),(13,12,'2025-10-03 07:43:46',NULL,0,0),(13,13,'2025-10-03 07:43:46',NULL,0,0),(13,21,'2025-10-03 07:43:46',NULL,0,0),(13,22,'2025-10-03 07:43:46',NULL,0,0),(13,23,'2025-10-03 07:43:46',NULL,0,0),(13,24,'2025-10-03 07:43:46',NULL,0,0),(13,27,'2025-10-03 07:43:46',NULL,0,0),(13,28,'2025-10-03 07:43:46',NULL,0,0),(13,29,'2025-10-03 07:43:46',NULL,0,0),(13,30,'2025-10-03 07:43:46',NULL,0,0),(14,9,'2025-10-03 07:43:46',NULL,0,0),(14,10,'2025-10-03 07:43:46',NULL,0,0),(15,14,'2025-10-03 07:43:46',NULL,0,0),(15,15,'2025-10-03 07:43:46',NULL,0,0),(15,16,'2025-10-03 07:43:46','2025-10-04 12:30:12',0,0),(15,26,'2025-10-03 07:43:46',NULL,0,0),(16,32,'2025-10-03 07:43:46',NULL,0,0),(17,17,'2025-10-03 07:43:46',NULL,0,0),(17,18,'2025-10-03 07:43:46',NULL,0,0),(17,19,'2025-10-03 07:43:46',NULL,0,0),(17,20,'2025-10-03 07:43:46',NULL,0,0),(17,25,'2025-10-03 07:43:46',NULL,0,0),(19,31,'2025-10-03 07:43:46',NULL,0,0);
/*!40000 ALTER TABLE `chat_room_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_rooms`
--

DROP TABLE IF EXISTS `chat_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) NOT NULL,
  `room_type` enum('direct','group','project','department','role') NOT NULL,
  `project_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `fk_chat_rooms_project` (`project_id`),
  KEY `fk_chat_rooms_creator` (`created_by`),
  KEY `idx_chat_rooms_type` (`room_type`),
  KEY `idx_chat_rooms_active` (`is_active`),
  KEY `fk_chat_rooms_role` (`role_id`),
  CONSTRAINT `fk_chat_rooms_creator` FOREIGN KEY (`created_by`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_rooms_project` FOREIGN KEY (`project_id`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_rooms_role` FOREIGN KEY (`role_id`) REFERENCES `kemri_roles` (`roleId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_rooms`
--

LOCK TABLES `chat_rooms` WRITE;
/*!40000 ALTER TABLE `chat_rooms` DISABLE KEYS */;
INSERT INTO `chat_rooms` VALUES (1,'General Discussion','group',NULL,NULL,1,'General team discussions and announcements','2025-10-02 11:51:36','2025-10-02 11:51:36',1,NULL),(2,'Project Updates','group',NULL,NULL,1,'Share project updates and milestones','2025-10-02 11:51:36','2025-10-02 11:51:36',1,NULL),(3,'Technical Support','group',NULL,NULL,1,'Technical questions and IT support','2025-10-02 11:51:36','2025-10-02 11:51:36',1,NULL),(4,'General Discussion','group',NULL,NULL,1,'General team discussions and announcements','2025-10-02 11:51:51','2025-10-02 11:51:51',1,NULL),(5,'Project Updates','group',NULL,NULL,1,'Share project updates and milestones','2025-10-02 11:51:51','2025-10-02 11:51:51',1,NULL),(6,'Technical Support','group',NULL,NULL,1,'Technical questions and IT support','2025-10-02 11:51:51','2025-10-02 11:51:51',1,NULL),(7,'General Discussion','group',NULL,NULL,1,'General team discussions and announcements','2025-10-02 12:46:37','2025-10-02 12:46:37',1,NULL),(8,'Project Updates','group',NULL,NULL,1,'Share project updates and milestones','2025-10-02 12:46:37','2025-10-02 12:46:37',1,NULL),(9,'Technical Support','group',NULL,NULL,1,'Technical questions and IT support','2025-10-02 12:46:37','2025-10-02 12:46:37',1,NULL),(10,'ssdsd','group',NULL,NULL,2,'sdsdsd','2025-10-02 14:24:52','2025-10-02 14:24:52',1,NULL),(11,'ssdsd','group',NULL,NULL,2,'sdsdsd','2025-10-02 14:29:12','2025-10-02 14:29:12',1,NULL),(12,'Revenue System Specification','group',NULL,NULL,2,'See attached specication','2025-10-02 14:52:28','2025-10-02 14:52:28',1,NULL),(13,'admin Discussion','role',NULL,NULL,1,'Discussion room for admin role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,1),(14,'Contractor Discussion','role',NULL,NULL,1,'Discussion room for Contractor role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,21),(15,'data_entry Discussion','role',NULL,NULL,1,'Discussion room for data_entry role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,3),(16,'ICT Admin Discussion','role',NULL,NULL,1,'Discussion room for ICT Admin role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,20),(17,'manager Discussion','role',NULL,NULL,1,'Discussion room for manager role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,2),(18,'project_lead Discussion','role',NULL,NULL,1,'Discussion room for project_lead role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,5),(19,'user Discussion','role',NULL,NULL,1,'Discussion room for user role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,6),(20,'viewer Discussion','role',NULL,NULL,1,'Discussion room for viewer role members','2025-10-03 07:43:40','2025-10-03 07:43:40',1,4);
/*!40000 ALTER TABLE `chat_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component_data_access_rules`
--

DROP TABLE IF EXISTS `component_data_access_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_data_access_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_key` varchar(100) NOT NULL,
  `rule_type` enum('department','ward','project','budget','status','custom') NOT NULL,
  `rule_config` json NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comp_access_component` (`component_key`),
  KEY `idx_rule_type` (`rule_type`),
  CONSTRAINT `fk_comp_access_component` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_data_access_rules`
--

LOCK TABLES `component_data_access_rules` WRITE;
/*!40000 ALTER TABLE `component_data_access_rules` DISABLE KEYS */;
INSERT INTO `component_data_access_rules` VALUES (1,'metrics','department','{\"show_all_if_admin\": true, \"apply_department_filter\": true}',1,'2025-10-02 05:47:03','2025-10-02 05:47:03');
/*!40000 ALTER TABLE `component_data_access_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_components`
--

DROP TABLE IF EXISTS `dashboard_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_key` varchar(100) NOT NULL,
  `component_name` varchar(200) NOT NULL,
  `component_type` varchar(50) NOT NULL,
  `component_file` varchar(200) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `component_key` (`component_key`),
  KEY `idx_dashboard_components_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_components`
--

LOCK TABLES `dashboard_components` WRITE;
/*!40000 ALTER TABLE `dashboard_components` DISABLE KEYS */;
INSERT INTO `dashboard_components` VALUES (1,'metrics','Key Performance Indicators','card','components/MetricCard','Display key performance metrics and statistics',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(2,'quickStats','Quick Stats','card','components/QuickStatsCard','Show quick statistics with progress bars',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(3,'recentActivity','Recent Activity','list','components/RecentActivityCard','Display recent system activities',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(4,'contractorMetrics','Contractor Metrics','card','components/contractor/ContractorMetricsCard','Contractor-specific performance metrics',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(5,'tasks','Project Tasks','list','components/ProjectTasksCard','List of project tasks and assignments',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(6,'activity','Project Activity','list','components/ProjectActivityFeed','Project activity feed and updates',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(7,'alerts','Project Alerts','list','components/ProjectAlertsCard','Critical project alerts and notifications',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(8,'assignedTasks','My Assigned Tasks','list','components/contractor/AssignedTasksCard','Tasks specifically assigned to the user',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(9,'projectComments','Project Comments','list','components/contractor/ProjectCommentsCard','Comments and feedback on projects',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(10,'projectActivity','Project Activity','list','components/ProjectActivityFeed','Activity feed for assigned projects',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(11,'teamDirectory','Team Directory','list','components/TeamDirectoryCard','Searchable team member directory',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(12,'announcements','Team Announcements','list','components/TeamAnnouncementsCard','Team-wide announcements and updates',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(13,'conversations','Recent Conversations','list','components/RecentConversationsCard','Recent chat conversations',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(14,'charts','Analytics Charts','chart','components/charts/ChartsDashboard','Interactive analytics charts and graphs',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(15,'reports','Reports','list','components/ReportsCard','Generated reports and documents',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(16,'paymentRequests','Payment Requests','list','components/contractor/PaymentRequestsCard','Submit and track payment requests',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(17,'paymentHistory','Payment History','list','components/contractor/PaymentHistoryCard','View payment history and receipts',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(18,'financialSummary','Financial Summary','card','components/contractor/FinancialSummaryCard','Financial overview and earnings analytics',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(19,'project_summary','Project Summary','card','ProjectSummaryCard','Overview of all projects',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(20,'recent_activities','Recent Activities','list','RecentActivitiesList','List of recent system activities',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(21,'project_stats','Project Statistics','chart','ProjectStatsChart','Statistical charts for projects',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(22,'user_management','User Management','table','UserManagementTable','Manage system users',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(23,'project_list','Project List','table','ProjectListTable','List of all projects',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(24,'reports_overview','Reports Overview','card','ReportsOverviewCard','Overview of available reports',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(25,'budget_overview_card','Budget Overview Card','card','components/dashboard/cards/BudgetOverviewCard.jsx','Financial overview showing budget allocation, spent amounts, and remaining funds',1,'2025-10-02 08:18:08','2025-10-02 08:18:08'),(26,'user_stats_card','User Statistics Card','card','components/dashboard/cards/UserStatsCard.jsx','Displays user registration statistics including total users, active users, and growth metrics',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(27,'project_metrics_card','Project Metrics Card','card','components/dashboard/cards/ProjectMetricsCard.jsx','Overview of project statistics including total, active, and completed projects',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(28,'budget_overview_card_new','Budget Overview Card','card','components/dashboard/cards/BudgetOverviewCard.jsx','Financial overview showing budget allocation, spent amounts, and remaining funds',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(29,'project_progress_chart','Project Progress Chart','chart','components/dashboard/charts/ProjectProgressChart.jsx','Visual chart showing project completion progress over time',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(30,'budget_analytics_chart','Budget Analytics Chart','chart','components/dashboard/charts/BudgetAnalyticsChart.jsx','Financial analytics chart showing spending patterns and budget utilization',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(31,'recent_activity_list','Recent Activity List','list','components/dashboard/lists/RecentActivityList.jsx','List of recent user activities, project updates, and system events',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(32,'notifications_list','Notifications List','list','components/dashboard/lists/NotificationsList.jsx','User notifications, alerts, and important system messages',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(33,'users_table','Users Table','table','components/dashboard/tables/UsersTable.jsx','Tabular view of system users with filtering and sorting capabilities',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(34,'projects_table','Projects Table','table','components/dashboard/tables/ProjectsTable.jsx','Comprehensive table of projects with status, progress, and management options',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(35,'quick_actions_widget','Quick Actions Widget','widget','components/dashboard/widgets/QuickActionsWidget.jsx','Interactive widget with frequently used actions and shortcuts',1,'2025-10-02 08:31:14','2025-10-02 08:31:14'),(42,'active_users_card','Active Users','card','ActiveUsersCard','Display currently active users',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(43,'kpi_card','KPI Metrics','card','KpiCard','Key performance indicators',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(44,'contractor_metrics_card','Contractor Metrics','card','ContractorMetricsCard','Contractor performance metrics',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(45,'financial_summary_card','Financial Summary','card','FinancialSummaryCard','Financial overview and summaries',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(46,'charts_dashboard','Analytics Dashboard','chart','ChartsDashboard','Comprehensive analytics and charts',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(47,'project_tasks_card','Project Tasks','list','ProjectTasksCard','Current project tasks and assignments',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(48,'project_activity_feed','Project Activity Feed','list','ProjectActivityFeed','Real-time project activities',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(49,'project_alerts_card','Project Alerts','list','ProjectAlertsCard','Important project alerts and notifications',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(50,'team_directory_card','Team Directory','list','TeamDirectoryCard','Team member directory and contacts',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(51,'team_announcements_card','Team Announcements','list','TeamAnnouncementsCard','Team announcements and updates',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(52,'recent_conversations_card','Recent Conversations','list','RecentConversationsCard','Recent team conversations',1,'2025-10-02 11:13:52','2025-10-02 11:13:52');
/*!40000 ALTER TABLE `dashboard_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_permissions`
--

DROP TABLE IF EXISTS `dashboard_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission_key` varchar(100) NOT NULL,
  `permission_name` varchar(200) NOT NULL,
  `description` text,
  `component_key` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_key` (`permission_key`),
  KEY `component_key` (`component_key`),
  CONSTRAINT `dashboard_permissions_ibfk_1` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_permissions`
--

LOCK TABLES `dashboard_permissions` WRITE;
/*!40000 ALTER TABLE `dashboard_permissions` DISABLE KEYS */;
INSERT INTO `dashboard_permissions` VALUES (1,'view_metrics','View Metrics','Can view key performance metrics',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(2,'view_quick_stats','View Quick Stats','Can view quick statistics',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(3,'view_activity','View Activity','Can view recent activity feeds',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(4,'view_tasks','View Tasks','Can view project tasks',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(5,'manage_tasks','Manage Tasks','Can create, edit, and assign tasks',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(6,'view_alerts','View Alerts','Can view project alerts',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(7,'manage_alerts','Manage Alerts','Can create and manage alerts',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(8,'view_team_directory','View Team Directory','Can view team member directory',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(9,'view_announcements','View Announcements','Can view team announcements',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(10,'view_conversations','View Conversations','Can view chat conversations',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(11,'view_analytics','View Analytics','Can view analytics and charts',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(12,'view_reports','View Reports','Can view generated reports',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(13,'generate_reports','Generate Reports','Can generate new reports',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(14,'view_payment_requests','View Payment Requests','Can view payment requests',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(15,'submit_payment_requests','Submit Payment Requests','Can submit new payment requests',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(16,'view_payment_history','View Payment History','Can view payment history',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(17,'view_financial_summary','View Financial Summary','Can view financial analytics',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(18,'manage_users','Manage Users','Can manage user accounts',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(19,'manage_roles','Manage Roles','Can manage user roles',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(20,'system_admin','System Administration','Full system administration access',NULL,1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(21,'view_project_summary','View Project Summary','Permission to view project summary component','project_summary',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(22,'view_recent_activities','View Recent Activities','Permission to view recent activities component','recent_activities',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(23,'view_project_stats','View Project Statistics','Permission to view project statistics','project_stats',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(24,'view_projects','View Projects','Permission to view project list','project_list',1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(32,'view_active_users','View Active Users','Permission to view active users component','active_users_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(33,'view_kpi_metrics','View KPI Metrics','Permission to view KPI metrics','kpi_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(34,'view_contractor_metrics','View Contractor Metrics','Permission to view contractor metrics','contractor_metrics_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(35,'view_user_stats','View User Statistics','Permission to view user statistics','user_stats_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(36,'view_project_metrics','View Project Metrics','Permission to view project metrics','project_metrics_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(37,'view_budget_overview','View Budget Overview','Permission to view budget overview','budget_overview_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(38,'view_charts_dashboard','View Analytics Dashboard','Permission to view analytics dashboard','charts_dashboard',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(39,'view_project_tasks','View Project Tasks','Permission to view project tasks','project_tasks_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(40,'view_project_activities','View Project Activities','Permission to view project activities','project_activity_feed',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(41,'view_project_alerts','View Project Alerts','Permission to view project alerts','project_alerts_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(42,'view_team_announcements','View Team Announcements','Permission to view team announcements','team_announcements_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(43,'view_recent_conversations','View Recent Conversations','Permission to view recent conversations','recent_conversations_card',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(44,'manage_users_table','Manage Users Table','Permission to manage users table','users_table',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(45,'manage_projects_table','Manage Projects Table','Permission to manage projects table','projects_table',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(46,'use_quick_actions','Use Quick Actions','Permission to use quick actions widget','quick_actions_widget',1,'2025-10-02 11:13:52','2025-10-02 11:13:52');
/*!40000 ALTER TABLE `dashboard_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_tabs`
--

DROP TABLE IF EXISTS `dashboard_tabs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_tabs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tab_key` varchar(50) NOT NULL,
  `tab_name` varchar(100) NOT NULL,
  `tab_icon` varchar(100) DEFAULT NULL,
  `tab_order` int DEFAULT '0',
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tab_key` (`tab_key`),
  KEY `idx_dashboard_tabs_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_tabs`
--

LOCK TABLES `dashboard_tabs` WRITE;
/*!40000 ALTER TABLE `dashboard_tabs` DISABLE KEYS */;
INSERT INTO `dashboard_tabs` VALUES (1,'overview','Overview','Dashboard',1,'Main dashboard overview with key metrics',1,'2025-09-30 11:08:28','2025-10-02 08:31:14'),(2,'projects','Projects','Assignment',2,'Project management and task tracking',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(3,'collaboration','Collaboration','People',3,'Team collaboration and communication',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(4,'analytics','Analytics','Analytics',4,'Data analytics and reporting',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(5,'payments','Payments','AttachMoney',5,'Payment management and financial tracking',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(6,'reports','Reports','Analytics',3,NULL,1,'2025-10-01 17:59:43','2025-10-01 17:59:43'),(7,'settings','Settings','Settings',4,NULL,1,'2025-10-01 17:59:43','2025-10-01 17:59:43');
/*!40000 ALTER TABLE `dashboard_tabs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_activities`
--

DROP TABLE IF EXISTS `kemri_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_activities` (
  `activityId` int NOT NULL AUTO_INCREMENT,
  `workplanId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `activityName` text,
  `activityDescription` text,
  `responsibleOfficer` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `budgetAllocated` decimal(15,2) DEFAULT NULL,
  `actualCost` decimal(15,2) DEFAULT NULL,
  `percentageComplete` decimal(5,2) DEFAULT '0.00',
  `activityStatus` enum('not_started','in_progress','completed','delayed','cancelled') DEFAULT 'not_started',
  `voided` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remarks` text,
  PRIMARY KEY (`activityId`),
  KEY `idx_workplan` (`workplanId`),
  KEY `idx_project` (`projectId`),
  CONSTRAINT `fk_activities_projects` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_activities_ibfk_1` FOREIGN KEY (`workplanId`) REFERENCES `kemri_annual_workplans` (`workplanId`),
  CONSTRAINT `kemri_activities_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_activities`
--

LOCK TABLES `kemri_activities` WRITE;
/*!40000 ALTER TABLE `kemri_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_annual_workplans`
--

DROP TABLE IF EXISTS `kemri_annual_workplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_annual_workplans` (
  `workplanId` int NOT NULL AUTO_INCREMENT,
  `subProgramId` int DEFAULT NULL,
  `financialYear` varchar(9) DEFAULT NULL,
  `workplanName` varchar(255) DEFAULT NULL,
  `workplanDescription` text,
  `approvalStatus` enum('draft','submitted','approved','rejected') DEFAULT 'draft',
  `totalBudget` decimal(15,2) DEFAULT NULL,
  `actualExpenditure` decimal(15,2) DEFAULT '0.00',
  `performanceScore` decimal(5,2) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `challenges` text,
  `lessons` text,
  `recommendations` text,
  PRIMARY KEY (`workplanId`),
  KEY `idx_subprogram` (`subProgramId`),
  KEY `idx_financial_year` (`financialYear`),
  CONSTRAINT `kemri_annual_workplans_ibfk_1` FOREIGN KEY (`subProgramId`) REFERENCES `kemri_subprograms` (`subProgramId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_annual_workplans`
--

LOCK TABLES `kemri_annual_workplans` WRITE;
/*!40000 ALTER TABLE `kemri_annual_workplans` DISABLE KEYS */;
INSERT INTO `kemri_annual_workplans` VALUES (1,701,'899','eredd','tesr','draft',8998.00,8000.00,1.00,0,NULL,'2025-08-12 07:42:44','2025-08-12 07:42:44','hhhhh\njjjj\njjj\n','iiooo','uyuyu'),(2,709,'3232','wqwqew stawer',NULL,'submitted',3434343.00,500000.00,1.00,0,NULL,'2025-08-12 07:58:29','2025-08-12 08:01:25','3455','33',NULL),(3,703,'21/2022','NCD  Tetsting ','ererer','approved',500000.00,0.00,NULL,0,NULL,'2025-08-12 19:02:56','2025-08-12 19:02:56',NULL,NULL,NULL),(4,746,'2024/2025','FY 2024/2025 Kibera Health Workplan',NULL,'draft',5000000.00,0.00,NULL,0,NULL,'2025-08-13 20:47:52','2025-08-13 20:47:52',NULL,NULL,NULL),(5,747,'2024/2025','FY 2024/2025 Maternal Health Workplan',NULL,'draft',3000000.00,0.00,NULL,0,NULL,'2025-08-13 20:47:52','2025-08-13 20:47:52',NULL,NULL,NULL),(6,748,'2024/2025','FY 2024/2025 Waste Management Workplan',NULL,'draft',2500000.00,0.00,NULL,0,NULL,'2025-08-13 20:47:52','2025-08-13 20:47:52',NULL,NULL,NULL),(7,749,'2024/2025','FY 2024/2025 Medical Services, Public Health and Sanitation Workplan',NULL,'draft',7583423.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(8,750,'2024/2025','FY 2024/2025 Sports, Culture, Gender and Youth Affairs Workplan',NULL,'draft',13473613.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(9,751,'2024/2025','FY 2024/2025 City of Kisumu Management Workplan',NULL,'draft',7570591.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(10,752,'2024/2025','FY 2024/2025 Trade, Tourism, Industry and Marketing Workplan',NULL,'draft',7162379.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(11,753,'2024/2025','FY 2024/2025 Finance, Economic Planning and ICT(E-Government) Services Workplan',NULL,'draft',11697619.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(12,754,'2024/2025','FY 2024/2025 Finance, Economic Planning and ICT(E-Government) Services Workplan',NULL,'draft',11952073.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(13,755,'2024/2025','FY 2024/2025 City of Kisumu Management Workplan',NULL,'draft',13201742.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(14,756,'2024/2025','FY 2024/2025 Infrastructure, Energy and Public Works Workplan',NULL,'draft',11092038.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(15,757,'2024/2025','FY 2024/2025 Finance, Economic Planning and ICT(E-Government) Services Workplan',NULL,'draft',10625946.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(16,758,'2024/2025','FY 2024/2025 Education, Technical Training, Innovation and Social Services Workplan',NULL,'draft',8649513.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(17,759,'2024/2025','FY 2024/2025 Water, Environment, Natural Resources and Climate Change Workplan',NULL,'draft',14688536.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(18,760,'2024/2025','FY 2024/2025 Education, Technical Training, Innovation and Social Services Workplan',NULL,'draft',8102898.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(19,761,'2024/2025','FY 2024/2025 Sports, Culture, Gender and Youth Affairs Workplan',NULL,'draft',6439351.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(20,762,'2024/2025','FY 2024/2025 Water, Environment, Natural Resources and Climate Change Workplan',NULL,'draft',5662013.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(21,763,'2024/2025','FY 2024/2025 Medical Services, Public Health and Sanitation Workplan',NULL,'draft',12636337.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(22,764,'2024/2025','FY 2024/2025 Medical Services, Public Health and Sanitation Workplan',NULL,'draft',13156563.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(23,765,'2024/2025','FY 2024/2025 Public Service, County Administration Workplan',NULL,'draft',10233568.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(24,766,'2024/2025','FY 2024/2025 Public Service, County Administration Workplan',NULL,'draft',5595890.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(25,767,'2024/2025','FY 2024/2025 Water, Environment, Natural Resources and Climate Change Workplan',NULL,'draft',13718043.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(26,768,'2024/2025','FY 2024/2025 Agriculture, Fisheries, Livestock Development and Irrigation Workplan',NULL,'draft',10109169.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(27,769,'2024/2025','FY 2024/2025 Infrastructure, Energy and Public Works Workplan',NULL,'draft',11326770.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(28,770,'2024/2025','FY 2024/2025 Medical Services, Public Health and Sanitation Workplan',NULL,'draft',11885668.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(29,771,'2024/2025','FY 2024/2025 Sports, Culture, Gender and Youth Affairs Workplan',NULL,'draft',13434866.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(30,772,'2024/2025','FY 2024/2025 Agriculture, Fisheries, Livestock Development and Irrigation Workplan',NULL,'draft',8784037.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL),(31,773,'2024/2025','FY 2024/2025 Public Service, County Administration Workplan',NULL,'draft',14727130.00,0.00,NULL,0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL,NULL,NULL);
/*!40000 ALTER TABLE `kemri_annual_workplans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_assigned_assets`
--

DROP TABLE IF EXISTS `kemri_assigned_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_assigned_assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `assetName` varchar(255) NOT NULL,
  `serialNumber` varchar(255) DEFAULT NULL,
  `assignmentDate` date NOT NULL,
  `returnDate` date DEFAULT NULL,
  `condition` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_assigned_assets_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_assigned_assets`
--

LOCK TABLES `kemri_assigned_assets` WRITE;
/*!40000 ALTER TABLE `kemri_assigned_assets` DISABLE KEYS */;
INSERT INTO `kemri_assigned_assets` VALUES (1,1,'Computer Asus','SN100390394','2025-08-04','2025-09-04','Good',1,'2025-08-21 12:28:29','2025-08-23 12:09:24',0),(2,1,'Projector','PSN 0091029','2025-08-21','2025-08-29','Working but with no HDMI Cable',1,'2025-08-21 12:31:45','2025-08-21 12:31:45',0);
/*!40000 ALTER TABLE `kemri_assigned_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_attachments`
--

DROP TABLE IF EXISTS `kemri_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_attachments` (
  `attachmentId` int NOT NULL AUTO_INCREMENT,
  `assetId` int DEFAULT NULL,
  `typeId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `path` text,
  `size` int DEFAULT NULL,
  `contentBlob` varchar(255) DEFAULT NULL,
  `description` text,
  `documentNo` varchar(255) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attachmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_attachments`
--

LOCK TABLES `kemri_attachments` WRITE;
/*!40000 ALTER TABLE `kemri_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_attachmenttypes`
--

DROP TABLE IF EXISTS `kemri_attachmenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_attachmenttypes` (
  `typeId` int NOT NULL AUTO_INCREMENT,
  `attachmentName` varchar(255) DEFAULT NULL,
  `description` text,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_attachmenttypes`
--

LOCK TABLES `kemri_attachmenttypes` WRITE;
/*!40000 ALTER TABLE `kemri_attachmenttypes` DISABLE KEYS */;
INSERT INTO `kemri_attachmenttypes` VALUES (1,'Project Proposal','Formal document outlining a project idea, objectives, methodology, and budget.',0,NULL),(2,'Research Protocol','Detailed plan for a research study, including design, procedures, and data analysis.',0,NULL),(3,'Ethical Approval Certificate','Document from an ethics committee approving a research study involving human or animal subjects.',0,NULL),(4,'Data Collection Form','Templates or examples of forms used to collect data during a study.',0,NULL),(5,'Interim Report','Mid-term progress report for a project or study.',0,NULL),(6,'Final Report','Comprehensive concluding report for a completed project or study.',0,NULL),(7,'Financial Statement','Document detailing project expenses, budget, and funding utilization.',0,NULL),(8,'Publication Manuscript','Draft or final version of a scientific paper intended for publication.',0,NULL),(9,'Presentation Slides','Materials used for project presentations (e.g., PowerPoint, Google Slides).',0,NULL),(10,'Consent Form','Document used to obtain informed consent from study participants.',0,NULL),(11,'Memorandum of Understanding (MOU)','Agreement outlining collaboration between KEMRI and other organizations.',0,NULL),(12,'Contract Agreement','Legal document outlining terms and conditions with contractors or partners.',0,NULL),(13,'Site Visit Report','Report from an inspection or monitoring visit to a project site.',0,NULL),(14,'Survey Questionnaire','Instrument used for surveys, containing a set of questions.',0,NULL),(15,'Budget Requisition','Formal request for project funds or budget reallocation.',0,NULL);
/*!40000 ALTER TABLE `kemri_attachmenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_attendance`
--

DROP TABLE IF EXISTS `kemri_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `date` date NOT NULL,
  `checkInTime` datetime NOT NULL,
  `checkOutTime` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_attendance_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_attendance`
--

LOCK TABLES `kemri_attendance` WRITE;
/*!40000 ALTER TABLE `kemri_attendance` DISABLE KEYS */;
INSERT INTO `kemri_attendance` VALUES (1,3,'2025-08-14','2025-08-14 20:13:50',NULL,1,'2025-08-14 20:13:50','2025-08-14 20:30:22',0),(2,10,'2025-08-14','2025-08-14 20:13:57',NULL,1,'2025-08-14 20:13:57','2025-08-14 20:30:22',0),(3,10,'2025-08-14','2025-08-14 20:15:31',NULL,1,'2025-08-14 20:15:31','2025-08-14 20:30:22',0),(4,10,'2025-08-14','2025-08-14 20:20:48',NULL,1,'2025-08-14 20:20:48','2025-08-14 20:30:22',0),(5,2,'2025-08-15','2025-08-15 12:27:06',NULL,1,'2025-08-15 12:27:06','2025-08-15 12:27:06',0),(6,13,'2025-08-15','2025-08-15 12:27:15',NULL,1,'2025-08-15 12:27:15','2025-08-15 12:27:15',0),(7,8,'2025-08-15','2025-08-15 15:46:41',NULL,1,'2025-08-15 15:46:41','2025-08-15 15:46:41',0);
/*!40000 ALTER TABLE `kemri_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_categories`
--

DROP TABLE IF EXISTS `kemri_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_categories` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) DEFAULT NULL,
  `description` text,
  `picture` varchar(255) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_categories`
--

LOCK TABLES `kemri_categories` WRITE;
/*!40000 ALTER TABLE `kemri_categories` DISABLE KEYS */;
INSERT INTO `kemri_categories` VALUES (1,'Infectious Diseases','Research and projects focused on communicable diseases such as Malaria, HIV, Tuberculosis, and neglected tropical diseases.','infectious_diseases.png',0,NULL),(2,'Non-Communicable Diseases','Studies addressing chronic diseases like diabetes, cardiovascular diseases, cancers, and mental health conditions.','ncd_diseases.png',0,NULL),(3,'Maternal and Child Health','Projects dedicated to improving health outcomes for mothers, newborns, children, and adolescents.','mch_health.png',0,NULL),(4,'Environmental Health','Research investigating the impact of environmental factors on human health, including pollution and climate change.','environmental_health.png',0,NULL),(5,'Health Systems Research','Studies aimed at understanding and improving the efficiency, equity, and quality of health service delivery.','health_systems.png',0,NULL),(6,'Vaccine Development','Research and trials related to the discovery, development, and evaluation of new vaccines.','vaccine_development.png',0,NULL),(7,'Genomics and Bioinformatics','Projects utilizing genomic data and computational tools for disease understanding and prevention.','genomics_bioinfo.png',0,NULL),(8,'Public Health Policy','Research informing the development and evaluation of public health policies and interventions.','public_health_policy.png',0,NULL),(9,'Health Survey','Projects focused on conducting health surveys and data collection.',NULL,0,NULL);
/*!40000 ALTER TABLE `kemri_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_contractor_users`
--

DROP TABLE IF EXISTS `kemri_contractor_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_contractor_users` (
  `contractorUserId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `contractorId` int NOT NULL,
  PRIMARY KEY (`contractorUserId`),
  KEY `userId` (`userId`),
  KEY `contractorId` (`contractorId`),
  CONSTRAINT `kemri_contractor_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_contractor_users_ibfk_2` FOREIGN KEY (`contractorId`) REFERENCES `kemri_contractors` (`contractorId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_contractor_users`
--

LOCK TABLES `kemri_contractor_users` WRITE;
/*!40000 ALTER TABLE `kemri_contractor_users` DISABLE KEYS */;
INSERT INTO `kemri_contractor_users` VALUES (1,9,1),(2,30,3),(3,25,4),(4,25,5),(5,17,6),(6,25,7),(7,23,8),(8,17,9),(9,19,10),(10,21,11),(11,12,12),(12,10,29);
/*!40000 ALTER TABLE `kemri_contractor_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_contractors`
--

DROP TABLE IF EXISTS `kemri_contractors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_contractors` (
  `contractorId` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) NOT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`contractorId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_contractors`
--

LOCK TABLES `kemri_contractors` WRITE;
/*!40000 ALTER TABLE `kemri_contractors` DISABLE KEYS */;
INSERT INTO `kemri_contractors` VALUES (1,'Intellibiz Africa Limited','Alfayo Kwatuha','kwatuha@gmail.com','0718109196','2025-08-10 05:19:15',0,NULL),(2,'Soya Building Contractors','Peter Mutevu','pmutevu@gmail.com','0718109198','2025-08-14 10:27:19',0,NULL),(3,'Coastal Builders','Mary Williams','coastalbuilders3@example.com','254767647071','2025-08-29 03:21:13',0,NULL),(4,'Coastal Enterprises','John Doe','coastalenterprises4@example.com','254756282968','2025-08-29 03:21:13',0,NULL),(5,'Prime Solutions','John Doe','primesolutions5@example.com','254757161917','2025-08-29 03:21:13',0,NULL),(6,'Nexus Holdings','Mary Williams','nexusholdings6@example.com','254720467654','2025-08-29 03:21:13',0,NULL),(7,'Prime Holdings','Mary Williams','primeholdings7@example.com','254714494174','2025-08-29 03:21:13',0,NULL),(8,'Tech Innovations Builders','Peter Jones','techinnovationsbuilders8@example.com','254729232798','2025-08-29 03:21:13',0,NULL),(9,'Green Earth Solutions','Mary Williams','greenearthsolutions9@example.com','254728409556','2025-08-29 03:21:13',0,NULL),(10,'Prime Pty Ltd','Jane Smith','primeptyltd10@example.com','254789805734','2025-08-29 03:21:13',0,NULL),(11,'Prime Holdings','Mary Williams','primeholdings11@example.com','254720771477','2025-08-29 03:21:13',0,NULL),(12,'Urban Enterprises','John Doe','urbanenterprises12@example.com','254751844833','2025-08-29 03:21:13',0,NULL),(13,'zxz','zx','zxz@ga.com','xz','2025-08-29 03:48:21',0,NULL),(14,'sas','as','asas@ga.com','asa','2025-08-29 03:58:23',0,NULL),(17,'sdsd','sd','dasd@asdsa.coc','SD','2025-08-29 04:06:59',0,NULL),(23,'sdsdsd','dsdsds','dasssd@asdsa.coc','sd','2025-08-29 04:24:01',0,NULL),(24,'sdsdsd','dsdsds','dasalphassd@asdsa.coc','sd','2025-08-29 04:24:19',0,NULL),(25,'zXzxzX','xzzxzX','makwat@gmail.com','0718291929182','2025-08-29 04:25:20',0,NULL),(26,'AlphaMart ','alpha','alphamark@gmail.com','0718109196','2025-08-29 04:27:43',0,NULL),(28,'ASUS iNTERNATIONAL','ASAasaS','dasskwad@asdsa.cockwa','SSA','2025-08-29 04:34:15',0,2),(29,'wawewqew','sdsd','sdadsa@yag.com','dssd','2025-08-29 04:42:43',0,10);
/*!40000 ALTER TABLE `kemri_contractors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_counties`
--

DROP TABLE IF EXISTS `kemri_counties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_counties` (
  `countyId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `geoSpatial` varchar(255) DEFAULT NULL,
  `geoCode` varchar(255) DEFAULT NULL,
  `geoLat` decimal(10,7) DEFAULT NULL,
  `geoLon` decimal(10,7) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`countyId`),
  UNIQUE KEY `uq_county_name` (`name`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_counties_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_counties_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_counties`
--

LOCK TABLES `kemri_counties` WRITE;
/*!40000 ALTER TABLE `kemri_counties` DISABLE KEYS */;
INSERT INTO `kemri_counties` VALUES (1,'Kisumu','POINT(34.7617 -0.1022)','KSM',-0.1022000,34.7617000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(2,'Nairobi','POINT(36.8219 -1.2921)','NBO',-1.2921000,36.8219000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(3,'Mombasa','POINT(39.6682 -4.0437)','MSA',-4.0437000,39.6682000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(4,'Turkana','POINT(35.5975 3.1118)','TRK',3.1118000,35.5975000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(5,'Marsabit','POINT(37.9868 2.3482)','MRS',2.3482000,37.9868000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(6,'Garissa','POINT(39.6450 -0.4560)','GRS',-0.4560000,39.6450000,0,NULL,'2025-08-08 07:27:18','2025-08-08 07:27:18',NULL),(15,'Kitui',NULL,NULL,-1.3670000,38.0106000,0,1,'2025-09-28 13:06:19','2025-09-28 13:06:19',NULL);
/*!40000 ALTER TABLE `kemri_counties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_departments`
--

DROP TABLE IF EXISTS `kemri_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_departments` (
  `departmentId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `alias` text,
  `location` text,
  `address` text,
  `contactPerson` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` text,
  `remarks` text,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`departmentId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_departments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_departments_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_departments`
--

LOCK TABLES `kemri_departments` WRITE;
/*!40000 ALTER TABLE `kemri_departments` DISABLE KEYS */;
INSERT INTO `kemri_departments` VALUES (1,'Energy, Transport, Roads & Public Works','','','','Erick Ngage','0727749632','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(2,'Education, Technical Training, Innovation and Social Services','Education, TTI and social services','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(3,'Water,Environment,Climate Change and Natural Resources','','HEADQUARTERS','2738-40100','Sospeter Onunga','0715581380','sospeterke@yahoo.com','digitization of services',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(4,'Department-Wide','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(5,'Trade, Tourism,Industry and Marketing','','HQ','','Bovince Ochieng','0723106411','bovinceo@gmail.com','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(6,'Sports,Culture,Gender and Youth Affairs','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(7,'Lands, Physical Planning, Housing and Urban Development','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(8,'Medical Services, Public Health and Sanitation','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(9,'Governors Servce  Delivery Unit','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(10,'Finance, Economic Planning and ICT (E-Government) Services','F, EP & ICT','County Hqs','P.O. Box 2378 - 40100, Kisumu','CECM ','0712347810','','CECM, F, EP & ICT',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(11,'County Public Service Board',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(12,'Agriculture, Fisheries, Livestock Development and Irrigation','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(13,'Public Service, County Administration And Participatory Development, Office Of The Governor','','','','','','','',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL),(14,'City of Kisumu','CITY','NEW FIRESTATION','105','CATHERINE OBOR','0724599722','candjaber@gmail.com','CITY',0,1,'2025-10-15 04:52:34','2025-10-15 04:52:34',NULL);
/*!40000 ALTER TABLE `kemri_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_bank_details`
--

DROP TABLE IF EXISTS `kemri_employee_bank_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_bank_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `branchName` varchar(255) DEFAULT NULL,
  `isPrimary` tinyint DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_bank_details_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_bank_details`
--

LOCK TABLES `kemri_employee_bank_details` WRITE;
/*!40000 ALTER TABLE `kemri_employee_bank_details` DISABLE KEYS */;
INSERT INTO `kemri_employee_bank_details` VALUES (1,1,'KCB','001993039','Eldoret',1,1,'2025-08-22 09:07:04','2025-08-29 06:10:54',1),(2,1,'Equity Bank','1234567890','Nairobi Branch',1,1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(3,2,'Cooperative Bank','0987654321','Kisumu Branch',1,2,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(4,3,'KCB Bank','1122334455','Nakuru Branch',1,3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(5,4,'Standard Chartered','2233445566','Nyeri Branch',1,4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(6,5,'Absa Bank','3344556677','Eldoret Branch',1,5,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_bank_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_benefits`
--

DROP TABLE IF EXISTS `kemri_employee_benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `benefitName` varchar(255) NOT NULL,
  `enrollmentDate` date DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_benefits_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_benefits`
--

LOCK TABLES `kemri_employee_benefits` WRITE;
/*!40000 ALTER TABLE `kemri_employee_benefits` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_employee_benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_compensation`
--

DROP TABLE IF EXISTS `kemri_employee_compensation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_compensation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `baseSalary` decimal(10,2) NOT NULL,
  `allowances` decimal(10,2) DEFAULT NULL,
  `bonuses` decimal(10,2) DEFAULT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `accountNumber` varchar(255) DEFAULT NULL,
  `payFrequency` varchar(50) NOT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_compensation_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_compensation`
--

LOCK TABLES `kemri_employee_compensation` WRITE;
/*!40000 ALTER TABLE `kemri_employee_compensation` DISABLE KEYS */;
INSERT INTO `kemri_employee_compensation` VALUES (1,1,2122.00,1223.00,1221.00,'ww','www','Bi-Weekly',1,'2025-08-15 20:55:54','2025-08-29 06:10:22',1),(2,1,675.00,56.00,6546.00,NULL,NULL,'Monthly',1,'2025-08-17 09:29:14','2025-08-29 06:10:25',1),(3,1,322.00,222.00,22.00,NULL,NULL,'Bi-Weekly',1,'2025-08-22 08:59:25','2025-08-29 06:10:29',1),(4,1,23232.00,23.00,232.00,NULL,NULL,'Monthly',1,'2025-08-22 09:05:11','2025-08-29 06:10:37',1),(5,1,85000.00,5000.00,10000.00,'Equity Bank','1234567890','Monthly',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(6,2,45000.00,3000.00,2000.00,'Cooperative Bank','0987654321','Monthly',2,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(7,3,60000.00,4000.00,5000.00,'KCB Bank','1122334455','Monthly',3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(8,4,85000.00,6000.00,12000.00,'Standard Chartered','2233445566','Monthly',4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(9,5,45000.00,3500.00,2500.00,'Absa Bank','3344556677','Monthly',5,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_compensation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_contracts`
--

DROP TABLE IF EXISTS `kemri_employee_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `contractType` varchar(50) NOT NULL,
  `contractStartDate` date NOT NULL,
  `contractEndDate` date DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_contracts_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_contracts`
--

LOCK TABLES `kemri_employee_contracts` WRITE;
/*!40000 ALTER TABLE `kemri_employee_contracts` DISABLE KEYS */;
INSERT INTO `kemri_employee_contracts` VALUES (1,1,'6456546','2025-08-17','2025-08-29','Active',1,'2025-08-17 09:30:35','2025-08-17 09:30:35',0),(2,1,'Full-Time','2025-08-22',NULL,'Active',1,'2025-08-22 09:11:14','2025-08-22 09:11:14',0),(3,1,'Permanent','2023-01-10',NULL,'Active',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(4,2,'Permanent','2022-03-20',NULL,'Active',2,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(5,3,'Permanent','2021-06-15',NULL,'Active',3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(6,4,'Permanent','2023-09-01',NULL,'Active',4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(7,5,'Permanent','2022-11-01',NULL,'Active',5,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(8,6,'Contract','2024-01-20','2025-01-20','Active',6,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(9,7,'Permanent','2020-05-18',NULL,'Active',7,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(10,8,'Permanent','2023-05-25',NULL,'Active',8,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(11,9,'Permanent','2022-08-11',NULL,'Active',9,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(12,10,'Contract','2024-02-14','2025-02-14','Active',10,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(13,11,'Permanent','2021-09-01',NULL,'Active',11,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(14,12,'Permanent','2023-03-10',NULL,'Active',12,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_dependants`
--

DROP TABLE IF EXISTS `kemri_employee_dependants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_dependants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `dependantName` varchar(255) NOT NULL,
  `relationship` varchar(50) NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_dependants_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_dependants`
--

LOCK TABLES `kemri_employee_dependants` WRITE;
/*!40000 ALTER TABLE `kemri_employee_dependants` DISABLE KEYS */;
INSERT INTO `kemri_employee_dependants` VALUES (1,5,'sas','asas','2025-08-05',1,'2025-08-15 20:14:48','2025-08-15 20:14:48',0),(2,7,'asas','sasa','2025-08-21',1,'2025-08-15 20:15:10','2025-08-15 20:15:10',0),(3,6,'sd','sdsd','2025-08-15',1,'2025-08-15 20:25:25','2025-08-15 20:25:25',0),(4,1,'ssd','sdsd','2025-08-01',1,'2025-08-15 20:26:15','2025-08-15 20:26:15',0),(5,1,'sdsd','sdsdsdsdd','2025-08-14',1,'2025-08-15 20:27:10','2025-08-15 20:27:10',0),(6,1,'sdsdsdsd','sdsdsd','2025-08-05',1,'2025-08-15 20:28:01','2025-08-15 20:28:01',0),(7,4,'xzx','zzxzxzx','2025-08-18',1,'2025-08-17 07:42:40','2025-08-17 07:42:40',0),(8,1,'trtrt','trt','2025-08-20',1,'2025-08-17 09:30:51','2025-08-17 09:30:51',0),(9,1,'Catherine Mumo','Spouse','1988-02-25',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(10,1,'Lisa Mumo','Child','2018-05-01',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(11,3,'Faith Odhiambo','Spouse','1990-11-15',3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(12,3,'Michael Odhiambo','Child','2019-03-20',3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(13,4,'James Kariuki','Father','1965-01-10',4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_dependants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_disciplinary`
--

DROP TABLE IF EXISTS `kemri_employee_disciplinary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_disciplinary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `actionType` varchar(255) NOT NULL,
  `actionDate` date NOT NULL,
  `reason` text NOT NULL,
  `comments` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_disciplinary_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_disciplinary`
--

LOCK TABLES `kemri_employee_disciplinary` WRITE;
/*!40000 ALTER TABLE `kemri_employee_disciplinary` DISABLE KEYS */;
INSERT INTO `kemri_employee_disciplinary` VALUES (1,1,'Warning','2025-08-12','asas','asas',1,'2025-08-17 09:28:35','2025-08-29 06:13:16',1),(2,1,'Warning','2025-08-21','sdfdsfsdf','dfdfdsf',1,'2025-08-17 10:06:26','2025-08-29 06:13:12',1),(3,1,'Verbal Warning','2025-08-21','Drunk and disorderly','The employee came to the office while drunk',1,'2025-08-22 09:43:20','2025-08-29 06:13:04',0);
/*!40000 ALTER TABLE `kemri_employee_disciplinary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_leave_entitlements`
--

DROP TABLE IF EXISTS `kemri_employee_leave_entitlements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_leave_entitlements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `leaveTypeId` int NOT NULL,
  `year` int NOT NULL,
  `allocatedDays` decimal(5,2) NOT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `entitlement_unique` (`staffId`,`leaveTypeId`,`year`),
  KEY `leaveTypeId` (`leaveTypeId`),
  CONSTRAINT `kemri_employee_leave_entitlements_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`),
  CONSTRAINT `kemri_employee_leave_entitlements_ibfk_2` FOREIGN KEY (`leaveTypeId`) REFERENCES `kemri_leave_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_leave_entitlements`
--

LOCK TABLES `kemri_employee_leave_entitlements` WRITE;
/*!40000 ALTER TABLE `kemri_employee_leave_entitlements` DISABLE KEYS */;
INSERT INTO `kemri_employee_leave_entitlements` VALUES (1,1,1,2025,26.00,1,'2025-08-22 08:16:44','2025-08-22 08:16:44',0),(2,3,1,2025,30.00,1,'2025-08-22 08:17:05','2025-08-22 08:17:05',0),(3,1,3,2025,20.00,1,'2025-08-22 08:17:42','2025-08-22 08:17:59',0),(4,3,2,2025,90.00,1,'2025-08-22 08:19:07','2025-08-22 08:24:35',1),(5,2,1,2025,30.00,1,'2025-08-22 08:43:21','2025-08-22 08:43:21',0),(6,2,3,2025,10.00,1,'2025-08-22 10:08:55','2025-08-22 10:08:55',0);
/*!40000 ALTER TABLE `kemri_employee_leave_entitlements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_loans`
--

DROP TABLE IF EXISTS `kemri_employee_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `loanAmount` decimal(10,2) NOT NULL,
  `loanDate` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `repaymentSchedule` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_loans_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_loans`
--

LOCK TABLES `kemri_employee_loans` WRITE;
/*!40000 ALTER TABLE `kemri_employee_loans` DISABLE KEYS */;
INSERT INTO `kemri_employee_loans` VALUES (1,1,54654656.00,'2025-08-13','Approved','56456565465',1,'2025-08-17 09:30:04','2025-08-22 09:09:30',0),(2,1,455.00,'2025-08-22','Pending','55555',1,'2025-08-22 09:09:03','2025-08-22 09:09:03',0);
/*!40000 ALTER TABLE `kemri_employee_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_memberships`
--

DROP TABLE IF EXISTS `kemri_employee_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_memberships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `organizationName` varchar(255) NOT NULL,
  `membershipNumber` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_memberships_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_memberships`
--

LOCK TABLES `kemri_employee_memberships` WRITE;
/*!40000 ALTER TABLE `kemri_employee_memberships` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_employee_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_performance`
--

DROP TABLE IF EXISTS `kemri_employee_performance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_performance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `reviewDate` date NOT NULL,
  `reviewScore` int DEFAULT NULL,
  `comments` text,
  `reviewerId` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId_fk` (`staffId`),
  CONSTRAINT `performance_staff_fk` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_performance`
--

LOCK TABLES `kemri_employee_performance` WRITE;
/*!40000 ALTER TABLE `kemri_employee_performance` DISABLE KEYS */;
INSERT INTO `kemri_employee_performance` VALUES (1,1,'2025-08-09',1,'He needs to undergo training in ICT',1,'2025-08-15 09:21:12','2025-08-15 12:30:20',0),(2,1,'2025-08-15',2,'Testin reviews resting done',1,'2025-08-15 12:00:18','2025-08-15 12:17:14',0),(3,1,'2025-08-22',2,'sasas',2,'2025-08-22 06:18:27','2025-08-22 06:18:27',0),(4,1,'2025-08-22',5,'He has really improved',9,'2025-08-22 06:19:02','2025-08-22 06:19:02',0),(5,1,'2024-06-30',95,'Exceeded all performance goals for the year.',7,'2025-08-29 03:02:22','2025-08-29 03:02:22',0),(6,2,'2024-06-30',88,'Met all key performance indicators with some outstanding results.',7,'2025-08-29 03:02:22','2025-08-29 03:02:22',0),(7,3,'2024-06-30',75,'Consistent performance, meets expectations.',7,'2025-08-29 03:02:22','2025-08-29 03:02:22',0),(8,4,'2024-06-30',98,'Exceptional performance, exceeded all metrics.',7,'2025-08-29 03:02:22','2025-08-29 03:02:22',0),(9,5,'2024-06-30',80,'Strong performance, good team player.',7,'2025-08-29 03:02:22','2025-08-29 03:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_performance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_project_assignments`
--

DROP TABLE IF EXISTS `kemri_employee_project_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_project_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `projectId` varchar(255) NOT NULL,
  `milestoneName` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `dueDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_project_assignments_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_project_assignments`
--

LOCK TABLES `kemri_employee_project_assignments` WRITE;
/*!40000 ALTER TABLE `kemri_employee_project_assignments` DISABLE KEYS */;
INSERT INTO `kemri_employee_project_assignments` VALUES (1,1,'1','Developing ICT Manuals','sdsd','Not Started','2025-08-21',1,'2025-08-21 10:06:09','2025-08-22 06:37:03',0),(2,1,'aaaa','sasasas','asas','Not Started','2025-08-13',1,'2025-08-21 10:08:50','2025-08-21 10:08:50',0);
/*!40000 ALTER TABLE `kemri_employee_project_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_promotions`
--

DROP TABLE IF EXISTS `kemri_employee_promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `oldJobGroupId` int DEFAULT NULL,
  `newJobGroupId` int DEFAULT NULL,
  `promotionDate` date NOT NULL,
  `comments` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  KEY `oldJobGroupId` (`oldJobGroupId`),
  KEY `newJobGroupId` (`newJobGroupId`),
  CONSTRAINT `kemri_employee_promotions_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`),
  CONSTRAINT `kemri_employee_promotions_ibfk_2` FOREIGN KEY (`oldJobGroupId`) REFERENCES `kemri_job_groups` (`id`),
  CONSTRAINT `kemri_employee_promotions_ibfk_3` FOREIGN KEY (`newJobGroupId`) REFERENCES `kemri_job_groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_promotions`
--

LOCK TABLES `kemri_employee_promotions` WRITE;
/*!40000 ALTER TABLE `kemri_employee_promotions` DISABLE KEYS */;
INSERT INTO `kemri_employee_promotions` VALUES (1,1,NULL,2,'2025-08-21','Promoted to senior developer after completing the software development training ',1,'2025-08-21 12:15:19','2025-08-21 12:15:19',0),(2,1,NULL,2,'2025-08-22','test prious',1,'2025-08-21 12:17:01','2025-08-21 12:17:01',0),(3,1,3,1,'2024-01-10','Promoted from Administrative to Research Scientist.',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(4,7,3,1,'2023-09-01','Promoted due to exemplary performance.',7,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(5,11,3,2,'2022-05-01','Moved to a more specialized lab role.',11,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_retirements`
--

DROP TABLE IF EXISTS `kemri_employee_retirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_retirements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `retirementDate` date NOT NULL,
  `retirementType` varchar(255) NOT NULL,
  `comments` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_retirements_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_retirements`
--

LOCK TABLES `kemri_employee_retirements` WRITE;
/*!40000 ALTER TABLE `kemri_employee_retirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_employee_retirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_terminations`
--

DROP TABLE IF EXISTS `kemri_employee_terminations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_terminations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `exitDate` date NOT NULL,
  `reason` text NOT NULL,
  `exitInterviewDetails` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_terminations_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_terminations`
--

LOCK TABLES `kemri_employee_terminations` WRITE;
/*!40000 ALTER TABLE `kemri_employee_terminations` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_employee_terminations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_employee_training`
--

DROP TABLE IF EXISTS `kemri_employee_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_employee_training` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `certificationName` varchar(255) DEFAULT NULL,
  `completionDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_employee_training_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_employee_training`
--

LOCK TABLES `kemri_employee_training` WRITE;
/*!40000 ALTER TABLE `kemri_employee_training` DISABLE KEYS */;
INSERT INTO `kemri_employee_training` VALUES (1,1,'asas','asa','asas','2025-08-18','2025-08-29',1,'2025-08-17 09:28:09','2025-08-29 06:11:44',1),(2,1,'Cyber Security','Moi University','BS Computer Science','2025-08-19','2025-08-28',1,'2025-08-17 09:47:46','2025-08-23 12:09:04',0),(3,1,'Project Management Professional','PMI','PMP','2024-03-20','2027-03-20',1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(4,2,'Lab Safety Protocols','KEMRI Internal Training','Safety Certification','2023-05-10','2026-05-10',2,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(5,3,'Advanced Excel for Admins','Corporate IT Solutions','Advanced Excel','2022-07-22','2025-07-22',3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(6,4,'Biostatistics for Researchers','University of Nairobi','Biostatistics Certificate','2024-02-15','2029-02-15',4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(7,5,'ISO 17025','Standards Training','ISO 17025 Auditor','2023-11-01','2026-11-01',5,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_employee_training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_financialyears`
--

DROP TABLE IF EXISTS `kemri_financialyears`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_financialyears` (
  `finYearId` int NOT NULL AUTO_INCREMENT,
  `finYearName` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `remarks` text,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`finYearId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_financialyears_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_financialyears_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_financialyears`
--

LOCK TABLES `kemri_financialyears` WRITE;
/*!40000 ALTER TABLE `kemri_financialyears` DISABLE KEYS */;
INSERT INTO `kemri_financialyears` VALUES (1,'FY2025/2026','2025-02-19 12:27:10','2026-02-18 21:00:00','Test',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(2,'FY2020/2021','2020-05-09 21:00:00','2021-05-09 21:00:00','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(3,'FY2023/2024','2023-06-30 21:00:00','2024-06-29 21:00:00','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(4,'FY2023/2024','2023-05-31 21:00:00','2024-06-29 21:00:00','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(5,'FY2022/2023','2024-05-09 11:25:46','2024-05-09 11:25:46','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(6,'FY2023/2024','2024-05-09 11:25:46','2024-05-09 11:25:46','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(7,'FY2018/2019','2018-06-09 04:00:00','2019-06-08 01:44:02','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(8,'FY2017/2018','2017-06-07 04:00:00','2018-06-08 01:44:02','',0,1,'2025-10-15 05:05:30','2025-10-15 05:05:30',NULL),(9,'FY2019/2020',NULL,NULL,NULL,0,NULL,'2025-10-15 05:56:20','2025-10-15 05:56:20',NULL),(10,'FY2021/2022',NULL,NULL,NULL,0,NULL,'2025-10-15 05:56:20','2025-10-15 05:56:20',NULL);
/*!40000 ALTER TABLE `kemri_financialyears` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_inspection_teams`
--

DROP TABLE IF EXISTS `kemri_inspection_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_inspection_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `staffId` int NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `voided` tinyint NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requestId` (`requestId`),
  KEY `staffId` (`staffId`),
  KEY `userId` (`userId`),
  CONSTRAINT `kemri_inspection_teams_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_inspection_teams_ibfk_2` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`) ON DELETE RESTRICT,
  CONSTRAINT `kemri_inspection_teams_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_inspection_teams`
--

LOCK TABLES `kemri_inspection_teams` WRITE;
/*!40000 ALTER TABLE `kemri_inspection_teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_inspection_teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_job_groups`
--

DROP TABLE IF EXISTS `kemri_job_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_job_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) NOT NULL,
  `salaryScale` decimal(10,2) DEFAULT NULL,
  `description` text,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_job_groups`
--

LOCK TABLES `kemri_job_groups` WRITE;
/*!40000 ALTER TABLE `kemri_job_groups` DISABLE KEYS */;
INSERT INTO `kemri_job_groups` VALUES (1,'Software Developer',200000.00,'Develops software solutions',1,'2025-08-21 12:13:39','2025-08-22 08:24:56',0),(2,'Senior Software Developers',200000.00,'Leads software development teams',1,'2025-08-21 12:14:16','2025-08-21 12:14:16',0),(3,'Senior AI Researcher',30000.00,'Develops and models AI Agents',1,'2025-08-21 12:16:12','2025-08-21 12:16:12',0);
/*!40000 ALTER TABLE `kemri_job_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_leave_applications`
--

DROP TABLE IF EXISTS `kemri_leave_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_leave_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `leaveTypeId` int NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `numberOfDays` int DEFAULT NULL,
  `reason` text,
  `handoverStaffId` int DEFAULT NULL,
  `handoverComments` text,
  `status` enum('Pending','Approved','Rejected','Completed') DEFAULT 'Pending',
  `approvedStartDate` date DEFAULT NULL,
  `approvedEndDate` date DEFAULT NULL,
  `actualReturnDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  KEY `handoverStaffId` (`handoverStaffId`),
  KEY `leaveTypeId` (`leaveTypeId`),
  CONSTRAINT `kemri_leave_applications_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`),
  CONSTRAINT `kemri_leave_applications_ibfk_2` FOREIGN KEY (`handoverStaffId`) REFERENCES `kemri_staff` (`staffId`),
  CONSTRAINT `kemri_leave_applications_ibfk_3` FOREIGN KEY (`leaveTypeId`) REFERENCES `kemri_leave_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_leave_applications`
--

LOCK TABLES `kemri_leave_applications` WRITE;
/*!40000 ALTER TABLE `kemri_leave_applications` DISABLE KEYS */;
INSERT INTO `kemri_leave_applications` VALUES (1,2,1,'2025-08-28','2025-08-22',NULL,'wewe',1,'we','Completed','2025-08-29','2025-08-21','2025-08-28',1,'2025-08-14 20:13:37','2025-08-14 20:35:17',0),(2,7,1,'2025-08-15','2025-08-18',5,'ghhh',4,'gjhhhghgg','Pending',NULL,NULL,NULL,1,'2025-08-15 09:41:59','2025-08-15 10:38:57',0),(3,12,2,'2025-08-20','2025-08-28',90,'Testing update',14,'Development of ICT Mannuals','Approved','2025-08-22','2025-08-29',NULL,1,'2025-08-15 14:44:08','2025-08-15 15:43:23',0),(4,1,1,'2025-08-21','2025-08-29',0,'ewewqewqewq',10,'wewe','Pending',NULL,NULL,NULL,1,'2025-08-22 10:27:41','2025-08-22 10:27:41',0),(5,1,1,'2025-08-13','2025-08-29',17,'sdsd',3,'sdsds','Completed','2025-08-12','2025-08-28','2025-08-29',1,'2025-08-22 10:33:48','2025-08-22 11:34:43',0),(6,1,1,'2025-08-22','2025-09-05',11,'Test NEw ICt',9,'Testing','Completed','2025-08-21','2025-09-04','2025-08-29',1,'2025-08-22 12:39:33','2025-08-22 13:06:15',0),(7,1,1,'2025-09-01','2025-09-10',10,'Family vacation.',NULL,NULL,'Approved','2025-09-01','2025-09-10',NULL,1,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(8,2,2,'2025-08-15','2025-08-17',3,'Flu.',NULL,NULL,'Approved','2025-08-15','2025-08-17',NULL,2,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(9,3,1,'2025-12-20','2026-01-05',16,'Holiday travel.',NULL,NULL,'Pending',NULL,NULL,NULL,3,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(10,4,3,'2025-10-01','2025-12-30',90,'Expecting a baby.',NULL,NULL,'Approved','2025-10-01','2025-12-30',NULL,4,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(11,5,1,'2025-11-10','2025-11-15',5,'Personal.',NULL,NULL,'Rejected',NULL,NULL,NULL,5,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(12,6,2,'2025-09-20','2025-09-22',3,'Stomach bug.',NULL,NULL,'Approved','2025-09-20','2025-09-22',NULL,6,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(13,7,1,'2025-12-01','2025-12-14',14,'End of year rest.',NULL,NULL,'Approved','2025-12-01','2025-12-14',NULL,7,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(14,8,2,'2025-08-25','2025-08-27',3,'Fever.',NULL,NULL,'Approved','2025-08-25','2025-08-27',NULL,8,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(15,9,1,'2025-10-15','2025-10-25',10,'Annual leave.',NULL,NULL,'Pending',NULL,NULL,NULL,9,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(16,10,1,'2025-11-20','2025-11-25',6,'Short break.',NULL,NULL,'Approved','2025-11-20','2025-11-25',NULL,10,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(17,11,2,'2025-09-10','2025-09-12',3,'Dental appointment.',NULL,NULL,'Approved','2025-09-10','2025-09-12',NULL,11,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(18,12,1,'2025-12-22','2026-01-02',12,'Christmas holiday.',NULL,NULL,'Approved','2025-12-22','2026-01-02',NULL,12,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(19,13,1,'2025-09-05','2025-09-15',11,'Family visit.',NULL,NULL,'Approved','2025-09-05','2025-09-15',NULL,13,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(20,14,2,'2025-08-10','2025-08-12',3,'Migraine.',NULL,NULL,'Approved','2025-08-10','2025-08-12',NULL,14,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(21,15,1,'2025-11-01','2025-11-05',5,'Personal errands.',NULL,NULL,'Pending',NULL,NULL,NULL,15,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(22,16,1,'2025-12-10','2025-12-20',11,'Holiday.',NULL,NULL,'Approved','2025-12-10','2025-12-20',NULL,16,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(23,17,2,'2025-09-18','2025-09-20',3,'Food poisoning.',NULL,NULL,'Approved','2025-09-18','2025-09-20',NULL,17,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(24,18,1,'2025-10-20','2025-10-25',6,'Annual trip.',NULL,NULL,'Approved','2025-10-20','2025-10-25',NULL,18,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(25,19,1,'2025-11-25','2025-12-05',11,'Vacation.',NULL,NULL,'Approved','2025-11-25','2025-12-05',NULL,19,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(26,20,2,'2025-08-28','2025-08-30',3,'Sore throat.',NULL,NULL,'Approved','2025-08-28','2025-08-30',NULL,20,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(27,21,1,'2025-12-15','2025-12-25',11,'Holiday leave.',NULL,NULL,'Pending',NULL,NULL,NULL,21,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(28,22,1,'2025-10-05','2025-10-10',6,'Personal.',NULL,NULL,'Approved','2025-10-05','2025-10-10',NULL,22,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(29,23,2,'2025-09-01','2025-09-03',3,'Back pain.',NULL,NULL,'Approved','2025-09-01','2025-09-03',NULL,23,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(30,24,1,'2025-11-08','2025-11-15',8,'Annual leave.',NULL,NULL,'Approved','2025-11-08','2025-11-15',NULL,24,'2025-08-29 06:02:22','2025-08-29 06:02:22',0),(31,25,1,'2025-12-05','2025-12-15',11,'Christmas leave.',NULL,NULL,'Approved','2025-12-05','2025-12-15',NULL,25,'2025-08-29 06:02:22','2025-08-29 06:02:22',0);
/*!40000 ALTER TABLE `kemri_leave_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_leave_types`
--

DROP TABLE IF EXISTS `kemri_leave_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_leave_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `numberOfDays` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_leave_types`
--

LOCK TABLES `kemri_leave_types` WRITE;
/*!40000 ALTER TABLE `kemri_leave_types` DISABLE KEYS */;
INSERT INTO `kemri_leave_types` VALUES (1,'Annual Leave','Yearly Leave',30,1,'2025-08-14 20:13:01','2025-08-15 14:42:48',0),(2,'Mertenity Leave','Mertenity',90,1,'2025-08-15 14:43:10','2025-08-15 14:43:10',0),(3,'Paternity Leave','Days given to male employee to attend to wife after delivert',10,1,'2025-08-22 10:38:55','2025-08-22 10:39:31',0);
/*!40000 ALTER TABLE `kemri_leave_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_milestone_activities`
--

DROP TABLE IF EXISTS `kemri_milestone_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_milestone_activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `milestoneId` int NOT NULL,
  `activityId` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_milestone_activity` (`milestoneId`,`activityId`),
  KEY `activityId` (`activityId`),
  CONSTRAINT `kemri_milestone_activities_ibfk_1` FOREIGN KEY (`milestoneId`) REFERENCES `kemri_project_milestones` (`milestoneId`),
  CONSTRAINT `kemri_milestone_activities_ibfk_2` FOREIGN KEY (`activityId`) REFERENCES `kemri_activities` (`activityId`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_milestone_activities`
--

LOCK TABLES `kemri_milestone_activities` WRITE;
/*!40000 ALTER TABLE `kemri_milestone_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_milestone_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_milestone_attachments`
--

DROP TABLE IF EXISTS `kemri_milestone_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_milestone_attachments` (
  `attachmentId` int NOT NULL AUTO_INCREMENT,
  `milestoneId` int NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `description` text,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  `fileSize` int DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachmentId`),
  KEY `milestoneId` (`milestoneId`),
  KEY `userId` (`userId`),
  CONSTRAINT `kemri_milestone_attachments_ibfk_1` FOREIGN KEY (`milestoneId`) REFERENCES `kemri_project_milestones` (`milestoneId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_milestone_attachments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_milestone_attachments`
--

LOCK TABLES `kemri_milestone_attachments` WRITE;
/*!40000 ALTER TABLE `kemri_milestone_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_milestone_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_monthly_payroll`
--

DROP TABLE IF EXISTS `kemri_monthly_payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_monthly_payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `payPeriod` date NOT NULL,
  `grossSalary` decimal(10,2) NOT NULL,
  `netSalary` decimal(10,2) NOT NULL,
  `allowances` decimal(10,2) DEFAULT NULL,
  `deductions` decimal(10,2) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_monthly_payroll_ibfk_1` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_monthly_payroll`
--

LOCK TABLES `kemri_monthly_payroll` WRITE;
/*!40000 ALTER TABLE `kemri_monthly_payroll` DISABLE KEYS */;
INSERT INTO `kemri_monthly_payroll` VALUES (1,1,'2025-08-08',5464565.00,5565.00,56.00,565565.00,1,'2025-08-17 09:29:39','2025-08-17 09:29:39',0),(2,1,'2025-08-19',2132.00,2132.00,2332.00,2323.00,1,'2025-08-22 08:36:13','2025-08-29 06:11:16',1),(3,1,'2025-08-22',2323.00,2323.00,323.00,232.00,1,'2025-08-22 09:05:26','2025-08-29 06:11:13',1);
/*!40000 ALTER TABLE `kemri_monthly_payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_participants`
--

DROP TABLE IF EXISTS `kemri_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `individualId` int DEFAULT NULL,
  `householdId` int DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `villageLocality` int DEFAULT NULL,
  `gpsLongitude` decimal(10,7) DEFAULT NULL,
  `gpsLatitude` decimal(10,7) DEFAULT NULL,
  `vectorBorneDiseaseStatus` varchar(255) DEFAULT NULL,
  `malariaDiagnosis` varchar(255) DEFAULT NULL,
  `dengueDiagnosis` varchar(255) DEFAULT NULL,
  `leishmaniasisDiagnosis` varchar(255) DEFAULT NULL,
  `waterSource` varchar(255) DEFAULT NULL,
  `housingType` varchar(255) DEFAULT NULL,
  `mosquitoNetUsage` int DEFAULT NULL,
  `educationLevel` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `incomeKshMonth` decimal(15,2) DEFAULT NULL,
  `accessToHealthcareKm` varchar(255) DEFAULT NULL,
  `climatePerceptionScore` decimal(15,2) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_participants`
--

LOCK TABLES `kemri_participants` WRITE;
/*!40000 ALTER TABLE `kemri_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_approval_history`
--

DROP TABLE IF EXISTS `kemri_payment_approval_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_approval_history` (
  `historyId` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `action` enum('Approve','Reject','Comment','Returned for Correction','Assigned') NOT NULL,
  `actionByUserId` int NOT NULL,
  `assignedToUserId` int DEFAULT NULL,
  `actionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`historyId`),
  KEY `requestId` (`requestId`),
  KEY `actionByUserId` (`actionByUserId`),
  KEY `assignedToUserId` (`assignedToUserId`),
  CONSTRAINT `kemri_payment_approval_history_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`),
  CONSTRAINT `kemri_payment_approval_history_ibfk_2` FOREIGN KEY (`actionByUserId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_payment_approval_history_ibfk_3` FOREIGN KEY (`assignedToUserId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_approval_history`
--

LOCK TABLES `kemri_payment_approval_history` WRITE;
/*!40000 ALTER TABLE `kemri_payment_approval_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_payment_approval_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_approval_levels`
--

DROP TABLE IF EXISTS `kemri_payment_approval_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_approval_levels` (
  `levelId` int NOT NULL AUTO_INCREMENT,
  `levelName` varchar(255) NOT NULL,
  `roleId` int NOT NULL,
  `approvalOrder` int NOT NULL,
  `workflowId` int DEFAULT NULL,
  PRIMARY KEY (`levelId`),
  UNIQUE KEY `roleId` (`roleId`,`approvalOrder`),
  KEY `workflowId` (`workflowId`),
  CONSTRAINT `kemri_payment_approval_levels_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `kemri_roles` (`roleId`),
  CONSTRAINT `kemri_payment_approval_levels_ibfk_2` FOREIGN KEY (`workflowId`) REFERENCES `kemri_project_workflows` (`workflowId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_approval_levels`
--

LOCK TABLES `kemri_payment_approval_levels` WRITE;
/*!40000 ALTER TABLE `kemri_payment_approval_levels` DISABLE KEYS */;
INSERT INTO `kemri_payment_approval_levels` VALUES (1,'Departmental approvaldd',1,1,NULL),(2,'Finance department review',1,2,NULL),(3,'County Executive approval',1,3,NULL),(4,'Governor\'s approval',1,4,NULL),(5,'Internet Banking',1,5,NULL);
/*!40000 ALTER TABLE `kemri_payment_approval_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_details`
--

DROP TABLE IF EXISTS `kemri_payment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_details` (
  `detailId` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `paymentMode` enum('Bank Transfer','Cheque','Mobile Money','Other') NOT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `accountNumber` varchar(255) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `paidByUserId` int NOT NULL,
  `paidAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdByUserId` int DEFAULT NULL,
  `voided` tinyint NOT NULL DEFAULT '0',
  `voidedByUserId` int DEFAULT NULL,
  PRIMARY KEY (`detailId`),
  UNIQUE KEY `requestId` (`requestId`),
  KEY `paidByUserId` (`paidByUserId`),
  KEY `createdByUserId` (`createdByUserId`),
  KEY `voidedByUserId` (`voidedByUserId`),
  CONSTRAINT `kemri_payment_details_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`),
  CONSTRAINT `kemri_payment_details_ibfk_2` FOREIGN KEY (`paidByUserId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_payment_details_ibfk_3` FOREIGN KEY (`createdByUserId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_payment_details_ibfk_4` FOREIGN KEY (`voidedByUserId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_details`
--

LOCK TABLES `kemri_payment_details` WRITE;
/*!40000 ALTER TABLE `kemri_payment_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_payment_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_request_approvals`
--

DROP TABLE IF EXISTS `kemri_payment_request_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_request_approvals` (
  `approvalId` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `stage` varchar(100) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `comments` text,
  `actionByUserId` int NOT NULL,
  `actionDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`approvalId`),
  KEY `requestId` (`requestId`),
  KEY `actionByUserId` (`actionByUserId`),
  CONSTRAINT `kemri_payment_request_approvals_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_payment_request_approvals_ibfk_2` FOREIGN KEY (`actionByUserId`) REFERENCES `kemri_users` (`userId`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_request_approvals`
--

LOCK TABLES `kemri_payment_request_approvals` WRITE;
/*!40000 ALTER TABLE `kemri_payment_request_approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_payment_request_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_request_documents`
--

DROP TABLE IF EXISTS `kemri_payment_request_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_request_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `documentType` enum('invoice','photo','inspection_report','payment_certificate','other') NOT NULL,
  `documentPath` varchar(255) NOT NULL,
  `description` text,
  `uploadedByUserId` int NOT NULL,
  `voided` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requestId` (`requestId`),
  KEY `uploadedByUserId` (`uploadedByUserId`),
  CONSTRAINT `kemri_payment_request_documents_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_payment_request_documents_ibfk_2` FOREIGN KEY (`uploadedByUserId`) REFERENCES `kemri_users` (`userId`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_request_documents`
--

LOCK TABLES `kemri_payment_request_documents` WRITE;
/*!40000 ALTER TABLE `kemri_payment_request_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_payment_request_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_request_milestones`
--

DROP TABLE IF EXISTS `kemri_payment_request_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_request_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requestId` int NOT NULL,
  `activityId` int NOT NULL,
  `status` enum('accomplished','not_accomplished') NOT NULL DEFAULT 'accomplished',
  `voided` tinyint NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requestId` (`requestId`),
  KEY `activityId` (`activityId`),
  KEY `userId` (`userId`),
  CONSTRAINT `kemri_payment_request_milestones_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_payment_request_milestones_ibfk_2` FOREIGN KEY (`activityId`) REFERENCES `kemri_activities` (`activityId`) ON DELETE CASCADE,
  CONSTRAINT `kemri_payment_request_milestones_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_request_milestones`
--

LOCK TABLES `kemri_payment_request_milestones` WRITE;
/*!40000 ALTER TABLE `kemri_payment_request_milestones` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_payment_request_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_payment_status_definitions`
--

DROP TABLE IF EXISTS `kemri_payment_status_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_payment_status_definitions` (
  `statusId` int NOT NULL AUTO_INCREMENT,
  `statusName` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`statusId`),
  UNIQUE KEY `statusName` (`statusName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_payment_status_definitions`
--

LOCK TABLES `kemri_payment_status_definitions` WRITE;
/*!40000 ALTER TABLE `kemri_payment_status_definitions` DISABLE KEYS */;
INSERT INTO `kemri_payment_status_definitions` VALUES (1,'Submitted','Request submitted by contractor.'),(2,'Awaiting PM Review','Awaiting review from the Project Manager.'),(3,'Awaiting Finance Review','Awaiting review from the Finance department.'),(4,'Returned for Correction','Returned to the submitter for corrections.'),(5,'Approved for Payment','The request has been fully approved.'),(6,'Paid','The payment has been processed.'),(7,'Rejected','The request has been rejected.'),(8,'weds','SDSD');
/*!40000 ALTER TABLE `kemri_payment_status_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_planningdocuments`
--

DROP TABLE IF EXISTS `kemri_planningdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_planningdocuments` (
  `attachmentId` int NOT NULL AUTO_INCREMENT,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL COMMENT 'Path or URL where the file is stored (e.g., S3, local, shared drive)',
  `fileType` varchar(50) DEFAULT NULL COMMENT 'e.g., pdf, docx, xlsx, image/jpeg',
  `fileSize` int DEFAULT NULL COMMENT 'File size in bytes',
  `description` text COMMENT 'Short description of the attachment',
  `entityId` int NOT NULL COMMENT 'The ID of the related strategic plan, program, or subProgram',
  `entityType` varchar(50) NOT NULL COMMENT 'The type of entity: "planPRegistry", "program", "subProgram"',
  `uploadedBy` int DEFAULT NULL COMMENT 'FK to kemri_users.userId or kemri_staff.staffId (who uploaded it)',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`attachmentId`),
  KEY `idx_entity_id_type` (`entityId`,`entityType`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_planningdocuments`
--

LOCK TABLES `kemri_planningdocuments` WRITE;
/*!40000 ALTER TABLE `kemri_planningdocuments` DISABLE KEYS */;
INSERT INTO `kemri_planningdocuments` VALUES (1,'Quotation_v1.pdf','/uploads/1753917208966-Quotation_v1.pdf','application/pdf',50710,'sasasassasasa',1,'strategicPlan',NULL,'2025-07-31 02:13:28','2025-07-31 02:13:28',0),(2,'PHD Recommendation Form - Employer -INTELLIBIZ TIMOTHY SUDI.pdf','/uploads/1753917350128-PHD Recommendation Form - Employer -INTELLIBIZ TIMOTHY SUDI.pdf','application/pdf',554013,'asasaSA',1,'strategicPlan',NULL,'2025-07-31 02:15:50','2025-07-31 02:15:50',0),(3,'khwisero.ods','/uploads/1753920501335-khwisero.ods','application/vnd.oasis.opendocument.spreadsheet',15515,'ssss',1,'strategicPlan',NULL,'2025-07-31 03:08:21','2025-07-31 03:08:21',0),(4,'Screenshot from 2025-06-27 10-56-18.png','/uploads/1753920744173-Screenshot from 2025-06-27 10-56-18.png','image/png',10246,'logo',1,'strategicPlan',NULL,'2025-07-31 03:12:24','2025-07-31 03:12:24',0);
/*!40000 ALTER TABLE `kemri_planningdocuments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_privileges`
--

DROP TABLE IF EXISTS `kemri_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_privileges` (
  `privilegeId` int NOT NULL AUTO_INCREMENT,
  `privilegeName` varchar(255) DEFAULT NULL,
  `description` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`privilegeId`),
  UNIQUE KEY `unique_privilege_name` (`privilegeName`)
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_privileges`
--

LOCK TABLES `kemri_privileges` WRITE;
/*!40000 ALTER TABLE `kemri_privileges` DISABLE KEYS */;
INSERT INTO `kemri_privileges` VALUES (1,'user.read_all','Allows viewing all user accounts.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(2,'user.create','Allows creating new user accounts.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(3,'user.update','Allows updating existing user accounts.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(4,'user.delete','Allows deleting user accounts.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(5,'project.read_all','Allows viewing all projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(6,'project.create','Allows creating new projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(7,'project.update','Allows updating existing projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(8,'project.delete','Allows deleting projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(9,'project.manage_own','Allows managing projects assigned to the user (e.g., project lead).','2025-07-19 00:12:32','2025-07-19 00:12:32'),(10,'task.read_all','Allows viewing all tasks across projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(11,'task.create','Allows creating new tasks.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(12,'task.update','Allows updating existing tasks.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(13,'task.delete','Allows deleting tasks.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(14,'task.manage_assignees','Allows assigning/unassigning staff to tasks.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(15,'task.manage_dependencies','Allows managing task dependencies.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(16,'milestone.read_all','Allows viewing all milestones across projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(17,'milestone.create','Allows creating new milestones.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(18,'milestone.update','Allows updating existing milestones.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(19,'milestone.delete','Allows deleting milestones.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(20,'raw_data.view','Allows viewing raw data.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(21,'raw_data.export','Allows exporting raw data.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(22,'raw_data.create','Allows adding new raw data entries.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(23,'raw_data.update','Allows modifying raw data entries.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(24,'raw_data.delete','Allows deleting raw data entries.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(25,'dashboard.view','Allows viewing the main dashboard.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(26,'reports.view_all','Allows viewing all system reports.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(88,'role.read_all','Allows viewing all roles in the system.','2025-07-30 13:47:20',NULL),(89,'role.create','Allows creating new roles.','2025-07-30 13:47:20',NULL),(90,'role.update','Allows updating existing role details.','2025-07-30 13:47:20',NULL),(91,'role.delete','Allows deleting roles.','2025-07-30 13:47:20',NULL),(92,'privilege.read_all','Allows viewing all privileges in the system.','2025-07-30 13:47:20',NULL),(93,'privilege.create','Allows creating new privileges.','2025-07-30 13:47:20',NULL),(94,'privilege.update','Allows updating existing privilege details.','2025-07-30 13:47:20',NULL),(95,'privilege.delete','Allows deleting privileges.','2025-07-30 13:47:20',NULL),(96,'project.read_gantt_chart','can read project.read_gantt_chart','2025-07-30 14:02:52','2025-07-30 14:02:52'),(97,'strategic_plan.read_all','Allows viewing all strategic plans.','2025-07-31 10:34:27',NULL),(98,'strategic_plan.create','Allows creating new strategic plans.','2025-07-31 10:34:27',NULL),(99,'strategic_plan.update','Allows updating existing strategic plan details.','2025-07-31 10:34:27',NULL),(100,'strategic_plan.delete','Allows deleting strategic plans.','2025-07-31 10:34:27',NULL),(101,'program.create','Allows creating new programs.','2025-07-31 10:34:27',NULL),(102,'program.update','Allows updating existing program details.','2025-07-31 10:34:27',NULL),(103,'program.delete','Allows deleting programs.','2025-07-31 10:34:27',NULL),(104,'subprogram.create','Allows creating new subprograms.','2025-07-31 10:34:27',NULL),(105,'subprogram.update','Allows updating existing subprogram details.','2025-07-31 10:34:27',NULL),(106,'subprogram.delete','Allows deleting subprograms.','2025-07-31 10:34:27',NULL),(107,'document.upload','Allows uploading documents/attachments.','2025-07-31 10:34:27',NULL),(108,'document.delete','Allows deleting documents/attachments.','2025-07-31 10:34:27',NULL),(109,'strategic_plan.import','strategic_plan.import','2025-07-31 10:53:03','2025-07-31 10:53:03'),(110,'kdsp_conceptNote.create','Allows creating a project concept note.','2025-08-01 07:16:35',NULL),(111,'kdsp_conceptNote.read_all','Allows viewing project concept notes.','2025-08-01 07:16:35',NULL),(112,'kdsp_conceptNote.update','Allows updating a project concept note.','2025-08-01 07:16:35',NULL),(113,'kdsp_conceptNote.delete','Allows deleting a project concept note.','2025-08-01 07:16:35',NULL),(114,'kdsp_needsAssessment.create','Allows creating a project needs assessment.','2025-08-01 07:16:35',NULL),(115,'kdsp_needsAssessment.read_all','Allows viewing project needs assessments.','2025-08-01 07:16:35',NULL),(116,'kdsp_needsAssessment.update','Allows updating a project needs assessment.','2025-08-01 07:16:35',NULL),(117,'kdsp_needsAssessment.delete','Allows deleting a project needs assessment.','2025-08-01 07:16:35',NULL),(118,'kdsp_financials.create','Allows creating project financial information.','2025-08-01 07:16:35',NULL),(119,'kdsp_financials.read_all','Allows viewing project financial information.','2025-08-01 07:16:35',NULL),(120,'kdsp_financials.update','Allows updating project financial information.','2025-08-01 07:16:35',NULL),(121,'kdsp_financials.delete','Allows deleting project financial information.','2025-08-01 07:16:35',NULL),(122,'kdsp_fyBreakdown.create','Allows creating a project FY breakdown record.','2025-08-01 07:16:35',NULL),(123,'kdsp_fyBreakdown.read_all','Allows viewing project FY breakdown records.','2025-08-01 07:16:35',NULL),(124,'kdsp_fyBreakdown.update','Allows updating a project FY breakdown record.','2025-08-01 07:16:35',NULL),(125,'kdsp_fyBreakdown.delete','Allows deleting a project FY breakdown record.','2025-08-01 07:16:35',NULL),(126,'kdsp_sustainability.create','Allows creating project sustainability details.','2025-08-01 07:16:35',NULL),(127,'kdsp_sustainability.read_all','Allows viewing project sustainability details.','2025-08-01 07:16:35',NULL),(128,'kdsp_sustainability.update','Allows updating project sustainability details.','2025-08-01 07:16:35',NULL),(129,'kdsp_sustainability.delete','Allows deleting project sustainability details.','2025-08-01 07:16:35',NULL),(130,'kdsp_implementationPlan.create','Allows creating a project implementation plan.','2025-08-01 07:16:35',NULL),(131,'kdsp_implementationPlan.read_all','Allows viewing a project implementation plan.','2025-08-01 07:16:35',NULL),(132,'kdsp_implementationPlan.update','Allows updating a project implementation plan.','2025-08-01 07:16:35',NULL),(133,'kdsp_implementationPlan.delete','Allows deleting a project implementation plan.','2025-08-01 07:16:35',NULL),(134,'kdsp_mAndE.create','Allows creating project M&E details.','2025-08-01 07:16:35',NULL),(135,'kdsp_mAndE.read_all','Allows viewing project M&E details.','2025-08-01 07:16:35',NULL),(136,'kdsp_mAndE.update','Allows updating project M&E details.','2025-08-01 07:16:35',NULL),(137,'kdsp_mAndE.delete','Allows deleting project M&E details.','2025-08-01 07:16:35',NULL),(138,'kdsp_risks.create','Allows creating project risk records.','2025-08-01 07:16:35',NULL),(139,'kdsp_risks.read_all','Allows viewing project risk records.','2025-08-01 07:16:35',NULL),(140,'kdsp_risks.update','Allows updating project risk records.','2025-08-01 07:16:35',NULL),(141,'kdsp_risks.delete','Allows deleting project risk records.','2025-08-01 07:16:35',NULL),(142,'kdsp_stakeholders.create','Allows creating project stakeholder records.','2025-08-01 07:16:35',NULL),(143,'kdsp_stakeholders.read_all','Allows viewing project stakeholder records.','2025-08-01 07:16:35',NULL),(144,'kdsp_stakeholders.update','Allows updating project stakeholder records.','2025-08-01 07:16:35',NULL),(145,'kdsp_stakeholders.delete','Allows deleting project stakeholder records.','2025-08-01 07:16:35',NULL),(146,'kdsp_readiness.create','Allows creating project readiness details.','2025-08-01 07:16:35',NULL),(147,'kdsp_readiness.read_all','Allows viewing project readiness details.','2025-08-01 07:16:35',NULL),(148,'kdsp_readiness.update','Allows updating project readiness details.','2025-08-01 07:16:35',NULL),(149,'kdsp_readiness.delete','Allows deleting project readiness details.','2025-08-01 07:16:35',NULL),(150,'kdsp_hazardAssessment.create','Allows creating project hazard assessment records.','2025-08-01 07:16:35',NULL),(151,'kdsp_hazardAssessment.read_all','Allows viewing project hazard assessment records.','2025-08-01 07:16:35',NULL),(152,'kdsp_hazardAssessment.update','Allows updating project hazard assessment records.','2025-08-01 07:16:35',NULL),(153,'kdsp_hazardAssessment.delete','Allows deleting project hazard assessment records.','2025-08-01 07:16:35',NULL),(154,'kdsp_climateRisk.create','Allows creating project climate risk records.','2025-08-01 07:16:35',NULL),(155,'kdsp_climateRisk.read_all','Allows viewing project climate risk records.','2025-08-01 07:16:35',NULL),(156,'kdsp_climateRisk.update','Allows updating project climate risk records.','2025-08-01 07:16:35',NULL),(157,'kdsp_climateRisk.delete','Allows deleting project climate risk records.','2025-08-01 07:16:35',NULL),(158,'kdsp_esohsgScreening.create','Allows creating project ESOHSG screening records.','2025-08-01 07:16:35',NULL),(159,'kdsp_esohsgScreening.read_all','Allows viewing project ESOHSG screening records.','2025-08-01 07:16:35',NULL),(160,'kdsp_esohsgScreening.update','Allows updating project ESOHSG screening records.','2025-08-01 07:16:35',NULL),(161,'kdsp_esohsgScreening.delete','Allows deleting project ESOHSG screening records.','2025-08-01 07:16:35',NULL),(162,'project.read_kdsp_details','project.read_kdsp_details','2025-08-01 07:45:07','2025-08-01 07:45:07'),(164,'kdsp_project_pdf.download','kdsp_project_pdf.download','2025-08-01 08:49:23','2025-08-01 08:49:23'),(165,'strategic_plan.download_pdf','strategic_plan.download_pdf','2025-08-01 19:28:44','2025-08-01 19:28:44'),(166,'program.download_pdf','program.download_pdf','2025-08-01 19:29:04','2025-08-01 19:29:04'),(167,'program_pdf.download','program_pdf.download','2025-08-04 19:30:23','2025-08-04 19:30:23'),(168,'projects.create_map_data','projects.create_map_data','2025-08-05 12:02:11','2025-08-05 12:02:11'),(169,'department.read_all','department.read_all','2025-08-08 00:21:51','2025-08-08 00:21:51'),(170,'department.create','department.create','2025-08-08 00:22:08','2025-08-08 00:22:08'),(171,'department.update','department.update','2025-08-08 00:22:23','2025-08-08 00:22:23'),(172,'department.delete','department.delete','2025-08-08 00:22:37','2025-08-08 00:22:37'),(173,'section.create','section.create','2025-08-08 00:22:52','2025-08-08 00:22:52'),(174,'section.update','section.update','2025-08-08 00:23:06','2025-08-08 00:23:06'),(175,'section.delete','section.delete','2025-08-08 00:23:25','2025-08-08 00:23:25'),(176,'financialyear.read_all','financialyear.read_all','2025-08-08 00:23:41','2025-08-08 00:23:41'),(177,'financialyear.create','financialyear.create','2025-08-08 00:23:53','2025-08-08 00:23:53'),(178,'financialyear.update','financialyear.update','2025-08-08 00:24:06','2025-08-08 00:24:06'),(179,'financialyear.delete','financialyear.delete','2025-08-08 00:24:18','2025-08-08 00:24:18'),(181,'projectcategory.read_all','projectcategory.read_all','2025-08-08 17:50:20','2025-08-08 17:50:20'),(182,'projectcategory.create','This enables the \"Add New Category\" button and allows the user to create a new category.','2025-08-09 01:20:35','2025-08-09 01:20:35'),(183,'projectcategory.update','This privilege is needed to display the \"Edit\" button for each category and to allow the user to update an existing category.','2025-08-09 01:21:19','2025-08-09 01:21:19'),(184,'projectcategory.delete','This is required to show the \"Add Milestone\" button inside the accordion for each category.','2025-08-09 01:21:52','2025-08-09 01:21:52'),(185,'categorymilestone.create','This is required to show the \"Add Milestone\" button inside the accordion for each category.','2025-08-09 01:22:30','2025-08-09 01:22:30'),(186,'categorymilestone.update',' This privilege enables the \"Edit\" button for each milestone template.','2025-08-09 01:22:56','2025-08-09 01:22:56'),(187,'categorymilestone.delete','This is required to show the \"Delete\" button for each milestone template.','2025-08-09 01:23:20','2025-08-09 01:23:20'),(191,'project.apply_template','project.apply_template','2025-08-09 04:09:17','2025-08-09 04:09:17'),(192,'milestone_attachments.read_all','milestone_attachments.read_all: This is a fundamental privilege that allows a user to fetch and view the list of attachments for a specific milestone.  ','2025-08-09 05:41:50','2025-08-09 05:41:50'),(193,'milestone_attachments.create','milestone_attachments.create','2025-08-09 05:42:08','2025-08-09 05:42:08'),(194,'milestone_attachments.delete','milestone_attachments.delete','2025-08-09 05:42:29','2025-08-09 05:42:29'),(195,'milestone_attachments.update','milestone_attachments.update','2025-08-09 05:44:40','2025-08-09 05:44:40'),(196,'project_photos.read','project_photos.read','2025-08-09 14:27:33','2025-08-09 14:27:33'),(197,'project_photos.create','project_photos.create','2025-08-09 14:27:51','2025-08-09 14:27:51'),(198,'project_photos.delete','project_photos.delete','2025-08-09 14:28:23','2025-08-09 14:28:23'),(199,'project_photos.set_default','project_photos.set_default','2025-08-09 14:28:48','2025-08-09 14:28:48'),(200,'project_monitoring.read','project_monitoring.read','2025-08-09 22:43:56','2025-08-09 22:43:56'),(201,'project_monitoring.create','project_monitoring.create','2025-08-09 22:44:18','2025-08-09 22:44:18'),(202,'project_monitoring.update','project_monitoring.update','2025-08-09 22:44:33','2025-08-09 22:44:33'),(203,'project_monitoring.delete','project_monitoring.delete','2025-08-09 22:44:52','2025-08-09 22:44:52'),(204,'contractor_payments.create',' contractor_payments.create','2025-08-09 23:18:49','2025-08-09 23:18:49'),(205,'contractor_photos.upload',' contractor_photos.upload','2025-08-09 23:19:26','2025-08-09 23:19:26'),(206,'project_monitoring.read_self','project_monitoring.read_self','2025-08-09 23:20:12','2025-08-09 23:20:12'),(207,'contractors.read','contractors.read','2025-08-10 08:16:28','2025-08-10 08:16:28'),(208,'contractors.create','contractors.create','2025-08-10 08:16:44','2025-08-10 08:16:44'),(209,'contractors.update','contractors.update','2025-08-10 08:17:01','2025-08-10 08:17:01'),(210,'contractors.delete','contractors.delete','2025-08-10 08:17:16','2025-08-10 08:17:16'),(211,'projects.assign_contractor','projects.assign_contractor','2025-08-10 21:35:37','2025-08-10 21:35:37'),(212,'project_manager.review','project_manager.review','2025-08-10 22:01:32','2025-08-10 22:01:32'),(213,'project_payments.update','project_payments.update','2025-08-10 22:01:48','2025-08-10 22:01:48'),(214,'contractor_photos.update_status','contractor_photos.update_status','2025-08-10 22:02:04','2025-08-10 22:02:04'),(215,'workplan.read_all','workplan.read_all','2025-08-11 23:32:48','2025-08-11 23:32:48'),(216,'workplan.create','workplan.create','2025-08-11 23:33:07','2025-08-11 23:33:07'),(217,'workplan.update','workplan.update','2025-08-11 23:33:33','2025-08-11 23:33:33'),(218,'workplan.delete','workplan.delete','2025-08-11 23:33:54','2025-08-11 23:33:54'),(219,'activity.read_all','activity.read_all','2025-08-11 23:34:36','2025-08-11 23:34:36'),(220,'activity.create','activity.create','2025-08-11 23:34:51','2025-08-11 23:34:51'),(221,'activity.update','activity.update','2025-08-11 23:35:07','2025-08-11 23:35:07'),(222,'activity.delete','activity.delete','2025-08-11 23:35:21','2025-08-11 23:35:21'),(223,'hr.access','hr.access','2025-08-14 13:47:26','2025-08-14 13:47:26'),(224,'employee.read_all','employee.read_all','2025-08-14 13:47:47','2025-08-14 13:47:47'),(225,'leave.type.read_all','leave.type.read_all','2025-08-14 13:49:14','2025-08-14 13:49:14'),(226,'employee.create','employee.create','2025-08-14 13:49:35','2025-08-14 13:49:35'),(227,'leave.type.create','leave.type.create','2025-08-14 13:49:53','2025-08-14 13:49:53'),(228,'leave.read_all','leave.read_all','2025-08-14 13:50:09','2025-08-14 13:50:09'),(229,'leave.apply','leave.apply','2025-08-14 13:50:25','2025-08-14 13:50:25'),(230,'leave.approve','leave.approve','2025-08-14 13:50:50','2025-08-14 13:50:50'),(231,'leave.complete','leave.complete','2025-08-14 13:51:07','2025-08-14 13:51:07'),(232,'attendance.read_all','attendance.read_all','2025-08-14 13:51:34','2025-08-14 13:51:34'),(233,'attendance.create','attendance.create','2025-08-14 13:51:47','2025-08-14 13:51:47'),(234,'employee.update','employee.update','2025-08-14 20:54:09','2025-08-14 20:54:09'),(235,'employee.delete','employee.delete','2025-08-14 20:54:25','2025-08-14 20:54:25'),(236,'leave.type.update','leave.type.update','2025-08-14 20:54:48','2025-08-14 20:54:48'),(237,'leave.type.delete','leave.type.delete','2025-08-14 20:55:03','2025-08-14 20:55:03'),(238,'leave.update','leave.update','2025-08-15 10:12:55','2025-08-15 10:12:55'),(239,'leave.delete','leave.delete','2025-08-15 10:13:20','2025-08-15 10:13:20'),(240,'employee.read_360','employee.read_360','2025-08-15 10:57:24','2025-08-15 10:57:24'),(242,'employee.performance.create','employee.performance.create','2025-08-15 12:16:50','2025-08-15 12:16:50'),(243,'employee.performance.update','employee.performance.update','2025-08-15 12:23:25','2025-08-15 12:23:25'),(244,'employee.performance.delete','employee.performance.delete','2025-08-15 12:23:40','2025-08-15 12:23:40'),(245,'job_group.read_all','Permission to view all job groups','2025-08-15 16:52:57','2025-08-15 16:52:57'),(246,'job_group.create','Permission to create new job groups','2025-08-15 16:52:57','2025-08-15 16:52:57'),(247,'job_group.update','Permission to update existing job groups','2025-08-15 16:52:57','2025-08-15 16:52:57'),(248,'job_group.delete','Permission to delete job groups','2025-08-15 16:52:57','2025-08-15 16:52:57'),(249,'compensation.read_all','Permission to view all compensation records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(250,'compensation.create','Permission to create new compensation records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(251,'compensation.update','Permission to update existing compensation records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(252,'compensation.delete','Permission to delete compensation records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(253,'training.read_all','Permission to view all employee training records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(254,'training.create','Permission to create new training records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(255,'training.update','Permission to update existing training records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(256,'training.delete','Permission to delete training records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(257,'disciplinary.read_all','Permission to view all employee disciplinary records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(258,'disciplinary.create','Permission to create new disciplinary records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(259,'disciplinary.update','Permission to update existing disciplinary records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(260,'disciplinary.delete','Permission to delete disciplinary records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(261,'contracts.read_all','Permission to view all employee contracts','2025-08-15 16:52:57','2025-08-15 16:52:57'),(262,'contracts.create','Permission to create new employee contracts','2025-08-15 16:52:57','2025-08-15 16:52:57'),(263,'contracts.update','Permission to update existing employee contracts','2025-08-15 16:52:57','2025-08-15 16:52:57'),(264,'contracts.delete','Permission to delete employee contracts','2025-08-15 16:52:57','2025-08-15 16:52:57'),(265,'retirements.read_all','Permission to view all employee retirement records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(266,'retirements.create','Permission to create new retirement records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(267,'retirements.update','Permission to update existing retirement records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(268,'retirements.delete','Permission to delete retirement records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(269,'loans.read_all','Permission to view all employee loan records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(270,'loans.create','Permission to create new loan records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(271,'loans.update','Permission to update existing loan records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(272,'loans.delete','Permission to delete loan records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(273,'payroll.read_all','Permission to view all monthly payroll records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(274,'payroll.create','Permission to create new payroll records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(275,'payroll.update','Permission to update existing payroll records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(276,'payroll.delete','Permission to delete payroll records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(277,'dependants.read_all','Permission to view all employee dependant records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(278,'dependants.create','Permission to create new dependant records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(279,'dependants.update','Permission to update existing dependant records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(280,'dependants.delete','Permission to delete dependant records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(281,'terminations.read_all','Permission to view all employee termination/exit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(282,'terminations.create','Permission to create new termination/exit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(283,'terminations.update','Permission to update existing termination/exit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(284,'terminations.delete','Permission to delete termination/exit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(285,'bank_details.read_all','Permission to view all employee bank details','2025-08-15 16:52:57','2025-08-15 16:52:57'),(286,'bank_details.create','Permission to create new bank details','2025-08-15 16:52:57','2025-08-15 16:52:57'),(287,'bank_details.update','Permission to update existing bank details','2025-08-15 16:52:57','2025-08-15 16:52:57'),(288,'bank_details.delete','Permission to delete bank details','2025-08-15 16:52:57','2025-08-15 16:52:57'),(289,'memberships.read_all','Permission to view all employee membership details','2025-08-15 16:52:57','2025-08-15 16:52:57'),(290,'memberships.create','Permission to create new membership records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(291,'memberships.update','Permission to update existing membership records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(292,'memberships.delete','Permission to delete membership records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(293,'benefits.read_all','Permission to view all employee benefit enrollment records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(294,'benefits.create','Permission to create new benefit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(295,'benefits.update','Permission to update existing benefit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(296,'benefits.delete','Permission to delete benefit records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(297,'assets.read_all','Permission to view all assigned assets','2025-08-15 16:52:57','2025-08-15 16:52:57'),(298,'assets.create','Permission to create new asset assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(299,'assets.update','Permission to update existing asset assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(300,'assets.delete','Permission to delete asset assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(301,'promotion.read_all','Permission to view all employee promotion records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(302,'promotion.create','Permission to create new promotion records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(303,'promotion.update','Permission to update existing promotion records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(304,'promotion.delete','Permission to delete promotion records','2025-08-15 16:52:57','2025-08-15 16:52:57'),(305,'project_assignments.read_all','Permission to view all project assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(306,'project_assignments.create','Permission to create new project assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(307,'project_assignments.update','Permission to update existing project assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(308,'project_assignments.delete','Permission to delete project assignments','2025-08-15 16:52:57','2025-08-15 16:52:57'),(309,'project.assignments.create','project.assignments.create','2025-08-21 13:03:57','2025-08-21 13:03:57'),(310,'project.assignments.update','project.assignments.update','2025-08-21 13:04:23','2025-08-21 13:04:23'),(311,'project.assignments.delete','project.assignments.delete','2025-08-21 13:04:44','2025-08-21 13:04:44'),(312,'leave.entitlement.read','leave.entitlement.read','2025-08-22 11:13:14','2025-08-22 11:13:14'),(313,'leave.entitlement.create','leave.entitlement.create','2025-08-22 11:13:30','2025-08-22 11:13:30'),(314,'leave.entitlement.update','leave.entitlement.update','2025-08-22 11:14:27','2025-08-22 11:14:27'),(315,'leave.entitlement.delete','leave.entitlement.delete','2025-08-22 11:14:57','2025-08-22 11:14:57'),(316,'holiday.read','holiday.read','2025-08-22 12:20:07','2025-08-22 12:20:07'),(317,'holiday.create','holiday.create','2025-08-22 12:20:20','2025-08-22 12:20:20'),(318,'holiday.update','holiday.update','2025-08-22 12:20:34','2025-08-22 12:20:34'),(319,'holiday.delete','holiday.delete','2025-08-22 12:20:51','2025-08-22 12:20:51'),(320,'payment_requests.upload_document','payment_requests.upload_document','2025-08-24 09:25:01','2025-08-24 09:25:01'),(321,'payment_request.read_all','payment_request.read_all','2025-08-24 10:40:45','2025-08-24 10:40:45'),(322,'payment_request.upload_document','payment_request.upload_document','2025-08-24 10:55:02','2025-08-24 10:55:02'),(323,'payment_request.approve','payment_request.approve','2025-08-24 10:55:28','2025-08-24 10:55:28'),(324,'document.read_all','document.read_all','2025-08-24 14:33:40','2025-08-24 14:33:40'),(325,'document.create','document.create','2025-08-24 14:37:33','2025-08-24 14:37:33'),(327,'document.update','document.update','2025-08-24 15:03:06','2025-08-24 15:03:06'),(328,'project.set_cover_photo','project.set_cover_photo','2025-08-24 15:03:23','2025-08-24 15:03:23'),(330,'documents.create','documents.create','2025-08-24 23:21:37','2025-08-24 23:21:37'),(331,'documents.read_all','documents.read_all','2025-08-25 00:25:26','2025-08-25 00:25:26'),(332,'project_stage.read','project_stage.read: Allows a user to view the list of all defined project stages.','2025-08-26 11:27:39','2025-08-26 11:27:39'),(333,'project_stage.create','project_stage.create: Grants the ability to create a new project stage.','2025-08-26 11:28:00','2025-08-26 11:28:00'),(334,'project_stage.update','project_stage.update: Permits a user to edit the details of an existing project stage.','2025-08-26 11:28:19','2025-08-26 11:28:19'),(335,'project_stage.delete','project_stage.delete: Allows a user to delete a project stage.','2025-08-26 11:28:39','2025-08-26 11:28:39'),(336,'project_workflow.read','project_workflow.read: Allows a user to view all project workflows and their steps. This is required for the \"Workflow Management\" navigation link to appear.','2025-08-26 11:29:38','2025-08-26 11:29:38'),(337,'project_workflow.create','project_workflow.create','2025-08-26 11:29:58','2025-08-26 11:29:58'),(338,'project_workflow.update','project_workflow.update','2025-08-26 11:30:19','2025-08-26 11:30:19'),(339,'project_workflow.delete','project_workflow.delete','2025-08-26 11:30:32','2025-08-26 11:30:32'),(340,'payment_details.create','payment_details.create','2025-08-26 11:30:46','2025-08-26 11:30:46'),(341,'payment_details.read','payment_details.read','2025-08-26 11:31:02','2025-08-26 11:31:02'),(342,'payment_request.read','payment_request.read','2025-08-26 12:45:55','2025-08-26 12:45:55'),(343,'approval_levels.read','approval_levels.read','2025-08-26 13:16:43','2025-08-26 13:16:43'),(344,'approval_levels.create','approval_levels.create','2025-08-26 13:16:57','2025-08-26 13:16:57'),(345,'approval_levels.update','approval_levels.update','2025-08-26 13:17:13','2025-08-26 13:17:13'),(346,'approval_levels.delete','approval_levels.delete','2025-08-26 13:17:29','2025-08-26 13:17:29'),(347,'payment_request.update','payment_request.update','2025-08-26 13:23:40','2025-08-26 13:23:40'),(349,'payment_status_definitions.read','payment_status_definitions.read','2025-08-26 21:25:42','2025-08-26 21:25:42'),(350,'payment_status_definitions.create','payment_status_definitions.create','2025-08-26 21:26:04','2025-08-26 21:26:04'),(351,'payment_status_definitions.update','payment_status_definitions.update','2025-08-26 21:26:22','2025-08-26 21:26:22'),(352,'payment_status_definitions.delete','payment_status_definitions.delete','2025-08-26 21:26:38','2025-08-26 21:26:38'),(353,'chat.create_room','Create new chat rooms',NULL,NULL),(354,'chat.join_room','Join existing chat rooms',NULL,NULL),(355,'chat.send_message','Send messages in chat rooms',NULL,NULL),(356,'chat.upload_file','Upload files in chat',NULL,NULL),(357,'chat.moderate','Moderate chat rooms (delete messages, manage participants)',NULL,NULL),(358,'chat.view_all_rooms','View all chat rooms (admin privilege)',NULL,NULL);
/*!40000 ALTER TABLE `kemri_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_programs`
--

DROP TABLE IF EXISTS `kemri_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_programs` (
  `programId` int NOT NULL AUTO_INCREMENT,
  `cidpid` varchar(255) DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `sectionId` int DEFAULT NULL,
  `programme` text,
  `needsPriorities` text,
  `strategies` varchar(255) DEFAULT NULL,
  `remarks` text,
  `objectives` text,
  `outcomes` text,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`programId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_programs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_programs_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=652 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_programs`
--

LOCK TABLES `kemri_programs` WRITE;
/*!40000 ALTER TABLE `kemri_programs` DISABLE KEYS */;
INSERT INTO `kemri_programs` VALUES (1,'39',1,NULL,'Economic Development',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Economic Development'),(2,'39',1,NULL,'Education Enhancement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Education Enhancement'),(3,'39',1,NULL,'Environmental Management',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Environmental Management'),(4,'39',1,NULL,'Financial Management',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Financial Management'),(5,'39',1,NULL,'Food Security Enhancement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Food Security Enhancement'),(6,'39',1,NULL,'Health Services Improvement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Health Services Improvement'),(7,'39',1,NULL,'Infrastructure Development',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Infrastructure Development'),(8,'39',1,NULL,'Social Development',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Social Development'),(9,'39',1,NULL,'Technology Enhancement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Technology Enhancement'),(10,'39',1,NULL,'Water Access Enhancement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-26 14:35:35','2025-09-26 14:53:47',NULL,'Strategic plan program: Water Access Enhancement'),(601,'39',1,2,'Disease Surveillance and Response Program','Early detection and rapid response to infectious disease outbreaks.\ngf','Strengthen surveillance systems; enhance laboratory capacity; improve emergency preparedness.','Aligns with national health security agenda.','To reduce morbidity and mortality from priority diseases.','Timely and effective control of disease outbreaks.',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(602,'39',2,3,'Non-Communicable Diseases Prevention Program','Rising burden of NCDs; need for lifestyle interventions.','Promote healthy lifestyles; improve early screening and diagnosis; strengthen NCD management.','Focus on urban populations.','To reduce the prevalence of major NCD risk factors.','Improved NCD control and reduced premature mortality.',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(603,'39',3,4,'Maternal, Newborn, Child, and Adolescent Health Program','High maternal and child mortality rates; adolescent health challenges.','Improve access to quality MNH services; strengthen community health platforms; address adolescent specific needs.','Integrated approach to MNH.','To reduce preventable maternal and child deaths.','Healthy mothers, children, and adolescents.',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(604,'39',1,1,'Environmental Health and Climate Change Program','Impact of climate change on health; environmental pollution.','Conduct climate-health research; promote climate-resilient health systems; advocate for environmental protection.','Addresses climate vulnerabilities in arid lands.','To mitigate health risks associated with environmental factors.','Resilient communities adapting to climate change impacts.',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(605,'39',1,2,'Health Systems Strengthening Program','Weak health infrastructure; human resource gaps; limited access to services.','Improve health governance; enhance health workforce capacity; strengthen supply chain management.','Community-led health systems.','To build robust and equitable health systems.','Improved access to quality health services.',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(606,'39',3,4,'Key Result Area 1','1 Cooking\n2 Heating\n3 Warming\n4. Helping ohters','Better food\nBetter Life','The young needs us\nthe children needs us most','Eat well\nLive Better','Number of balanced diet meals\nAffordable feeding for school children',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(610,'39',10,8,'Health Services Improvement','Improve access to quality healthcare','Implement primary healthcare programs','Maternal Health Outreach','Reduced maternal mortality; Increased immunization coverage','Focus on community-led initiatives',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(611,'39',11,9,'Education Sector Development','Enhance quality of early childhood education','Construct and equip ECDE centers','ECDE Center Construction','Increased ECDE enrollment; Improved learning outcomes','Partnerships with local communities',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(612,'39',12,10,'Water and Sanitation','Improve access to clean and safe water in rural areas','Drill new boreholes and rehabilitate existing ones','Borehole Drilling Project','Increased household access to piped water; Reduced waterborne diseases','Community participation in water management',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(613,'39',1,1,'testinupdated','resdd','sdsd','sdsds','sds','sdsd',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(614,'39',1,1,'wewe','dddd fff\nfff\nfff','ddd\nYouth','ddd','ddd\nNairobi','dd',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(615,'39',1,1,'ABCD EFG HIJ','123\n456\n789','789\n1011\n1213','','a \nb\nc\nd','',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(616,'39',NULL,NULL,'asana dev tools','as','s','as','asa','as',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(617,'39',NULL,NULL,'sds testing','sdsd',NULL,'lljkll','sskjhkhjkk\n,nm,\n.m,.m,.\njkljkl','sds\ngfdgdf\n\nhjkukh',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(618,'39',NULL,NULL,'Environmental Health and Climate Change Program','sad\n\ndf\n\ndf\ndf','sad\nd\ndf\nd','sad\nd\ndf','sd\ndf\n\ndf','asd\nd\ndf\ndf',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(619,'39',NULL,NULL,'Test pdf','dsd','sds','sad','sd','ds',0,NULL,'2025-08-08 07:30:18','2025-09-26 14:53:47',NULL,NULL),(620,'39',NULL,NULL,'School Infrastructure Improvement Programme','Add schools\nBuild primary schools\nBuild secondary Schools\n','sdsd','sdsd','sds','sdsd',0,NULL,'2025-08-08 23:01:25','2025-09-26 14:53:47',NULL,NULL),(621,'39',NULL,NULL,'sdsds','sds','sds','sdsd','dsd','ds',0,NULL,'2025-08-11 16:52:13','2025-09-26 14:53:47',NULL,NULL),(622,'39',NULL,NULL,'dsds','sdsds','sdsd','sdsd','sds','sdsd',0,NULL,'2025-08-11 18:09:43','2025-09-26 14:53:47',NULL,'ssd'),(623,'39',NULL,NULL,'alpha',NULL,NULL,NULL,NULL,NULL,0,NULL,'2025-08-12 06:45:39','2025-09-26 14:53:47',NULL,'dsadsad'),(624,'39',19,17,'Urban Sanitation & Hygiene','High prevalence of waterborne diseases in informal settlements; inadequate waste management.','Implement community-led sanitation and waste management programs','Focus on public-private partnerships for waste collection services.','Reduced incidence of waterborne diseases; Improved waste disposal rates','A cleaner and healthier urban environment with sustainable waste management.',0,NULL,'2025-08-13 20:12:38','2025-09-26 14:53:47',NULL,NULL),(625,'39',19,18,'Maternal & Child Health','High maternal and infant mortality rates in low-income areas.','Enhance access to quality maternal and child health services','Partnerships with local clinics and NGOs for training and outreach.','Reduced maternal mortality and increased immunization coverage','Healthier mothers and children in underserved communities.',0,NULL,'2025-08-13 20:12:38','2025-09-26 14:53:47',NULL,NULL),(626,'39',20,19,'Waste Management','Inefficient solid waste collection and disposal systems.',NULL,NULL,NULL,NULL,0,NULL,'2025-08-13 20:12:38','2025-09-26 14:53:47',NULL,NULL),(627,'39',1,22,'Program 1','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(628,'39',15,23,'Program 2','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(629,'39',16,24,'Program 3','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(630,'39',14,25,'Program 4','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(631,'39',13,26,'Program 5','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(632,'39',13,27,'Program 6','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(633,'39',16,28,'Program 7','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(634,'39',18,29,'Program 8','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(635,'39',13,30,'Program 9','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(636,'39',11,31,'Program 10','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(637,'39',12,32,'Program 11','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(638,'39',11,33,'Program 12','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(639,'39',15,34,'Program 13','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(640,'39',12,35,'Program 14','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(641,'39',1,36,'Program 15','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(642,'39',1,37,'Program 16','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(643,'39',21,38,'Program 17','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(644,'39',21,39,'Program 18','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(645,'39',12,40,'Program 19','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(646,'39',2,41,'Program 20','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(647,'39',18,42,'Program 21','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(648,'39',1,43,'Program 22','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(649,'39',15,44,'Program 23','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(650,'39',2,45,'Program 24','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL),(651,'39',21,46,'Program 25','High prevalence of diseases; inadequate infrastructure.','Implement community-led programs.','Partnerships with local clinics and NGOs.','Reduced disease incidence; Improved infrastructure.','A healthier urban environment.',NULL,NULL,'2025-08-27 20:06:49','2025-09-26 14:53:47',NULL,NULL);
/*!40000 ALTER TABLE `kemri_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_assignments`
--

DROP TABLE IF EXISTS `kemri_project_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `staffId` int NOT NULL,
  `milestoneName` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `completionDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `kemri_project_assignments_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_project_assignments_ibfk_2` FOREIGN KEY (`staffId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_assignments`
--

LOCK TABLES `kemri_project_assignments` WRITE;
/*!40000 ALTER TABLE `kemri_project_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_climate_risk`
--

DROP TABLE IF EXISTS `kemri_project_climate_risk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_climate_risk` (
  `climateRiskId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `hazardName` varchar(255) NOT NULL,
  `hazardExposure` varchar(50) DEFAULT NULL,
  `vulnerability` varchar(50) DEFAULT NULL,
  `riskLevel` varchar(50) DEFAULT NULL,
  `riskReductionStrategies` text,
  `riskReductionCosts` decimal(15,2) DEFAULT NULL,
  `resourcesRequired` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`climateRiskId`),
  UNIQUE KEY `projectId` (`projectId`,`hazardName`),
  CONSTRAINT `kemri_project_climate_risk_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_climate_risk`
--

LOCK TABLES `kemri_project_climate_risk` WRITE;
/*!40000 ALTER TABLE `kemri_project_climate_risk` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_climate_risk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_concept_notes`
--

DROP TABLE IF EXISTS `kemri_project_concept_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_concept_notes` (
  `conceptNoteId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `situationAnalysis` text,
  `problemStatement` text,
  `relevanceProjectIdea` text,
  `scopeOfProject` text,
  `projectGoal` text,
  `goalIndicator` text,
  `goalMeansVerification` text,
  `goalAssumptions` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`conceptNoteId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_concept_notes_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_concept_notes`
--

LOCK TABLES `kemri_project_concept_notes` WRITE;
/*!40000 ALTER TABLE `kemri_project_concept_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_concept_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_contractor_assignments`
--

DROP TABLE IF EXISTS `kemri_project_contractor_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_contractor_assignments` (
  `projectId` int NOT NULL,
  `contractorId` int NOT NULL,
  `assignmentDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`projectId`,`contractorId`),
  KEY `contractorId` (`contractorId`),
  CONSTRAINT `kemri_project_contractor_assignments_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_project_contractor_assignments_ibfk_2` FOREIGN KEY (`contractorId`) REFERENCES `kemri_contractors` (`contractorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_contractor_assignments`
--

LOCK TABLES `kemri_project_contractor_assignments` WRITE;
/*!40000 ALTER TABLE `kemri_project_contractor_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_contractor_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_counties`
--

DROP TABLE IF EXISTS `kemri_project_counties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_counties` (
  `projectId` int NOT NULL,
  `countyId` int NOT NULL,
  `assignedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`projectId`,`countyId`),
  KEY `fk_project_county_county` (`countyId`),
  CONSTRAINT `fk_project_county_county` FOREIGN KEY (`countyId`) REFERENCES `kemri_counties` (`countyId`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_county_project` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_counties`
--

LOCK TABLES `kemri_project_counties` WRITE;
/*!40000 ALTER TABLE `kemri_project_counties` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_counties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_documents`
--

DROP TABLE IF EXISTS `kemri_project_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `milestoneId` int DEFAULT NULL,
  `requestId` int DEFAULT NULL,
  `documentType` varchar(50) NOT NULL,
  `documentCategory` enum('payment','milestone','general') NOT NULL,
  `documentPath` varchar(255) NOT NULL,
  `description` text,
  `userId` int NOT NULL,
  `isProjectCover` tinyint(1) NOT NULL DEFAULT '0',
  `displayOrder` int DEFAULT NULL,
  `voided` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending_review','in_progress','completed','approved','rejected') NOT NULL DEFAULT 'pending_review',
  `progressPercentage` decimal(5,2) DEFAULT NULL,
  `originalFileName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_documents_projects_idx` (`projectId`),
  KEY `fk_documents_milestones_idx` (`milestoneId`),
  KEY `fk_documents_requests_idx` (`requestId`),
  KEY `fk_documents_users_idx` (`userId`),
  CONSTRAINT `fk_documents_milestones` FOREIGN KEY (`milestoneId`) REFERENCES `kemri_project_milestones` (`milestoneId`) ON DELETE SET NULL,
  CONSTRAINT `fk_documents_projects` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_requests` FOREIGN KEY (`requestId`) REFERENCES `kemri_project_payment_requests` (`requestId`) ON DELETE SET NULL,
  CONSTRAINT `fk_documents_users` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_documents`
--

LOCK TABLES `kemri_project_documents` WRITE;
/*!40000 ALTER TABLE `kemri_project_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_esohsg_screening`
--

DROP TABLE IF EXISTS `kemri_project_esohsg_screening`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_esohsg_screening` (
  `screeningId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `emcaTriggers` tinyint(1) DEFAULT NULL,
  `emcaDescription` text,
  `worldBankSafeguardApplicable` tinyint(1) DEFAULT NULL,
  `worldBankStandards` text,
  `goKPoliciesApplicable` tinyint(1) DEFAULT NULL,
  `goKPoliciesLaws` text,
  `environmentalHealthSafetyImpacts` json DEFAULT NULL,
  `socialImpacts` json DEFAULT NULL,
  `publicParticipationConsultation` json DEFAULT NULL,
  `screeningResultOutcome` text,
  `specialConditions` text,
  `screeningUndertakenBy` varchar(255) DEFAULT NULL,
  `screeningDesignation` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`screeningId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_esohsg_screening_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_esohsg_screening`
--

LOCK TABLES `kemri_project_esohsg_screening` WRITE;
/*!40000 ALTER TABLE `kemri_project_esohsg_screening` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_esohsg_screening` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_financials`
--

DROP TABLE IF EXISTS `kemri_project_financials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_financials` (
  `financialsId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `capitalCostConsultancy` decimal(15,2) DEFAULT NULL,
  `capitalCostLandAcquisition` decimal(15,2) DEFAULT NULL,
  `capitalCostSitePrep` decimal(15,2) DEFAULT NULL,
  `capitalCostConstruction` decimal(15,2) DEFAULT NULL,
  `capitalCostPlantEquipment` decimal(15,2) DEFAULT NULL,
  `capitalCostFixturesFittings` decimal(15,2) DEFAULT NULL,
  `capitalCostOther` decimal(15,2) DEFAULT NULL,
  `recurrentCostLabor` decimal(15,2) DEFAULT NULL,
  `recurrentCostOperating` decimal(15,2) DEFAULT NULL,
  `recurrentCostMaintenance` decimal(15,2) DEFAULT NULL,
  `recurrentCostOther` decimal(15,2) DEFAULT NULL,
  `proposedSourceFinancing` varchar(255) DEFAULT NULL,
  `costImplicationsRelatedProjects` text,
  `landExpropriationRequired` tinyint(1) DEFAULT NULL,
  `landExpropriationExpenses` decimal(15,2) DEFAULT NULL,
  `compensationRequired` tinyint(1) DEFAULT NULL,
  `otherAttendantCosts` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`financialsId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_financials_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_financials`
--

LOCK TABLES `kemri_project_financials` WRITE;
/*!40000 ALTER TABLE `kemri_project_financials` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_financials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_fy_breakdown`
--

DROP TABLE IF EXISTS `kemri_project_fy_breakdown`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_fy_breakdown` (
  `fyBreakdownId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `financialYear` varchar(20) NOT NULL,
  `totalCost` decimal(15,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`fyBreakdownId`),
  UNIQUE KEY `projectId` (`projectId`,`financialYear`),
  CONSTRAINT `kemri_project_fy_breakdown_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_fy_breakdown`
--

LOCK TABLES `kemri_project_fy_breakdown` WRITE;
/*!40000 ALTER TABLE `kemri_project_fy_breakdown` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_fy_breakdown` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_hazard_assessment`
--

DROP TABLE IF EXISTS `kemri_project_hazard_assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_hazard_assessment` (
  `hazardId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `hazardName` varchar(255) NOT NULL,
  `question` text,
  `answerYesNo` tinyint(1) DEFAULT NULL,
  `remarks` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`hazardId`),
  UNIQUE KEY `projectId` (`projectId`,`hazardName`),
  CONSTRAINT `kemri_project_hazard_assessment_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_hazard_assessment`
--

LOCK TABLES `kemri_project_hazard_assessment` WRITE;
/*!40000 ALTER TABLE `kemri_project_hazard_assessment` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_hazard_assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_implementation_plan`
--

DROP TABLE IF EXISTS `kemri_project_implementation_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_implementation_plan` (
  `planId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `description` text,
  `keyPerformanceIndicators` text,
  `responsiblePersons` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`planId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_implementation_plan_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_implementation_plan`
--

LOCK TABLES `kemri_project_implementation_plan` WRITE;
/*!40000 ALTER TABLE `kemri_project_implementation_plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_implementation_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_m_and_e`
--

DROP TABLE IF EXISTS `kemri_project_m_and_e`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_m_and_e` (
  `mAndEId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `description` text,
  `mechanismsInPlace` text,
  `resourcesBudgetary` text,
  `resourcesHuman` text,
  `dataGatheringMethod` text,
  `reportingChannels` text,
  `lessonsLearnedProcess` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`mAndEId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_m_and_e_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_m_and_e`
--

LOCK TABLES `kemri_project_m_and_e` WRITE;
/*!40000 ALTER TABLE `kemri_project_m_and_e` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_m_and_e` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_maps`
--

DROP TABLE IF EXISTS `kemri_project_maps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_maps` (
  `mapId` int NOT NULL AUTO_INCREMENT,
  `projectId` int DEFAULT NULL,
  `map` text,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mapId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_maps`
--

LOCK TABLES `kemri_project_maps` WRITE;
/*!40000 ALTER TABLE `kemri_project_maps` DISABLE KEYS */;
INSERT INTO `kemri_project_maps` VALUES (6,6,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Maternal Child Health Program - Pastoralist Routes\" }, \"geometry\": { \"type\": \"LineString\", \"coordinates\": [ [35.5000, 2.0000], [36.0000, 2.5000], [37.0000, 3.0000], [38.0000, 2.5000] ] } } ] }',0,NULL),(7,7,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Zoonotic Spillover Risk Zones - Turkana/Marsabit\" }, \"geometry\": { \"type\": \"MultiPolygon\", \"coordinates\": [ [ [ [35.5000, 3.0000], [35.7000, 3.0000], [35.7000, 3.2000], [35.5000, 3.2000], [35.5000, 3.0000] ] ], [ [ [37.9000, 2.3000], [38.1000, 2.3000], [38.1000, 2.5000], [37.9000, 2.5000], [37.9000, 2.3000] ] ] ] } } ] }',0,NULL),(8,8,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Cold Chain Optimization Pilot Areas - Nairobi/Rural Hubs\" }, \"geometry\": { \"type\": \"MultiPoint\", \"coordinates\": [ [36.8219, -1.2921], [34.7617, -0.1022], [39.6682, -4.0437] ] } } ] }',0,NULL),(9,9,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"AMR Surveillance National Network\" }, \"geometry\": { \"type\": \"LineString\", \"coordinates\": [ [34.0, 4.0], [42.0, 4.0], [42.0, -4.0], [34.0, -4.0] ] } } ] }',0,NULL),(10,10,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Adolescent Mental Health Study - Post-Conflict Zones\" }, \"geometry\": { \"type\": \"Point\", \"coordinates\": [34.7617, -0.1022] } } ] }',0,NULL),(11,11,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"AI TB Diagnostic Development - Central Lab\" }, \"geometry\": { \"type\": \"Point\", \"coordinates\": [36.8219, -1.2921] } } ] }',0,NULL),(12,12,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Stunting Reduction Intervention Zones - Mombasa\" }, \"geometry\": { \"type\": \"Polygon\", \"coordinates\": [ [ [39.6500, -4.0600], [39.6800, -4.0600], [39.6800, -4.0200], [39.6500, -4.0200], [39.6500, -4.0600] ] ] } } ] }',0,NULL),(13,13,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"HIV Self-Testing Outreach Areas\" }, \"geometry\": { \"type\": \"MultiPoint\", \"coordinates\": [ [34.7617, -0.1022], [36.8219, -1.2921], [39.6682, -4.0437] ] } } ] }',0,NULL),(14,14,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Dengue Vaccine Pre-Clinical Lab\" }, \"geometry\": { \"type\": \"Point\", \"coordinates\": [36.8219, -1.2921] } } ] }',0,NULL),(15,15,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"STI POC Diagnostics Pilot Sites\" }, \"geometry\": { \"type\": \"MultiPoint\", \"coordinates\": [ [39.6682, -4.0437], [34.7617, -0.1022], [36.8219, -1.2921] ] } } ] }',0,NULL),(16,16,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Border Region Health Systems Strengthening\" }, \"geometry\": { \"type\": \"Polygon\", \"coordinates\": [ [ [34.0000, 3.0000], [35.0000, 3.0000], [35.0000, 4.0000], [34.0000, 4.0000], [34.0000, 3.0000] ] ] } } ] }',0,NULL),(17,17,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"HIV-1 Genetic Diversity Study Sites\" }, \"geometry\": { \"type\": \"MultiPoint\", \"coordinates\": [ [39.6450, -0.4560], [36.8219, -1.2921], [34.7617, -0.1022] ] } } ] }',0,NULL),(18,18,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Rural Indoor Air Pollution Monitoring Sites\" }, \"geometry\": { \"type\": \"MultiPoint\", \"coordinates\": [ [34.7617, -0.1022], [35.3000, -0.0500] ] } } ] }',0,NULL),(19,19,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"National Health Research Prioritization Central Location\" }, \"geometry\": { \"type\": \"Point\", \"coordinates\": [36.8219, -1.2921] } } ] }',0,NULL),(20,20,'{ \"type\": \"FeatureCollection\", \"features\": [ { \"type\": \"Feature\", \"properties\": { \"name\": \"Buruli Ulcer Epidemiology Study Area - Western Kenya\" }, \"geometry\": { \"type\": \"Polygon\", \"coordinates\": [ [ [34.0000, -0.5000], [34.5000, -0.5000], [34.5000, 0.0000], [34.0000, 0.0000], [34.0000, -0.5000] ] ] } } ] }',0,NULL),(23,2,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.7579,-0.0917]}}]}',0,NULL),(29,5,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.795904,-0.086472]}}]}',0,NULL),(30,4,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Multi-Point Feature\"},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[34.761191,-0.10257],[34.763981,-0.104458],[34.765869,-0.105574],[34.7678,-0.106003],[34.769517,-0.105917],[34.771019,-0.106003],[34.772178,-0.10566],[34.772993,-0.105102],[34.773808,-0.104415],[34.774409,-0.102742],[34.774967,-0.100596],[34.774624,-0.098879],[34.769454,-0.098147],[34.766684,-0.097863],[34.764796,-0.098078],[34.763251,-0.098721],[34.762178,-0.099365],[34.761663,-0.100352],[34.76162,-0.101125],[34.761363,-0.101682],[34.76102,-0.102412],[34.761234,-0.102841]]}}]}',0,NULL),(33,38,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.785322,-0.09022]}}]}',0,NULL),(34,40,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Multi-Point Feature\"},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[34.785751,-0.08919],[34.78618,-0.086314],[34.785193,-0.084726],[34.783433,-0.085156],[34.779957,-0.08537],[34.77824,-0.085585],[34.776438,-0.086615],[34.776223,-0.087645],[34.775751,-0.08876],[34.774893,-0.089275],[34.771202,-0.090177],[34.772673,-0.090938]]}}]}',0,NULL),(35,41,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.779099,-0.087258]}}]}',0,NULL),(36,1,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.785043,-0.096721]}}]}',0,NULL),(37,3,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Multi-Point Feature\"},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[34.770134,-0.092215],[34.773224,-0.092516],[34.775971,-0.092945],[34.78288,-0.093546],[34.786185,-0.089683],[34.788974,-0.086979],[34.779747,-0.085778],[34.776271,-0.087022],[34.775671,-0.087967],[34.770435,-0.092129]]}}]}',0,NULL),(38,2,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.77043,-0.094683]}}]}',0,NULL),(39,1,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[36.8219,-1.2921]}}]}',0,NULL),(40,2,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.7579,-0.0917]}}]}',0,NULL),(41,3,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[36.8219,-1.2921]}}]}',0,NULL),(42,4,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[35.5975,3.1118]}}]}',0,NULL),(43,5,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[39.66,-4.05]}}]}',0,NULL),(44,28,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Location\"},\"geometry\":{\"type\":\"Point\",\"coordinates\":[34.765623,-0.117215]}}]}',0,NULL),(45,28,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Multi-Point Feature\"},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[34.74983,-0.111207],[34.752877,-0.111207],[34.756954,-0.111207],[34.769485,-0.111636],[34.764304,-0.112138],[34.772458,-0.111369],[34.771685,-0.113429],[34.763648,-0.115908]]}}]}',0,NULL),(46,39,'{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"name\":\"Imported Multi-Point Feature\"},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[34.7694,-0.095456],[34.771202,-0.096529],[34.774764,-0.097044],[34.77661,-0.09743],[34.77824,-0.09816],[34.779871,-0.099233],[34.784249,-0.098847],[34.787178,-0.098534],[34.800986,-0.096093]]}}]}',NULL,NULL);
/*!40000 ALTER TABLE `kemri_project_maps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_milestone_implementations`
--

DROP TABLE IF EXISTS `kemri_project_milestone_implementations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_milestone_implementations` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) NOT NULL,
  `description` text,
  `userId` int DEFAULT NULL,
  `voided` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `categoryName` (`categoryName`),
  KEY `userId` (`userId`),
  CONSTRAINT `kemri_project_milestone_implementations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_milestone_implementations`
--

LOCK TABLES `kemri_project_milestone_implementations` WRITE;
/*!40000 ALTER TABLE `kemri_project_milestone_implementations` DISABLE KEYS */;
INSERT INTO `kemri_project_milestone_implementations` VALUES (1,'Construction of a School','dd',1,0,'2025-08-08 22:26:52','2025-08-08 22:30:03'),(2,'Road Works','ds',1,0,'2025-08-12 11:22:13','2025-08-12 12:46:14'),(3,'Health Survey','Health Survey',1,0,'2025-08-12 11:27:31','2025-08-12 12:59:46'),(4,'Alpha Yes','',1,0,'2025-08-13 19:20:33','2025-08-13 19:20:33'),(5,'Urban Infrastructure',NULL,NULL,0,'2025-08-13 20:47:52','2025-08-13 20:47:52'),(6,'Public Health Initiative',NULL,NULL,0,'2025-08-13 20:47:52','2025-08-13 20:47:52'),(7,'Waste Management',NULL,NULL,0,'2025-08-13 20:47:52','2025-08-13 20:47:52'),(8,'Sanitation',NULL,NULL,0,'2025-08-27 20:06:49','2025-08-27 20:06:49'),(9,'Infrastructure',NULL,NULL,0,'2025-08-27 20:06:49','2025-08-27 20:06:49'),(10,'Education',NULL,NULL,0,'2025-08-27 20:06:49','2025-08-27 20:06:49'),(11,'Economic Empowerment',NULL,NULL,0,'2025-08-27 20:06:49','2025-08-27 20:06:49');
/*!40000 ALTER TABLE `kemri_project_milestone_implementations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_milestones`
--

DROP TABLE IF EXISTS `kemri_project_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_milestones` (
  `milestoneId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `milestoneName` varchar(255) NOT NULL,
  `description` text,
  `dueDate` date DEFAULT NULL,
  `sequenceOrder` int DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Not Started',
  `completed` tinyint(1) DEFAULT '0',
  `completedDate` date DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  `voidedBy` int DEFAULT NULL,
  `progress` decimal(5,2) DEFAULT '0.00',
  `weight` decimal(5,2) DEFAULT '1.00',
  PRIMARY KEY (`milestoneId`),
  KEY `projectId` (`projectId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_project_milestones_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kemri_project_milestones_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_project_milestones_ibfk_3` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_project_milestones_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_project_milestones_ibfk_5` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_milestones`
--

LOCK TABLES `kemri_project_milestones` WRITE;
/*!40000 ALTER TABLE `kemri_project_milestones` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_monitoring_records`
--

DROP TABLE IF EXISTS `kemri_project_monitoring_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_monitoring_records` (
  `recordId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `observationDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text,
  `warningLevel` varchar(20) DEFAULT 'None',
  `isRoutineObservation` tinyint(1) DEFAULT '1',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `recommendations` text,
  `challenges` text,
  PRIMARY KEY (`recordId`),
  KEY `projectId` (`projectId`),
  KEY `userId` (`userId`),
  CONSTRAINT `kemri_project_monitoring_records_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_project_monitoring_records_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_monitoring_records`
--

LOCK TABLES `kemri_project_monitoring_records` WRITE;
/*!40000 ALTER TABLE `kemri_project_monitoring_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_monitoring_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_needs_assessment`
--

DROP TABLE IF EXISTS `kemri_project_needs_assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_needs_assessment` (
  `needsAssessmentId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `targetBeneficiaries` text,
  `estimateEndUsers` text,
  `physicalDemandCompletion` text,
  `proposedPhysicalCapacity` text,
  `mainBenefitsAsset` text,
  `significantExternalBenefitsNegativeEffects` text,
  `significantDifferencesBenefitsAlternatives` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`needsAssessmentId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_needs_assessment_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_needs_assessment`
--

LOCK TABLES `kemri_project_needs_assessment` WRITE;
/*!40000 ALTER TABLE `kemri_project_needs_assessment` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_needs_assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_payment_requests`
--

DROP TABLE IF EXISTS `kemri_project_payment_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_payment_requests` (
  `requestId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `contractorId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `currentApprovalLevelId` int DEFAULT NULL,
  `paymentStatusId` int DEFAULT NULL,
  `submittedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  `approvedByUserId` int DEFAULT NULL,
  `approvalDate` timestamp NULL DEFAULT NULL,
  `rejectionReason` text,
  `comments` text,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`requestId`),
  KEY `projectId` (`projectId`),
  KEY `contractorId` (`contractorId`),
  KEY `fk_payment_request_approval_level` (`currentApprovalLevelId`),
  KEY `fk_payment_request_status` (`paymentStatusId`),
  CONSTRAINT `fk_payment_request_approval_level` FOREIGN KEY (`currentApprovalLevelId`) REFERENCES `kemri_payment_approval_levels` (`levelId`),
  CONSTRAINT `fk_payment_request_status` FOREIGN KEY (`paymentStatusId`) REFERENCES `kemri_payment_status_definitions` (`statusId`),
  CONSTRAINT `kemri_project_payment_requests_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_project_payment_requests_ibfk_2` FOREIGN KEY (`contractorId`) REFERENCES `kemri_contractors` (`contractorId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_payment_requests`
--

LOCK TABLES `kemri_project_payment_requests` WRITE;
/*!40000 ALTER TABLE `kemri_project_payment_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_payment_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_photos`
--

DROP TABLE IF EXISTS `kemri_project_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_photos` (
  `photoId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `fileSize` int DEFAULT NULL,
  `description` text,
  `isDefault` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) DEFAULT '0',
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`photoId`),
  KEY `projectId` (`projectId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_project_photos_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`),
  CONSTRAINT `kemri_project_photos_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_project_photos_ibfk_3` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_photos`
--

LOCK TABLES `kemri_project_photos` WRITE;
/*!40000 ALTER TABLE `kemri_project_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_readiness`
--

DROP TABLE IF EXISTS `kemri_project_readiness`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_readiness` (
  `readinessId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `designsPreparedApproved` tinyint(1) DEFAULT NULL,
  `landAcquiredSiteReady` tinyint(1) DEFAULT NULL,
  `regulatoryApprovalsObtained` tinyint(1) DEFAULT NULL,
  `governmentAgenciesInvolved` text,
  `consultationsUndertaken` tinyint(1) DEFAULT NULL,
  `canBePhasedScaledDown` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`readinessId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_readiness_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_readiness`
--

LOCK TABLES `kemri_project_readiness` WRITE;
/*!40000 ALTER TABLE `kemri_project_readiness` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_readiness` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_risks`
--

DROP TABLE IF EXISTS `kemri_project_risks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_risks` (
  `riskId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `riskDescription` text,
  `likelihood` varchar(50) DEFAULT NULL,
  `impact` varchar(50) DEFAULT NULL,
  `mitigationStrategy` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`riskId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_risks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_risks`
--

LOCK TABLES `kemri_project_risks` WRITE;
/*!40000 ALTER TABLE `kemri_project_risks` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_risks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_roles`
--

DROP TABLE IF EXISTS `kemri_project_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_roles`
--

LOCK TABLES `kemri_project_roles` WRITE;
/*!40000 ALTER TABLE `kemri_project_roles` DISABLE KEYS */;
INSERT INTO `kemri_project_roles` VALUES (1,'Principal Investigator','Overall lead of the project, responsible for scientific and administrative oversight.'),(2,'Co-Investigator','Collaborates with the PI on the scientific aspects of the project.'),(3,'Project Manager','Responsible for day-to-day project operations, scheduling, and resources.'),(4,'Research Assistant','Assists with data collection, lab work, and other research tasks.'),(5,'Data Manager','Manages project data, ensuring quality, security, and accessibility.'),(6,'Statistician','Provides statistical expertise for study design and data analysis.'),(7,'Lab Lead','Oversees laboratory activities related to the project.'),(8,'Field Coordinator','Manages field operations and community engagement.'),(9,'Administrator','Handles administrative and logistical support for the project.'),(10,'Principal Investigator','Overall lead of the project, responsible for scientific and administrative oversight.'),(11,'Co-Investigator','Collaborates with the PI on the scientific aspects of the project.'),(12,'Project Manager','Responsible for day-to-day project operations, scheduling, and resources.'),(13,'Research Assistant','Assists with data collection, lab work, and other research tasks.'),(14,'Data Manager','Manages project data, ensuring quality, security, and accessibility.'),(15,'Statistician','Provides statistical expertise for study design and data analysis.'),(16,'Lab Lead','Oversees laboratory activities related to the project.'),(17,'Field Coordinator','Manages field operations and community engagement.'),(18,'Administrator','Handles administrative and logistical support for the project.'),(25,'Principal Investigator','Overall lead of the project, responsible for scientific and administrative oversight.'),(26,'Co-Investigator','Collaborates with the PI on the scientific aspects of the project.'),(27,'Project Manager','Responsible for day-to-day project operations, scheduling, and resources.'),(28,'Research Assistant','Assists with data collection, lab work, and other research tasks.'),(29,'Data Manager','Manages project data, ensuring quality, security, and accessibility.'),(30,'Statistician','Provides statistical expertise for study design and data analysis.'),(31,'Lab Lead','Oversees laboratory activities related to the project.'),(32,'Field Coordinator','Manages field operations and community engagement.'),(33,'Administrator','Handles administrative and logistical support for the project.');
/*!40000 ALTER TABLE `kemri_project_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_staff_assignments`
--

DROP TABLE IF EXISTS `kemri_project_staff_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_staff_assignments` (
  `assignmentId` int NOT NULL AUTO_INCREMENT,
  `projectId` int DEFAULT NULL,
  `staffId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`assignmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_staff_assignments`
--

LOCK TABLES `kemri_project_staff_assignments` WRITE;
/*!40000 ALTER TABLE `kemri_project_staff_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_staff_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_stages`
--

DROP TABLE IF EXISTS `kemri_project_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_stages` (
  `stageId` int NOT NULL AUTO_INCREMENT,
  `stageName` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`stageId`),
  UNIQUE KEY `stageName` (`stageName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_stages`
--

LOCK TABLES `kemri_project_stages` WRITE;
/*!40000 ALTER TABLE `kemri_project_stages` DISABLE KEYS */;
INSERT INTO `kemri_project_stages` VALUES (1,'Proposal','Proposed'),(2,'Pipeline','Piplined'),(3,'Contracted','Contracted'),(4,'Implemented','dd');
/*!40000 ALTER TABLE `kemri_project_stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_stakeholders`
--

DROP TABLE IF EXISTS `kemri_project_stakeholders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_stakeholders` (
  `stakeholderId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `stakeholderName` varchar(255) DEFAULT NULL,
  `levelInfluence` varchar(50) DEFAULT NULL,
  `engagementStrategy` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`stakeholderId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_stakeholders_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_stakeholders`
--

LOCK TABLES `kemri_project_stakeholders` WRITE;
/*!40000 ALTER TABLE `kemri_project_stakeholders` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_stakeholders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_subcounties`
--

DROP TABLE IF EXISTS `kemri_project_subcounties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_subcounties` (
  `projectId` int NOT NULL,
  `subcountyId` int NOT NULL,
  `assignedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`projectId`,`subcountyId`),
  KEY `fk_project_subcounty_subcounty` (`subcountyId`),
  CONSTRAINT `fk_project_subcounty_project` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_subcounty_subcounty` FOREIGN KEY (`subcountyId`) REFERENCES `kemri_subcounties` (`subcountyId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_subcounties`
--

LOCK TABLES `kemri_project_subcounties` WRITE;
/*!40000 ALTER TABLE `kemri_project_subcounties` DISABLE KEYS */;
INSERT INTO `kemri_project_subcounties` VALUES (176,3,'2025-10-15 05:12:57',0),(177,3,'2025-10-15 05:12:57',0),(178,1,'2025-10-15 05:13:39',0),(180,1,'2025-10-15 05:13:39',0),(181,7,'2025-10-15 05:13:39',0),(182,7,'2025-10-15 05:13:39',0),(183,1,'2025-10-15 06:09:46',0),(184,1,'2025-10-15 06:09:46',0),(185,1,'2025-10-15 06:09:46',0),(186,1,'2025-10-15 06:09:46',0),(187,1,'2025-10-15 06:09:46',0),(188,1,'2025-10-15 06:09:46',0),(189,1,'2025-10-15 06:09:46',0),(190,1,'2025-10-15 06:09:46',0),(191,1,'2025-10-15 06:09:46',0),(192,1,'2025-10-15 06:09:46',0),(193,1,'2025-10-15 06:09:46',0),(194,1,'2025-10-15 06:09:46',0),(195,1,'2025-10-15 06:09:46',0),(196,1,'2025-10-15 06:09:46',0),(197,1,'2025-10-15 06:09:46',0),(198,7,'2025-10-15 06:09:46',0),(199,7,'2025-10-15 06:09:46',0),(200,7,'2025-10-15 06:09:46',0),(201,7,'2025-10-15 06:09:46',0),(202,7,'2025-10-15 06:09:46',0),(203,7,'2025-10-15 06:09:46',0),(204,7,'2025-10-15 06:09:46',0),(205,7,'2025-10-15 06:09:46',0),(206,7,'2025-10-15 06:09:46',0),(207,7,'2025-10-15 06:09:46',0),(208,7,'2025-10-15 06:09:46',0),(209,7,'2025-10-15 06:09:46',0),(210,7,'2025-10-15 06:09:46',0),(211,7,'2025-10-15 06:09:46',0),(212,7,'2025-10-15 06:09:46',0),(213,7,'2025-10-15 06:09:46',0),(214,7,'2025-10-15 06:09:46',0),(215,7,'2025-10-15 06:09:46',0),(216,7,'2025-10-15 06:09:46',0),(217,7,'2025-10-15 06:09:46',0),(218,7,'2025-10-15 06:09:46',0),(219,7,'2025-10-15 06:09:46',0),(220,7,'2025-10-15 06:09:46',0),(221,7,'2025-10-15 06:09:46',0),(222,7,'2025-10-15 06:09:46',0),(223,7,'2025-10-15 06:09:46',0),(224,7,'2025-10-15 06:09:46',0),(225,7,'2025-10-15 06:09:46',0),(226,7,'2025-10-15 06:09:46',0),(227,7,'2025-10-15 06:09:46',0),(228,7,'2025-10-15 06:09:46',0),(229,7,'2025-10-15 06:09:46',0),(230,7,'2025-10-15 06:09:46',0),(231,7,'2025-10-15 06:09:46',0),(232,7,'2025-10-15 06:09:46',0),(233,7,'2025-10-15 06:09:46',0),(234,7,'2025-10-15 06:09:46',0),(235,7,'2025-10-15 06:09:46',0),(236,7,'2025-10-15 06:09:46',0);
/*!40000 ALTER TABLE `kemri_project_subcounties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_sustainability`
--

DROP TABLE IF EXISTS `kemri_project_sustainability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_sustainability` (
  `sustainabilityId` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `description` text,
  `owningOrganization` varchar(255) DEFAULT NULL,
  `hasAssetRegister` tinyint(1) DEFAULT NULL,
  `technicalCapacityAdequacy` text,
  `managerialCapacityAdequacy` text,
  `financialCapacityAdequacy` text,
  `avgAnnualPersonnelCost` decimal(15,2) DEFAULT NULL,
  `annualOperationMaintenanceCost` decimal(15,2) DEFAULT NULL,
  `otherOperatingCosts` decimal(15,2) DEFAULT NULL,
  `revenueSources` text,
  `operationalCostsCoveredByRevenue` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`sustainabilityId`),
  UNIQUE KEY `projectId` (`projectId`),
  CONSTRAINT `kemri_project_sustainability_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_sustainability`
--

LOCK TABLES `kemri_project_sustainability` WRITE;
/*!40000 ALTER TABLE `kemri_project_sustainability` DISABLE KEYS */;
/*!40000 ALTER TABLE `kemri_project_sustainability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_wards`
--

DROP TABLE IF EXISTS `kemri_project_wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_wards` (
  `projectId` int NOT NULL,
  `wardId` int NOT NULL,
  `assignedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`projectId`,`wardId`),
  KEY `fk_project_ward_ward` (`wardId`),
  CONSTRAINT `fk_project_ward_project` FOREIGN KEY (`projectId`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_ward_ward` FOREIGN KEY (`wardId`) REFERENCES `kemri_wards` (`wardId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_wards`
--

LOCK TABLES `kemri_project_wards` WRITE;
/*!40000 ALTER TABLE `kemri_project_wards` DISABLE KEYS */;
INSERT INTO `kemri_project_wards` VALUES (176,2,'2025-10-15 05:12:57',0),(177,2,'2025-10-15 05:12:57',0),(178,1,'2025-10-15 05:13:39',0),(180,1,'2025-10-15 05:13:39',0),(181,8,'2025-10-15 05:13:39',0),(182,19,'2025-10-15 05:13:39',0),(183,1,'2025-10-15 06:09:46',0),(184,1,'2025-10-15 06:09:46',0),(185,1,'2025-10-15 06:09:46',0),(186,1,'2025-10-15 06:09:46',0),(187,1,'2025-10-15 06:09:46',0),(188,1,'2025-10-15 06:09:46',0),(189,1,'2025-10-15 06:09:46',0),(190,1,'2025-10-15 06:09:46',0),(191,1,'2025-10-15 06:09:46',0),(192,1,'2025-10-15 06:09:46',0),(193,1,'2025-10-15 06:09:46',0),(194,1,'2025-10-15 06:09:46',0),(195,1,'2025-10-15 06:09:46',0),(196,1,'2025-10-15 06:09:46',0),(197,1,'2025-10-15 06:09:46',0),(198,19,'2025-10-15 06:09:46',0),(199,19,'2025-10-15 06:09:46',0),(200,19,'2025-10-15 06:09:46',0),(201,19,'2025-10-15 06:09:46',0),(202,19,'2025-10-15 06:09:46',0),(203,19,'2025-10-15 06:09:46',0),(204,19,'2025-10-15 06:09:46',0),(205,19,'2025-10-15 06:09:46',0),(206,19,'2025-10-15 06:09:46',0),(207,19,'2025-10-15 06:09:46',0),(208,19,'2025-10-15 06:09:46',0),(209,19,'2025-10-15 06:09:46',0),(210,19,'2025-10-15 06:09:46',0),(211,19,'2025-10-15 06:09:46',0),(212,19,'2025-10-15 06:09:46',0),(213,19,'2025-10-15 06:09:46',0),(214,19,'2025-10-15 06:09:46',0),(215,19,'2025-10-15 06:09:46',0),(216,19,'2025-10-15 06:09:46',0),(217,19,'2025-10-15 06:09:46',0),(218,19,'2025-10-15 06:09:46',0),(219,19,'2025-10-15 06:09:46',0),(220,19,'2025-10-15 06:09:46',0),(221,8,'2025-10-15 06:09:46',0),(222,19,'2025-10-15 06:09:46',0),(223,19,'2025-10-15 06:09:46',0),(224,19,'2025-10-15 06:09:46',0),(225,19,'2025-10-15 06:09:46',0),(226,19,'2025-10-15 06:09:46',0),(227,8,'2025-10-15 06:09:46',0),(228,19,'2025-10-15 06:09:46',0),(229,19,'2025-10-15 06:09:46',0),(230,19,'2025-10-15 06:09:46',0),(231,19,'2025-10-15 06:09:46',0),(232,19,'2025-10-15 06:09:46',0),(233,19,'2025-10-15 06:09:46',0),(234,19,'2025-10-15 06:09:46',0),(235,19,'2025-10-15 06:09:46',0),(236,19,'2025-10-15 06:09:46',0);
/*!40000 ALTER TABLE `kemri_project_wards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_workflow_steps`
--

DROP TABLE IF EXISTS `kemri_project_workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_workflow_steps` (
  `stepId` int NOT NULL AUTO_INCREMENT,
  `workflowId` int NOT NULL,
  `stageId` int NOT NULL,
  `stepOrder` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint NOT NULL DEFAULT '0',
  `createdByUserId` int DEFAULT NULL,
  `voidedByUserId` int DEFAULT NULL,
  PRIMARY KEY (`stepId`),
  KEY `workflowId` (`workflowId`),
  KEY `stageId` (`stageId`),
  KEY `createdByUserId` (`createdByUserId`),
  KEY `voidedByUserId` (`voidedByUserId`),
  CONSTRAINT `kemri_project_workflow_steps_ibfk_1` FOREIGN KEY (`workflowId`) REFERENCES `kemri_project_workflows` (`workflowId`),
  CONSTRAINT `kemri_project_workflow_steps_ibfk_2` FOREIGN KEY (`stageId`) REFERENCES `kemri_project_stages` (`stageId`),
  CONSTRAINT `kemri_project_workflow_steps_ibfk_3` FOREIGN KEY (`createdByUserId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_project_workflow_steps_ibfk_4` FOREIGN KEY (`voidedByUserId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_workflow_steps`
--

LOCK TABLES `kemri_project_workflow_steps` WRITE;
/*!40000 ALTER TABLE `kemri_project_workflow_steps` DISABLE KEYS */;
INSERT INTO `kemri_project_workflow_steps` VALUES (1,1,1,1,'2025-08-26 09:30:28','2025-08-26 09:30:28',0,NULL,NULL),(2,1,3,2,'2025-08-26 09:30:33','2025-08-26 09:30:33',0,NULL,NULL),(3,1,4,3,'2025-08-26 09:30:42','2025-08-26 09:30:42',0,NULL,NULL);
/*!40000 ALTER TABLE `kemri_project_workflow_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_project_workflows`
--

DROP TABLE IF EXISTS `kemri_project_workflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_project_workflows` (
  `workflowId` int NOT NULL AUTO_INCREMENT,
  `workflowName` varchar(255) NOT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint NOT NULL DEFAULT '0',
  `createdByUserId` int DEFAULT NULL,
  `voidedByUserId` int DEFAULT NULL,
  PRIMARY KEY (`workflowId`),
  UNIQUE KEY `workflowName` (`workflowName`),
  KEY `createdByUserId` (`createdByUserId`),
  KEY `voidedByUserId` (`voidedByUserId`),
  CONSTRAINT `kemri_project_workflows_ibfk_1` FOREIGN KEY (`createdByUserId`) REFERENCES `kemri_users` (`userId`),
  CONSTRAINT `kemri_project_workflows_ibfk_2` FOREIGN KEY (`voidedByUserId`) REFERENCES `kemri_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_project_workflows`
--

LOCK TABLES `kemri_project_workflows` WRITE;
/*!40000 ALTER TABLE `kemri_project_workflows` DISABLE KEYS */;
INSERT INTO `kemri_project_workflows` VALUES (1,'Standard Project Work Flow','sdsd','2025-08-26 09:25:27','2025-08-26 09:31:12',0,2,NULL);
/*!40000 ALTER TABLE `kemri_project_workflows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_projectfeedback`
--

DROP TABLE IF EXISTS `kemri_projectfeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_projectfeedback` (
  `feedbackId` int NOT NULL AUTO_INCREMENT,
  `projectId` int DEFAULT NULL,
  `feedbackMessage` text,
  `response` varchar(255) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `voidedAt` datetime DEFAULT NULL,
  `voidingReason` varchar(255) DEFAULT NULL,
  `submittedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`feedbackId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_projectfeedback`
--

LOCK TABLES `kemri_projectfeedback` WRITE;
/*!40000 ALTER TABLE `kemri_projectfeedback` DISABLE KEYS */;
INSERT INTO `kemri_projectfeedback` VALUES (1,1,'Initial feedback on data collection strategy needs refinement.','Acknowledged, team is revising methodology.',0,NULL,'Dr. Emily Chepkirui',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-15 09:00:00'),(2,3,'Excellent progress on Phase II trial, well managed!','Thank you for the positive feedback.',0,NULL,'Dr. Sarah Wanjiru',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-18 16:00:00'),(3,4,'Concern about delays in prototype development for Leishmaniasis RDT.','Team is addressing supply chain issues for reagents.',0,NULL,'Dr. Ken Baraka',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-21 09:00:00'),(4,5,'Community engagement is strong, very positive reception.','Pleased to hear this, will continue efforts.',0,NULL,'Mr. Peter Njoroge',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-16 14:00:00'),(5,10,'Data analysis for adolescent mental health requires more statistical rigor.','Consulting with external statistician for support.',0,NULL,'Dr. Faith Achieng',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-20 11:00:00'),(6,11,'AI model performance is promising, needs more diverse datasets.','Working on expanding data sources for training.',0,NULL,'Dr. John Mwangi',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-19 10:00:00'),(7,13,'HIV self-testing policy brief looks good, ready for wider circulation.','Excellent, will prepare for dissemination.',0,NULL,'Dr. Ben Kiprono',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-17 15:00:00'),(8,16,'Cross-border coordination challenges noted for emergency preparedness project.','Initiating discussions with diplomatic channels.',0,NULL,'Dr. Alex Kiprop',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-21 10:00:00'),(9,18,'Concern about low sensor compliance in some households for indoor air pollution study.','Implementing daily check-ins and incentives for participants.',0,NULL,'Dr. Chemtai Bett',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-19 09:00:00'),(10,20,'Buruli Ulcer sample processing is taking longer than expected.','Scaling up lab capacity and prioritizing urgent samples.',0,NULL,'Dr. Carol Onyango',NULL,'2025-07-22 07:45:08','2025-07-22 07:45:08',NULL,NULL,'2025-07-21 14:00:00');
/*!40000 ALTER TABLE `kemri_projectfeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_projects`
--

DROP TABLE IF EXISTS `kemri_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectName` varchar(255) DEFAULT NULL,
  `directorate` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `costOfProject` decimal(15,2) DEFAULT NULL,
  `paidOut` decimal(15,2) DEFAULT NULL,
  `objective` text,
  `expectedOutput` text,
  `principalInvestigator` text,
  `expectedOutcome` text,
  `status` varchar(255) DEFAULT NULL,
  `statusReason` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `principalInvestigatorStaffId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `sectionId` int DEFAULT NULL,
  `finYearId` int DEFAULT NULL,
  `programId` int DEFAULT NULL,
  `subProgramId` int DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `projectDescription` text,
  `userId` int DEFAULT NULL,
  `voided` tinyint(1) DEFAULT '0',
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `defaultPhotoId` int DEFAULT NULL,
  `overallProgress` decimal(5,2) DEFAULT '0.00',
  `workflowId` int DEFAULT NULL,
  `currentStageId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `userId` (`userId`),
  KEY `fk_default_photo` (`defaultPhotoId`),
  KEY `workflowId` (`workflowId`),
  KEY `currentStageId` (`currentStageId`),
  CONSTRAINT `fk_default_photo` FOREIGN KEY (`defaultPhotoId`) REFERENCES `kemri_project_photos` (`photoId`),
  CONSTRAINT `kemri_projects_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `kemri_project_milestone_implementations` (`categoryId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_projects_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_projects_ibfk_3` FOREIGN KEY (`workflowId`) REFERENCES `kemri_project_workflows` (`workflowId`),
  CONSTRAINT `kemri_projects_ibfk_4` FOREIGN KEY (`currentStageId`) REFERENCES `kemri_project_stages` (`stageId`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_projects`
--

LOCK TABLES `kemri_projects` WRITE;
/*!40000 ALTER TABLE `kemri_projects` DISABLE KEYS */;
INSERT INTO `kemri_projects` VALUES (176,'Seme HMIS Improvement v5','Health Systems Improvement ','2020-05-09 21:00:00','2024-05-10 11:16:14',7000000.00,13050000.00,'','','','','Closed',NULL,'2025-10-15 05:12:57',NULL,1,NULL,2,NULL,NULL,NULL,'Seme HMIS',1,0,'2025-10-15 05:12:57',NULL,0.00,NULL,NULL),(177,'Seme HMIS Improvement','Health Systems Improvement ','2020-05-09 21:00:00','2024-05-10 11:16:14',7000000.00,0.00,'','','','','Closed',NULL,'2025-10-15 05:12:57',NULL,1,NULL,2,NULL,NULL,NULL,'Seme HMIS',1,0,'2025-10-15 05:12:57',NULL,0.00,NULL,NULL),(178,'Kobura HMIS Improvement','Health Systems Improvement ','2020-05-09 21:00:00','2024-05-10 11:16:14',5000000.00,0.00,'','','','','Accepted','','2025-10-15 05:13:39',NULL,1,NULL,2,NULL,NULL,NULL,'Kobura HMIS',1,0,'2025-10-15 05:13:39',NULL,0.00,NULL,NULL),(180,'Implementation of HMIS and Banda Level 5 Hospital','Health Systems Improvement ','2020-05-09 21:00:00','2024-05-10 11:16:14',15000000.00,0.00,'','','','','New',NULL,'2025-10-15 05:13:39',NULL,1,NULL,2,NULL,NULL,NULL,'Banda level 5 Hospital',1,0,'2025-10-15 05:13:39',NULL,0.00,NULL,NULL),(181,'COnstruction of ICT Lab Kasarani','Implementation MCH Health Systems','2023-07-01 04:00:00','2027-06-30 01:44:02',4500000.00,1500000.00,'To Improve access to sustainable safe water from 76% to 86 % by the year 2027','','','','New',NULL,'2025-10-15 05:13:39',NULL,1,NULL,1,NULL,NULL,NULL,'Establishing ICT lab for Kasarani',1,0,'2025-10-15 05:13:39',NULL,0.00,NULL,NULL),(182,'','Construction of Governors House','2023-07-01 04:00:00','2027-06-30 01:44:02',50000000.00,20000000.00,'','','','','Final Phase',NULL,'2025-10-15 05:13:39',NULL,1,NULL,8,NULL,NULL,NULL,'Construction and furnishing of Governors Residence',1,0,'2025-10-15 05:13:39',NULL,0.00,NULL,NULL),(183,'KCSAP','',NULL,NULL,435162538.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(184,'ASDSP','',NULL,NULL,33113394.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(185,'EU','',NULL,NULL,3000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(186,'Development of horticultural value chains(Assorted seeds)','',NULL,NULL,2000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(187,'Procurement of vaccines, acaricides','',NULL,NULL,3000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(188,'Continuation of  Maseno ATC renovation','',NULL,NULL,3000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(189,'Devlopment of prposed Agriculture Trainng Centre in Seme Sub County','',NULL,NULL,5000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(190,'Operationalization and mainatanace of rice mill','',NULL,NULL,3000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(191,'Dairy Cows','',NULL,NULL,2500000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(192,'One day old chicks','',NULL,NULL,2000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(193,'Feed for the Chicks','',NULL,NULL,2000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(194,'Fish Cages for Kit Mikayi  Kama Association','',NULL,NULL,2800000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(195,'Completion of Achuodho Beach Management Unit (BMU) Banda','',NULL,NULL,1200000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(196,'Supply of Life Saving Jackets','',NULL,NULL,1000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(197,'ABDP','',NULL,NULL,18798559.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,12,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(198,'feeding programme','',NULL,NULL,170000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(199,'ecde infrastructure','',NULL,NULL,23500000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(200,'ecd capitation','',NULL,NULL,21500000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(201,'computers and printers','',NULL,NULL,2850000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(202,'ecd advocacy','',NULL,NULL,1250000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(203,'Monitoring and assessment','',NULL,NULL,635000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(204,'capacity building','',NULL,NULL,635000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(205,'support for needy students','',NULL,NULL,205000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(206,'Ecd Bill/Act Drafting','',NULL,NULL,499000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(207,'BOG constitution and inaugaration','',NULL,NULL,500000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(208,'capitation disbursement','',NULL,NULL,45000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(209,'holdig graduation','',NULL,NULL,350000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(210,'access,equity and quality in vtcs','',NULL,NULL,300000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(211,'vtc infrastructure','',NULL,NULL,16000000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(212,'tools and equipment for vtcs','',NULL,NULL,1753192.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(213,'capacity strengthening for vtcs','',NULL,NULL,360000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(214,'marketing the vtcs through exhibitions','',NULL,NULL,200000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(215,'Collaborations through internships','',NULL,NULL,50000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(216,'strategic partnership and linkages in VTCs','',NULL,NULL,50000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(217,'talent identification and nurturing invtcs','',NULL,NULL,200000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(218,'Human resource management and development','',NULL,NULL,0.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(219,'VET Policy development','',NULL,NULL,100000.00,0.00,'','','','','','','2025-10-15 05:24:21',NULL,2,NULL,5,NULL,NULL,NULL,'',1,0,'2025-10-15 05:51:40',NULL,0.00,NULL,NULL),(220,'Non Motorized transport system within Kisumu City','City Infrastructure Development',NULL,NULL,50000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Non Motorized transport system within Kisumu City',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(221,'Construction of Nyamasaria Satelite Buspark within Kisumu City','City Infrastructure Development',NULL,NULL,30000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Nyamasaria Satelite Buspark within Kisumu City',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(222,'Construction of Kibuye Market phase 1','City Infrastructure Development',NULL,NULL,25000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 1',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(223,'Construction of Kibuye Market phase 2','City Infrastructure Development',NULL,NULL,20000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 2',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(224,'Construction of Kibuye Market phase 3','City Infrastructure Development',NULL,NULL,15000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 3',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(225,'Construction of Kibuye Market phase 4','City Infrastructure Development',NULL,NULL,10000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,9,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 4',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(226,'Improvement of Urban Aesthetics open spaces, round abouts','City Infrastructure Development',NULL,NULL,15000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,10,NULL,NULL,NULL,'City of Kisumu infrastructure project - Improvement of Urban Aesthetics open spaces, round abouts',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(227,'Unblocking of drainage within the main Buspark within Kisumu City','City Infrastructure Development',NULL,NULL,5000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Unblocking of drainage within the main Buspark within Kisumu City',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(228,'Completion of Chichwa Market','City Infrastructure Development',NULL,NULL,8000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Completion of Chichwa Market',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(229,'Completion of Kosawo Market wall Fence','City Infrastructure Development',NULL,NULL,3000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Completion of Kosawo Market wall Fence',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(230,'Completion of Kibuye Market phase 5','City Infrastructure Development',NULL,NULL,12000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Completion of Kibuye Market phase 5',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(231,'Construction of Kibuye Market phase 6','City Infrastructure Development',NULL,NULL,10000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 6',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(232,'Construction of Kibuye Market phase 7','City Infrastructure Development',NULL,NULL,8000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 7',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(233,'Construction of Kibuye Market phase 8','City Infrastructure Development',NULL,NULL,6000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 8',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(234,'Construction of Kibuye Market phase 9','City Infrastructure Development',NULL,NULL,4000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 9',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(235,'Construction of Kibuye Market phase 10','City Infrastructure Development',NULL,NULL,2000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 10',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL),(236,'Construction of Kibuye Market phase 11','City Infrastructure Development',NULL,NULL,1000000.00,0.00,NULL,NULL,NULL,NULL,'New',NULL,'2025-10-15 05:59:11',NULL,14,NULL,5,NULL,NULL,NULL,'City of Kisumu infrastructure project - Construction of Kibuye Market phase 11',1,0,'2025-10-15 05:59:11',NULL,0.00,NULL,NULL);
/*!40000 ALTER TABLE `kemri_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_public_holidays`
--

DROP TABLE IF EXISTS `kemri_public_holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_public_holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holidayName` varchar(255) NOT NULL,
  `holidayDate` date NOT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voided` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `holiday_date_unique` (`holidayDate`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_public_holidays`
--

LOCK TABLES `kemri_public_holidays` WRITE;
/*!40000 ALTER TABLE `kemri_public_holidays` DISABLE KEYS */;
INSERT INTO `kemri_public_holidays` VALUES (1,'New Year\'s Day','2025-01-01',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(2,'Good Friday','2025-04-18',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(3,'Easter Monday','2025-04-21',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(4,'Labour Day','2025-05-01',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(5,'Madaraka Day','2025-06-01',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(6,'Huduma Day','2025-10-10',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(7,'Mashujaa Day','2025-10-20',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(8,'Jamhuri Day','2025-12-12',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(9,'Christmas Day','2025-12-25',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(10,'Boxing Day','2025-12-26',NULL,'2025-08-22 09:07:23','2025-08-22 09:07:23',0),(11,'Test Holidays','2025-08-19',1,'2025-08-22 09:22:11','2025-08-22 09:28:54',1);
/*!40000 ALTER TABLE `kemri_public_holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_role_privileges`
--

DROP TABLE IF EXISTS `kemri_role_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_role_privileges` (
  `roleId` int NOT NULL,
  `privilegeId` int NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`roleId`,`privilegeId`),
  KEY `fk_role_privilege_privilegeId` (`privilegeId`),
  CONSTRAINT `fk_role_privilege_privilegeId` FOREIGN KEY (`privilegeId`) REFERENCES `kemri_privileges` (`privilegeId`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_privilege_roleId` FOREIGN KEY (`roleId`) REFERENCES `kemri_roles` (`roleId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_role_privileges`
--

LOCK TABLES `kemri_role_privileges` WRITE;
/*!40000 ALTER TABLE `kemri_role_privileges` DISABLE KEYS */;
INSERT INTO `kemri_role_privileges` VALUES (1,1,'2025-07-19 00:12:32'),(1,2,'2025-07-19 00:12:32'),(1,3,'2025-07-19 00:12:32'),(1,4,'2025-07-19 00:12:32'),(1,5,'2025-07-19 00:12:32'),(1,6,'2025-07-19 00:12:32'),(1,7,'2025-07-19 00:12:32'),(1,8,'2025-07-19 00:12:32'),(1,9,NULL),(1,10,'2025-07-19 00:12:32'),(1,11,'2025-07-19 00:12:32'),(1,12,'2025-07-19 00:12:32'),(1,13,'2025-07-19 00:12:32'),(1,14,'2025-07-19 00:12:32'),(1,15,'2025-07-19 00:12:32'),(1,16,'2025-07-19 00:12:32'),(1,17,'2025-07-19 00:12:32'),(1,18,'2025-07-19 00:12:32'),(1,19,'2025-07-19 00:12:32'),(1,20,'2025-07-19 00:12:32'),(1,21,'2025-07-19 00:12:32'),(1,22,'2025-07-19 00:12:32'),(1,23,'2025-07-19 00:12:32'),(1,24,'2025-07-19 00:12:32'),(1,25,'2025-07-19 00:12:32'),(1,26,'2025-07-19 00:12:32'),(1,88,NULL),(1,89,NULL),(1,90,NULL),(1,91,NULL),(1,92,NULL),(1,93,NULL),(1,94,NULL),(1,95,NULL),(1,96,NULL),(1,97,NULL),(1,98,NULL),(1,99,NULL),(1,100,NULL),(1,101,NULL),(1,102,NULL),(1,103,NULL),(1,104,NULL),(1,105,NULL),(1,106,NULL),(1,107,NULL),(1,108,NULL),(1,109,NULL),(1,110,NULL),(1,111,NULL),(1,112,NULL),(1,113,NULL),(1,114,NULL),(1,115,NULL),(1,116,NULL),(1,117,NULL),(1,118,NULL),(1,119,NULL),(1,120,NULL),(1,121,NULL),(1,122,NULL),(1,123,NULL),(1,124,NULL),(1,125,NULL),(1,126,NULL),(1,127,NULL),(1,128,NULL),(1,129,NULL),(1,130,NULL),(1,131,NULL),(1,132,NULL),(1,133,NULL),(1,134,NULL),(1,135,NULL),(1,136,NULL),(1,137,NULL),(1,138,NULL),(1,139,NULL),(1,140,NULL),(1,141,NULL),(1,142,NULL),(1,143,NULL),(1,144,NULL),(1,145,NULL),(1,146,NULL),(1,147,NULL),(1,148,NULL),(1,149,NULL),(1,150,NULL),(1,151,NULL),(1,152,NULL),(1,153,NULL),(1,154,NULL),(1,155,NULL),(1,156,NULL),(1,157,NULL),(1,158,NULL),(1,159,NULL),(1,160,NULL),(1,161,NULL),(1,162,NULL),(1,164,NULL),(1,165,NULL),(1,166,NULL),(1,167,NULL),(1,168,NULL),(1,169,NULL),(1,170,NULL),(1,171,NULL),(1,172,NULL),(1,173,NULL),(1,174,NULL),(1,175,NULL),(1,176,NULL),(1,177,NULL),(1,178,NULL),(1,179,NULL),(1,181,NULL),(1,182,NULL),(1,183,NULL),(1,184,NULL),(1,185,NULL),(1,186,NULL),(1,187,NULL),(1,191,NULL),(1,192,NULL),(1,193,NULL),(1,194,NULL),(1,195,NULL),(1,196,NULL),(1,197,NULL),(1,198,NULL),(1,199,NULL),(1,200,NULL),(1,201,NULL),(1,202,NULL),(1,203,NULL),(1,204,NULL),(1,205,NULL),(1,206,NULL),(1,207,NULL),(1,208,NULL),(1,209,NULL),(1,210,NULL),(1,211,NULL),(1,212,NULL),(1,213,NULL),(1,214,NULL),(1,215,NULL),(1,216,NULL),(1,217,NULL),(1,218,NULL),(1,219,NULL),(1,220,NULL),(1,221,NULL),(1,222,NULL),(1,223,NULL),(1,224,NULL),(1,225,NULL),(1,226,NULL),(1,227,NULL),(1,228,NULL),(1,229,NULL),(1,230,NULL),(1,231,NULL),(1,232,NULL),(1,233,NULL),(1,234,NULL),(1,235,NULL),(1,236,NULL),(1,237,NULL),(1,238,NULL),(1,239,NULL),(1,240,NULL),(1,242,NULL),(1,243,NULL),(1,244,NULL),(1,245,NULL),(1,246,NULL),(1,247,NULL),(1,248,NULL),(1,249,NULL),(1,250,NULL),(1,251,NULL),(1,252,NULL),(1,253,NULL),(1,254,NULL),(1,255,NULL),(1,256,NULL),(1,257,NULL),(1,258,NULL),(1,259,NULL),(1,260,NULL),(1,261,NULL),(1,262,NULL),(1,263,NULL),(1,264,NULL),(1,265,NULL),(1,266,NULL),(1,267,NULL),(1,268,NULL),(1,269,NULL),(1,270,NULL),(1,271,NULL),(1,272,NULL),(1,273,NULL),(1,274,NULL),(1,275,NULL),(1,276,NULL),(1,277,NULL),(1,278,NULL),(1,279,NULL),(1,280,NULL),(1,281,NULL),(1,282,NULL),(1,283,NULL),(1,284,NULL),(1,285,NULL),(1,286,NULL),(1,287,NULL),(1,288,NULL),(1,289,NULL),(1,290,NULL),(1,291,NULL),(1,292,NULL),(1,293,NULL),(1,294,NULL),(1,295,NULL),(1,296,NULL),(1,297,NULL),(1,298,NULL),(1,299,NULL),(1,300,NULL),(1,301,NULL),(1,302,NULL),(1,303,NULL),(1,304,NULL),(1,305,NULL),(1,306,NULL),(1,307,NULL),(1,308,NULL),(1,309,NULL),(1,310,NULL),(1,311,NULL),(1,312,NULL),(1,313,NULL),(1,314,NULL),(1,315,NULL),(1,316,NULL),(1,317,NULL),(1,318,NULL),(1,319,NULL),(1,320,NULL),(1,321,NULL),(1,322,NULL),(1,323,NULL),(1,324,NULL),(1,325,NULL),(1,327,NULL),(1,328,NULL),(1,330,NULL),(1,331,NULL),(1,332,NULL),(1,333,NULL),(1,334,NULL),(1,335,NULL),(1,336,NULL),(1,337,NULL),(1,338,NULL),(1,339,NULL),(1,340,NULL),(1,341,NULL),(1,342,NULL),(1,343,NULL),(1,344,NULL),(1,345,NULL),(1,346,NULL),(1,347,NULL),(1,349,'2025-08-26 21:28:00'),(1,350,'2025-08-26 21:28:00'),(1,351,'2025-08-26 21:28:00'),(1,352,'2025-08-26 21:28:00'),(1,353,'2025-10-02 11:51:36'),(1,354,'2025-10-02 11:51:36'),(1,355,'2025-10-02 11:51:36'),(1,356,'2025-10-02 11:51:36'),(1,357,'2025-10-02 11:51:36'),(1,358,'2025-10-02 11:51:36'),(2,1,'2025-07-19 00:12:32'),(2,5,'2025-07-19 00:12:32'),(2,6,'2025-07-19 00:12:32'),(2,7,'2025-07-19 00:12:32'),(2,8,'2025-07-19 00:12:32'),(2,10,'2025-07-19 00:12:32'),(2,11,'2025-07-19 00:12:32'),(2,12,'2025-07-19 00:12:32'),(2,13,'2025-07-19 00:12:32'),(2,14,'2025-07-19 00:12:32'),(2,15,'2025-07-19 00:12:32'),(2,16,'2025-07-19 00:12:32'),(2,17,'2025-07-19 00:12:32'),(2,18,'2025-07-19 00:12:32'),(2,19,'2025-07-19 00:12:32'),(2,20,'2025-07-19 00:12:32'),(2,25,'2025-07-19 00:12:32'),(2,26,'2025-07-19 00:12:32'),(2,353,'2025-10-02 11:51:36'),(2,354,'2025-10-02 11:51:36'),(2,355,'2025-10-02 11:51:36'),(2,356,'2025-10-02 11:51:36'),(3,22,'2025-07-19 00:12:32'),(3,23,'2025-07-19 00:12:32'),(3,25,'2025-07-19 00:12:32'),(3,353,'2025-10-02 13:19:06'),(3,354,'2025-10-02 13:19:06'),(3,355,'2025-10-02 13:19:06'),(3,356,'2025-10-02 13:19:06'),(4,5,'2025-07-19 00:12:32'),(4,10,'2025-07-19 00:12:32'),(4,16,'2025-07-19 00:12:32'),(4,20,'2025-07-19 00:12:32'),(4,25,'2025-07-19 00:12:32'),(4,26,'2025-07-19 00:12:32'),(5,5,'2025-07-19 00:12:32'),(5,9,'2025-07-19 00:12:32'),(5,10,'2025-07-19 00:12:32'),(5,11,'2025-07-19 00:12:32'),(5,12,'2025-07-19 00:12:32'),(5,13,'2025-07-19 00:12:32'),(5,14,'2025-07-19 00:12:32'),(5,15,'2025-07-19 00:12:32'),(5,16,'2025-07-19 00:12:32'),(5,17,'2025-07-19 00:12:32'),(5,18,'2025-07-19 00:12:32'),(5,19,'2025-07-19 00:12:32'),(5,25,'2025-07-19 00:12:32'),(5,354,'2025-10-02 11:51:36'),(5,355,'2025-10-02 11:51:36'),(5,356,'2025-10-02 11:51:36'),(6,25,'2025-07-19 00:12:32'),(6,353,'2025-10-02 13:19:06'),(6,354,'2025-10-02 13:19:06'),(6,355,'2025-10-02 13:19:06'),(6,356,'2025-10-02 13:19:06');
/*!40000 ALTER TABLE `kemri_role_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_roles`
--

DROP TABLE IF EXISTS `kemri_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(255) DEFAULT NULL,
  `description` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `unique_role_name` (`roleName`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_roles`
--

LOCK TABLES `kemri_roles` WRITE;
/*!40000 ALTER TABLE `kemri_roles` DISABLE KEYS */;
INSERT INTO `kemri_roles` VALUES (1,'admin','Full administrative access to the system.','2025-07-19 00:12:32','2025-07-30 14:49:43'),(2,'manager','Manages projects and oversees staff activities.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(3,'data_entry','Can enter and modify raw data.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(4,'viewer','Can view dashboards and reports, but cannot modify data.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(5,'project_lead','Leads specific projects, can manage tasks and milestones within their projects.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(6,'user','Standard user with basic access.','2025-07-19 00:12:32','2025-07-19 00:12:32'),(20,'ICT Admin','asdsadsa','2025-07-30 14:06:54','2025-07-30 14:44:11'),(21,'Contractor','Contractor','2025-08-09 23:23:13','2025-08-09 23:23:13');
/*!40000 ALTER TABLE `kemri_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_sections`
--

DROP TABLE IF EXISTS `kemri_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_sections` (
  `sectionId` int NOT NULL AUTO_INCREMENT,
  `departmentId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` text,
  `location` text,
  `address` text,
  `contactPerson` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` text,
  `remarks` text,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`sectionId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_sections_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_sections_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_sections`
--

LOCK TABLES `kemri_sections` WRITE;
/*!40000 ALTER TABLE `kemri_sections` DISABLE KEYS */;
INSERT INTO `kemri_sections` VALUES (1,1,'Engineering','','','','Eng. Wilson Odhiambo','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(2,1,'Environment','','','','Benard Ojwang','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(3,1,'Public Health','','','','Joshua Adongo','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(4,1,'Projects & Disaster Management','','','','Catherine Obor','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(5,1,'Legal','','','','Mariella Awour','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(6,1,'Human Resource','','','','Harriet Amulen','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(7,1,'Internal Audit','','','','Maurice Oyaro','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(8,1,'Finance','','','','Evans Otieno','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(9,1,'Procurement','','','','Caren Olwero','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(10,1,'Physical Planning','','','','Judy Bala','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(11,1,'Inspectorate and Security','','','','Joanes Omondi','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(12,1,'Trade & Enterprises Development ','','','','','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(13,1,'Communication & Corporate Affairs','','','','Alala','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(14,1,'Social Services & Education','','','','','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(15,1,'Planning & Urban Developement','','','','','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(16,1,'Housing & Lands','','','','','','','',0,1,'2025-10-15 05:00:56','2025-10-15 05:00:56',NULL),(17,2,'Human Resource Management','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(18,2,'Legal Office(County Attorney)','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(19,2,'County Administration','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(20,2,'Communication','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(21,2,'Inspectorate and Security','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(22,2,'Public Affairs','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(23,2,'Service Delivery Unit','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(24,2,'Office of the Governor','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(25,2,'Protocal','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(26,2,'Liaison and Resource Mobilization','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(27,2,'Special Programme and Disaster Management','','','','','','','',0,1,'2025-10-15 05:00:57','2025-10-15 05:00:57',NULL),(28,3,'Agriculture and Irrigation','AI','County HQS','P.O Box 974-40100, Kisumu','Walter Odum','0729878986','walter.odum@gmail.com','Director, AI',0,1,'2025-10-15 05:00:58','2025-10-15 05:00:58',NULL),(29,3,'Livestock Production and Veterinary Services','LPVS','County HQs','P.O. Box 974-40100, Kisumu','Charles Kakuku','0729937700','agochdongruok@yahoo.com','Director, LPVS',0,1,'2025-10-15 05:00:58','2025-10-15 05:00:58',NULL),(30,3,'Fisheries and Blue Economy','FBE','County HQs','P.O. Box 974-40100, Kisumu','Susan Adhiambo','0723435428','scadhiambo@yahoo.com','Director, FBE',0,1,'2025-10-15 05:00:58','2025-10-15 05:00:58',NULL),(31,4,'Public Service','','','','','','','',0,1,'2025-10-15 05:00:59','2025-10-15 05:00:59',NULL),(32,5,'ICT (E-government) Services','ICT','County HQs','P.O. Box 2378 -40100, Kisumu','Maureen Awuor','0725246781','','Director, ICT',0,1,'2025-10-15 05:00:59','2025-10-15 05:00:59',NULL),(33,5,'Economic Planning and Budgeting','EP & B','County HQs','P.O. Box 2378 - 40100, Kisumu','Elvis Otieno','0723901234','','Director, EP & B',0,1,'2025-10-15 05:00:59','2025-10-15 05:00:59',NULL),(34,5,'Finance','Fin','County HQs','P.O. Box 2378 - 40100','Martin Okode','0721943341','','Director, Finance',0,1,'2025-10-15 05:00:59','2025-10-15 05:00:59',NULL),(35,6,'Governors Office','','','','','','','',0,1,'2025-10-15 05:01:00','2025-10-15 05:01:00',NULL),(36,7,'Public Health & Sanitation','','','','','','','',0,1,'2025-10-15 05:01:01','2025-10-15 05:01:01',NULL),(37,7,'Medical Services','','','','','','','',0,1,'2025-10-15 05:01:01','2025-10-15 05:01:01',NULL),(38,8,'Physical Planning and Land Administration','PPLA','County HQs','P.O. Box 2378 - 40100, Kisumu','Fredricks Misigo','0720661210','fredmisigo@gmail.com','Director, PPLA',0,1,'2025-10-15 05:01:02','2025-10-15 05:01:02',NULL),(39,8,'Housing and Urban Development','HUD','County HQs','P.O. Box 2378 -40100, Kisumu','Benard Ojwang','0734542225','ojwangbenard@gmail.com','Director, HUD',0,1,'2025-10-15 05:01:02','2025-10-15 05:01:02',NULL),(40,9,'Sports and Youth Affairs','','','','','','','',0,2,'2025-10-15 05:01:02','2025-10-15 05:01:02',NULL),(41,9,'Culture and Gender','','','','','','','',0,1,'2025-10-15 05:01:02','2025-10-15 05:01:02',NULL),(42,10,'Trade and Enterprise Development','','HQ','','John Mingala','0722805602','','',0,2,'2025-10-15 05:01:03','2025-10-15 05:01:03',NULL),(43,10,'Tourism','','HQ','','Thomas Ouko','0720931120','thomasouko@gmail.com','',0,1,'2025-10-15 05:01:03','2025-10-15 05:01:03',NULL),(44,10,'Cooperatives and Marketing','','HQ','','Miriam Awili','0727856546','awili.okeyo@gmail.com','',0,1,'2025-10-15 05:01:03','2025-10-15 05:01:03',NULL),(45,10,'Industrialization','','HQ','','Samwel Anyanga','0722266887','','Director',0,1,'2025-10-15 05:01:03','2025-10-15 05:01:03',NULL),(46,10,'Alcohol, Beverages and Betting Control','Liqour','HQ','','Peter Collins Okoth','0723497885','','Director',0,1,'2025-10-15 05:01:03','2025-10-15 05:01:03',NULL),(47,11,'Section-wide','','','','','','','',0,2,'2025-10-15 05:01:04','2025-10-15 05:01:04',NULL),(48,12,'Climate Change','','County Headquarters','','Mr.Evance Gichana','0720050812','emgichana@gmail.com','',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(49,12,'Water Supplies  & Sanitation Services Provision','WSS&SP','County Headquarters','2738-40100','Mr. Maurice Owino','0735155629','owinoomau2012@gmail.com','To increase access to portable , safe and clean drinking Water',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(50,12,'Water Supplies Services and Infrastructure Development','WSS&ID','County Headquarters','2738-40100','Eng Bernard Asuna','0723927842','berasuna@gmail.com','To increase water supplies coverage to all citizenry of Kisumu',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(51,12,'Environmental Conservation and Stewardship','EC&S','County Headquarters','2738-40100','Mr. Martin OLoo','0710566784','oloomartin60@yahoo.com','To protect and Conserve environment both for the present and future generation',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(52,12,'Natural Resources','NR','County Headquarters','2738-40100','Mr. Ken Koyoo','0724622808','koyooh2000@gmail.com','To protect and Conserve Natural Resources',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(53,13,'TTI & Social Services','','','','','','','',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(54,13,'ECD','','','','','','','',0,1,'2025-10-15 05:01:05','2025-10-15 05:01:05',NULL),(55,14,'Energy Services','','','','Mathews Onyango','0720336072','director.energy@kisumu.go.ke','',0,2,'2025-10-15 05:01:06','2025-10-15 05:01:06',NULL),(56,14,'Transport and Mechanical Engineering Services','','','','Eng. Eric Ngage','0727749632','','',0,1,'2025-10-15 05:01:06','2025-10-15 05:01:06',NULL),(57,14,'Roads and Public Works','','','','Bernard Ibrahim Malika','','','',0,1,'2025-10-15 05:01:06','2025-10-15 05:01:06',NULL),(58,14,'Cross-directoral','','','','','','','',0,1,'2025-10-15 05:01:06','2025-10-15 05:01:06',NULL);
/*!40000 ALTER TABLE `kemri_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_staff`
--

DROP TABLE IF EXISTS `kemri_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_staff` (
  `staffId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` text,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `jobGroupId` int DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `placeOfBirth` varchar(255) DEFAULT NULL,
  `bloodType` varchar(10) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `nationalId` varchar(50) DEFAULT NULL,
  `kraPin` varchar(50) DEFAULT NULL,
  `employmentStatus` varchar(20) DEFAULT 'Active',
  `startDate` date DEFAULT NULL,
  `emergencyContactName` varchar(255) DEFAULT NULL,
  `emergencyContactRelationship` varchar(100) DEFAULT NULL,
  `emergencyContactPhone` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `maritalStatus` varchar(50) DEFAULT NULL,
  `employmentType` varchar(50) DEFAULT NULL,
  `managerId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`staffId`),
  UNIQUE KEY `nationalId` (`nationalId`),
  UNIQUE KEY `kraPin` (`kraPin`),
  KEY `managerId_fk` (`managerId`),
  KEY `fk_department` (`departmentId`),
  KEY `fk_job_group` (`jobGroupId`),
  CONSTRAINT `fk_department` FOREIGN KEY (`departmentId`) REFERENCES `kemri_departments` (`departmentId`),
  CONSTRAINT `fk_job_group` FOREIGN KEY (`jobGroupId`) REFERENCES `kemri_job_groups` (`id`),
  CONSTRAINT `managerId_fk` FOREIGN KEY (`managerId`) REFERENCES `kemri_staff` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_staff`
--

LOCK TABLES `kemri_staff` WRITE;
/*!40000 ALTER TABLE `kemri_staff` DISABLE KEYS */;
INSERT INTO `kemri_staff` VALUES (1,'Johnson','Kimani','john.doe@kemri.org','0712345678',12,2,'Male','1996-12-19','Kimilili','B+','Christian','2233443','As3213237M','Active','2020-06-18','Nancy Buyani','Parent','0718109196','Kenyan','Single','Full-time',13,1,'2025-07-22 07:17:08','2025-08-23 12:07:27','admin',0),(2,'Jane','Smith','jane.smith@kemri.org','0723456789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-07-22 07:17:08','2025-07-22 07:17:08','manager',0),(3,'Peter','Jones','peter.jones@kemri.org','0734567890',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-07-22 07:17:08','2025-07-22 07:17:08','data_entry',0),(4,'Mary','Wanjiku','mary.wanjiku@kemri.org','0745678901',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-22 07:17:08','2025-07-22 07:17:08','viewer',0),(5,'David','Kipchoge','david.kipchoge@kemri.org','0756789012',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-22 07:17:08','2025-07-22 07:17:08','project_lead',0),(6,'Esther','Mwangi','esther.mwangi@kemri.org','0721123456',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,'2024-01-10 09:00:00','2025-07-22 07:21:11','project_lead',0),(7,'Paul','Kuria','paul.kuria@kemri.org','0722345678',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,'2024-02-15 10:30:00','2025-07-22 07:21:11','manager',0),(8,'Fatuma','Abdalla','fatuma.abdalla@kemri.org','0710987654',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7,'2024-03-20 11:00:00','2025-07-22 07:21:11','data_entry',0),(9,'James','Ochieng','james.ochieng@kemri.org','0733112233',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,'2024-04-01 14:00:00','2025-07-22 07:21:11','viewer',0),(10,'Grace','Wambui','grace.wambui@kemri.org','0700555666',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2023-05-01 08:00:00','2025-07-22 07:21:11','admin',0),(11,'Robert','Muthoni','robert.muthoni@kemri.org','0799888777',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-06-01 11:45:00','2025-07-22 07:21:11','user',0),(12,'Sophia','Njoroge','sophia.njoroge@kemri.org','0711223344',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-07-10 13:00:00','2025-07-22 07:21:11','manager',0),(13,'Daniel','Koech','daniel.koech@kemri.org','0788776655',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-05 09:15:00','2025-07-22 07:21:11','project_lead',0),(14,'Lydia','Chepkoech','lydia.chepkoech@kemri.org','0730123456',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-12 10:00:00','2025-07-22 07:21:11','data_entry',0),(15,'Kevin','Mbugua','kevin.mbugua@kemri.org','0707123123',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-10-20 14:30:00','2025-07-22 07:21:11','viewer',0),(16,'were','ere','ewew@gmail.com','er',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,0),(17,'John','Milema','john.doe@kemri.org','0712345678',NULL,NULL,'Male','1997-10-22',NULL,NULL,NULL,NULL,NULL,'Active','2025-08-29','Pennina Minayo',NULL,'0719201924',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,0),(18,'wasing','dc','wdc@gmail.com','0712123543',1,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,'Active','2025-08-01','younis Mwan',NULL,'8800000','Kenyan','Single','Full-time',2,1,NULL,NULL,'',0),(19,'Emanue','Kimanis','ekamni@gmaiil.com','071718172817',2,NULL,'Male','2001-10-01','Kamilili','AB+','Christian','22661176','A009898788E','Active','2025-08-01','Tests ALs',NULL,'0717182928','Kenyan','Single','Part-time',1,NULL,NULL,NULL,'',0),(20,'Alex','Mumo','alex.mumo@kemri.org','254710111222',1,1,'Male','1985-05-15','Nairobi','O+','Christian','10111222','A101112229Z','Active','2023-01-10','Catherine Mumo','Spouse','254710333444','Kenyan','Married','Permanent',NULL,1,NULL,NULL,'Research Scientist',0),(21,'Brenda','Atieno','brenda.atieno@kemri.org','254720222333',2,2,'Female','1990-08-21','Kisumu','A-','Catholic','20222333','B202223338Y','Active','2022-03-20','David Otieno','Brother','254720555666','Kenyan','Single','Permanent',1,2,NULL,NULL,'Lab Technician',0),(22,'Charles','Odhiambo','charles.odhiambo@kemri.org','254730333444',3,3,'Male','1988-11-30','Nakuru','B+','Christian','30333444','C303334447X','Active','2021-06-15','Faith Odhiambo','Spouse','254730666777','Kenyan','Married','Permanent',1,3,NULL,NULL,'Administrative Staff',0),(23,'Diana','Wanjiku','diana.wanjiku@kemri.org','254740444555',4,1,'Female','1992-02-05','Nyeri','AB+','Christian','40444555','D404445556W','Active','2023-09-01','James Kariuki','Father','254740888999','Kenyan','Single','Permanent',2,4,NULL,NULL,'Research Scientist',0),(24,'Erick','Kipchoge','erick.kipchoge@kemri.org','254750555666',1,2,'Male','1987-07-10','Eldoret','O-','Christian','50555666','E505556665V','Active','2022-11-01','Grace Kipchoge','Mother','254750777888','Kenyan','Married','Permanent',3,5,NULL,NULL,'Lab Technician',0),(25,'Fatuma','Abdullahi','fatuma.abdullahi@kemri.org','254760666777',2,3,'Female','1995-04-12','Mombasa','B-','Muslim','60666777','F606667774U','Active','2024-01-20','Hassan Ali','Brother','254760888999','Kenyan','Single','Contract',3,6,NULL,NULL,'Administrative Staff',0),(26,'George','Kamau','george.kamau@kemri.org','254770777888',3,1,'Male','1980-09-25','Muranga','A+','Christian','70777888','G707778883T','Active','2020-05-18','Monica Wambui','Spouse','254770999000','Kenyan','Married','Permanent',4,7,NULL,NULL,'Research Scientist',0),(27,'Halima','Juma','halima.juma@kemri.org','254780888999',4,2,'Female','1991-06-19','Tanga','O-','Muslim','80888999','H808889992S','Active','2023-05-25','Omar Said','Father','254780000111','Tanzanian','Single','Permanent',4,8,NULL,NULL,'Lab Technician',0),(28,'Ibrahim','Mwangi','ibrahim.mwangi@kemri.org','254790999000',1,3,'Male','1989-10-02','Kampala','A+','Christian','90999000','I909990001R','Active','2022-08-11','Lilian Mwangi','Spouse','254790111222','Ugandan','Married','Permanent',5,9,NULL,NULL,'Administrative Staff',0),(29,'Jane','Akello','jane.akello@kemri.org','254711111222',2,1,'Female','1993-01-28','Kisumu','B-','Christian','11111222','J111112221Q','Active','2024-02-14','Mark Omondi','Spouse','254711333444','Kenyan','Married','Contract',5,10,NULL,NULL,'Research Scientist',0),(30,'Kevin','Mbugua','kevin.mbugua@kemri.org','254712222333',3,2,'Male','1986-03-07','Thika','O+','Christian','12222333','K122223331P','Active','2021-09-01','Esther Mbugua','Mother','254712444555','Kenyan','Single','Permanent',6,11,NULL,NULL,'Lab Technician',0),(31,'Linda','Njeri','linda.njeri@kemri.org','254713333444',4,3,'Female','1994-05-19','Mombasa','AB-','Christian','13333444','L133334441O','Active','2023-03-10','Paul Njogu','Father','254713555666','Kenyan','Single','Permanent',6,12,NULL,NULL,'Administrative Staff',0),(32,'Mohamed','Said','mohamed.said@kemri.org','254714444555',1,1,'Male','1983-08-22','Zanzibar','A+','Muslim','14444555','M144445551N','Active','2020-11-05','Aisha Said','Spouse','254714666777','Tanzanian','Married','Permanent',7,13,NULL,NULL,'Research Scientist',0),(33,'Naomi','Wambui','naomi.wambui@kemri.org','254715555666',2,2,'Female','1996-12-01','Nanyuki','B+','Christian','15555666','N155556661M','Active','2024-04-10','Daniel Mwangi','Spouse','254715777888','Kenyan','Married','Permanent',7,14,NULL,NULL,'Lab Technician',0),(34,'Oscar','Ochieng','oscar.ochieng@kemri.org','254716666777',3,3,'Male','1984-09-17','Kisumu','O+','Christian','16666777','O166667771L','Active','2022-07-01','Phoebe Adhiambo','Sister','254716888999','Kenyan','Single','Permanent',8,15,NULL,NULL,'Administrative Staff',0),(35,'Purity','Chepkoech','purity.chepkoech@kemri.org','254717777888',4,1,'Female','1990-03-03','Iten','A-','Christian','17777888','P177778881K','Active','2023-06-21','Samuel Cheruiyot','Spouse','254717999000','Kenyan','Married','Permanent',8,16,NULL,NULL,'Research Scientist',0),(36,'Quincy','Abwavo','quincy.abwavo@kemri.org','254718888999',1,2,'Male','1987-10-14','Busia','B-','Christian','18888999','Q188889991J','Active','2021-02-15','Terry Abwavo','Sister','254718000111','Kenyan','Single','Permanent',9,17,NULL,NULL,'Lab Technician',0),(37,'Rachel','Njoki','rachel.njoki@kemri.org','254719999000',2,3,'Female','1995-01-08','Nakuru','O+','Christian','19999000','R199990001I','Active','2024-05-01','Simon Ngugi','Brother','254719111222','Kenyan','Single','Contract',9,18,NULL,NULL,'Administrative Staff',0),(38,'Samuel','Mburu','samuel.mburu@kemri.org','254720000111',3,1,'Male','1982-04-29','Nairobi','A+','Christian','20000111','S200001111H','Active','2020-08-01','Veronica Wanjiru','Spouse','254720222333','Kenyan','Married','Permanent',10,19,NULL,NULL,'Research Scientist',0),(39,'Teresia','Mutheu','teresia.mutheu@kemri.org','254721111222',4,2,'Female','1993-07-23','Machakos','O-','Christian','21111222','T211112221G','Active','2023-01-15','Paul Mbutu','Father','254721333444','Kenyan','Single','Permanent',10,20,NULL,NULL,'Lab Technician',0),(40,'Uledi','Bakari','uledi.bakari@kemri.org','254722222333',1,3,'Male','1988-09-09','Lamu','B+','Muslim','22222333','U222223331F','Active','2022-09-05','Zainabu Bakari','Mother','254722444555','Kenyan','Married','Permanent',11,21,NULL,NULL,'Administrative Staff',0),(41,'Violet','Wambua','violet.wambua@kemri.org','254723333444',2,1,'Female','1991-02-18','Kitui','AB+','Christian','23333444','V233334441E','Active','2024-03-01','Peter Wambua','Brother','254723555666','Kenyan','Single','Contract',11,22,NULL,NULL,'Research Scientist',0),(42,'William','Oduor','william.oduor@kemri.org','254724444555',3,2,'Male','1985-05-27','Bungoma','A-','Christian','24444555','W244445551D','Active','2021-10-12','Lucy Oduor','Spouse','254724666777','Kenyan','Married','Permanent',12,23,NULL,NULL,'Lab Technician',0),(43,'Xavier','Kibaki','xavier.kibaki@kemri.org','254725555666',4,3,'Male','1994-08-04','Nyeri','O+','Christian','25555666','X255556661C','Active','2023-04-25','Agnes Wanjiru','Mother','254725777888','Kenyan','Single','Permanent',12,24,NULL,NULL,'Administrative Staff',0),(44,'Yvonne','Cherono','yvonne.cherono@kemri.org','254726666777',1,1,'Female','1990-11-13','Kericho','B-','Christian','26666777','Y266667771B','Active','2022-07-07','Joshua Cherono','Brother','254726888999','Kenyan','Married','Permanent',13,25,NULL,NULL,'Research Scientist',0);
/*!40000 ALTER TABLE `kemri_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_strategicplans`
--

DROP TABLE IF EXISTS `kemri_strategicplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_strategicplans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cidpid` varchar(255) DEFAULT NULL,
  `cidpName` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `theme` text,
  `vision` text,
  `mission` text,
  `remarks` text,
  `voided` tinyint(1) DEFAULT NULL,
  `voidedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_strategicplans`
--

LOCK TABLES `kemri_strategicplans` WRITE;
/*!40000 ALTER TABLE `kemri_strategicplans` DISABLE KEYS */;
INSERT INTO `kemri_strategicplans` VALUES (1,'CIDP-KSM-2023-2027','Kisumu County Integrated Development Plan 2023-2027','2023-07-30 00:00:00','2027-07-30 00:00:00','Sustainable Development for All','A healthy, prosperous, and equitable Kisumu County.','To deliver high-quality, people-centered services through innovation and accountability.','Focuses on health, agriculture, and infrastructure development.',0,NULL),(2,'CIDP-NBO-2022-2026','Nairobi City County Integrated Development Plan 2022-2026','2022-07-01 00:00:00','2026-06-30 23:59:59','Smart City, Healthy Citizens','Nairobi: The leading smart and healthy metropolis in Africa.','To foster a resilient and inclusive city through strategic partnerships and sustainable growth.','Emphasis on urban planning, health services, and economic empowerment.',0,NULL),(3,'CIDP-MSA-2024-2028','Mombasa County Integrated Development Plan 2024-2028','2024-01-01 00:00:00','2028-12-31 23:59:59','Blue Economy and Coastal Health','A thriving coastal economy with healthy communities and a pristine environment.','To harness marine resources sustainably while enhancing public health and environmental conservation.','New plan with a focus on marine resources and coastal health.',0,NULL),(4,'CIDP-TRK-2023-2027','Turkana County Integrated Development Plan 2023-2027','2023-09-01 00:00:00','2027-08-31 23:59:59','Resilience in Arid Lands','A resilient and food-secure Turkana County with improved livelihoods.','To implement sustainable strategies for water, health, and pastoralism in arid and semi-arid lands.','Addresses challenges of climate change and food security.',0,NULL),(5,'CIDP-GRS-2024-2028','Garissa County Integrated Development Plan 2024-2028','2024-07-01 00:00:00','2028-06-30 23:59:59','Community-Led Development','Empowered communities leading their own development.','To facilitate community-driven initiatives for health, education, and economic development.','Strong emphasis on local participation.',0,NULL),(6,'CIDP-2024','Development OF Malaria Vaccine','2025-07-27 00:00:00','2025-08-07 00:00:00',NULL,NULL,NULL,NULL,0,NULL),(11,'EKisumu-CIDP-2023-2027','EKisumu County Integrated Development Plan 2023-2027','2023-07-30 03:00:00','2027-07-30 03:00:00',NULL,NULL,NULL,NULL,0,NULL),(12,'CIDP-2025-2030','Vihiga County Integrated Development Plan','2025-08-01 00:00:00','2030-07-01 00:00:00',NULL,NULL,NULL,NULL,0,NULL),(13,'NAIROBI-2024-2029','Nairobi Urban Health Strategic Plan','2024-06-30 00:00:00','2029-06-29 00:00:00',NULL,NULL,NULL,NULL,0,NULL),(14,'KISUMU-2024-001','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(15,'KISUMU-2024-002','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(16,'KISUMU-2024-003','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(17,'KISUMU-2024-004','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(18,'KISUMU-2024-005','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(19,'KISUMU-2024-006','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(20,'KISUMU-2024-007','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(21,'KISUMU-2024-008','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(22,'KISUMU-2024-009','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(23,'KISUMU-2024-010','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(24,'KISUMU-2024-011','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(25,'KISUMU-2024-012','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(26,'KISUMU-2024-013','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(27,'KISUMU-2024-014','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(28,'KISUMU-2024-015','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(29,'KISUMU-2024-016','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(30,'KISUMU-2024-017','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(31,'KISUMU-2024-018','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(32,'KISUMU-2024-019','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(33,'KISUMU-2024-020','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(34,'KISUMU-2024-021','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(35,'KISUMU-2024-022','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(36,'KISUMU-2024-023','County Vision 2029','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(37,'KISUMU-2024-024','Five-Year Development Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(38,'KISUMU-2024-025','Kisumu Urban Strategic Plan','2024-07-01 00:00:00','2029-06-30 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(39,'KITUI-2024-001','Kitui County Integrated Development Plan 2024-2029','2024-07-01 00:00:00','2029-06-30 23:59:59','Transforming Kitui County for Sustainable Development','A prosperous, resilient, and sustainable Kitui County where all residents enjoy quality life and equal opportunities for growth and development.','To provide transformative leadership and service delivery that promotes socio-economic development, environmental sustainability, and improved quality of life for all residents of Kitui County.','Strategic plan covering the period 2024-2029 with focus on food security, water access, healthcare, education, infrastructure, and economic development.',0,NULL);
/*!40000 ALTER TABLE `kemri_strategicplans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_studyparticipants`
--

DROP TABLE IF EXISTS `kemri_studyparticipants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_studyparticipants` (
  `individualId` int NOT NULL AUTO_INCREMENT,
  `householdId` varchar(50) DEFAULT NULL,
  `gpsLatitudeIndividual` decimal(10,7) DEFAULT NULL,
  `gpsLongitudeIndividual` decimal(10,7) DEFAULT NULL,
  `county` varchar(100) DEFAULT NULL,
  `subCounty` varchar(100) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `educationLevel` varchar(255) DEFAULT NULL,
  `diseaseStatusMalaria` varchar(255) DEFAULT NULL,
  `diseaseStatusDengue` varchar(255) DEFAULT NULL,
  `mosquitoNetUse` varchar(255) DEFAULT NULL,
  `waterStoragePractices` varchar(100) DEFAULT NULL,
  `climatePerception` varchar(100) DEFAULT NULL,
  `recentRainfall` varchar(255) DEFAULT NULL,
  `averageTemperatureC` varchar(100) DEFAULT NULL,
  `householdSize` varchar(100) DEFAULT NULL,
  `accessToHealthcare` varchar(255) DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `voided` tinyint DEFAULT '0',
  PRIMARY KEY (`individualId`)
) ENGINE=InnoDB AUTO_INCREMENT=897 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_studyparticipants`
--

LOCK TABLES `kemri_studyparticipants` WRITE;
/*!40000 ALTER TABLE `kemri_studyparticipants` DISABLE KEYS */;
INSERT INTO `kemri_studyparticipants` VALUES (1,'HH-1-2853',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',35,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','120','24.50','5','Easy',1,0),(2,'HH-2-7297',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',8,'Student','Primary','No','No','Yes','Covered containers','Moderate','120','24.50','5','Easy',1,0),(3,'HH-3-7928',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',5,'None','None','No','No','Yes','Covered containers','Moderate','120','24.50','5','Easy',1,0),(4,'HH-4-7747',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',40,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','120','24.50','5','Easy',1,0),(5,'HH-5-4951',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',1,'None','None','No','No','Yes','Covered containers','Moderate','120','24.50','5','Easy',1,0),(6,'HH-6-1516',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',52,'Businessman','Tertiary','No','No','No','No storage','Low','70','20.10','4','Moderate',1,0),(7,'HH-7-2727',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',48,'Housewife','Primary','No','No','No','No storage','Low','70','20.10','4','Moderate',1,0),(8,'HH-8-9089',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',20,'Student','Tertiary','No','No','No','No storage','Low','70','20.10','4','Moderate',1,0),(9,'HH-9-7265',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',15,'Student','Secondary','No','No','No','No storage','Low','70','20.10','4','Moderate',1,0),(10,'HH-10-9059',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',28,'Office Worker','Tertiary','No','No','No','Covered containers','High','50','23.80','3','Easy',1,0),(11,'HH-11-3498',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',30,'Teacher','Tertiary','No','No','No','Covered containers','High','50','23.80','3','Easy',1,0),(12,'HH-12-0313',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',2,'None','None','No','No','No','Covered containers','High','50','23.80','3','Easy',1,0),(13,'HH-13-1074',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',60,'Pastoralist','None','Yes','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(14,'HH-14-4432',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',55,'Housewife','None','Yes','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(15,'HH-15-8936',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',25,'None','Primary','No','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(16,'HH-16-1385',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',22,'Pastoralist','Primary','Yes','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(17,'HH-17-0119',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',18,'None','Primary','No','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(18,'HH-18-6442',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',10,'Student','Primary','No','No','Yes','Open containers','High','180','28.20','6','Difficult',1,0),(19,'HH-19-1851',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',45,'Fisher','Primary','No','Yes','Yes','Open containers','High','150','29.10','4','Moderate',1,0),(20,'HH-20-9931',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',47,'Fisher','Primary','No','Yes','Yes','Open containers','High','150','29.10','4','Moderate',1,0),(22,'HH-22-4101',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',12,'Student','Primary','No','No','Yes','Open containers','High','150','29.10','4','Moderate',1,0),(23,'HH-23-0713',0.2833000,34.7500000,'Bungoma','Bungoma Central','Male',65,'Retired','None','Yes','No','Yes','Covered containers','Moderate','100','22.00','2','Easy',1,0),(24,'HH-24-1263',0.2833000,34.7500000,'Bungoma','Bungoma Central','Female',62,'Housewife','None','No','No','Yes','Covered containers','Moderate','100','22.00','2','Easy',1,0),(25,'HH-25-4176',-0.7833000,35.0000000,'Narok','Narok North','Female',30,'Trader','Primary','No','No','No','No storage','Low','60','25.50','5','Difficult',1,0),(26,'HH-26-7094',-0.7833000,35.0000000,'Narok','Narok North','Male',32,'Trader','Primary','No','No','No','No storage','Low','60','25.50','5','Difficult',1,0),(27,'HH-27-2939',-0.7833000,35.0000000,'Narok','Narok North','Female',7,'Student','Primary','No','No','No','No storage','Low','60','25.50','5','Difficult',1,0),(28,'HH-28-3415',-0.7833000,35.0000000,'Narok','Narok North','Male',5,'None','None','No','No','No','No storage','Low','60','25.50','5','Difficult',1,0),(29,'HH-29-8259',-0.7833000,35.0000000,'Narok','Narok North','Female',1,'None','None','No','No','No','No storage','Low','60','25.50','5','Difficult',1,0),(30,'HH-30-1051',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',48,'Teacher','Tertiary','No','No','No','Covered containers','Moderate','80','21.00','4','Easy',1,0),(31,'HH-31-0478',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',45,'Farmer','Secondary','No','No','No','Covered containers','Moderate','80','21.00','4','Easy',1,0),(32,'HH-32-9239',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',18,'Student','Secondary','No','No','No','Covered containers','Moderate','80','21.00','4','Easy',1,0),(33,'HH-33-4761',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',10,'Student','Primary','No','No','No','Covered containers','Moderate','80','21.00','4','Easy',1,0),(34,'HH-34-6087',2.8000000,36.0000000,'Turkana','Turkana North','Male',70,'Pastoralist','None','Yes','No','No','Open containers','High','200','30.50','5','Difficult',1,0),(35,'HH-35-6152',2.8000000,36.0000000,'Turkana','Turkana North','Female',68,'Housewife','None','Yes','No','No','Open containers','High','200','30.50','5','Difficult',1,0),(36,'HH-36-2501',2.8000000,36.0000000,'Turkana','Turkana North','Male',35,'Pastoralist','None','Yes','No','No','Open containers','High','200','30.50','5','Difficult',1,0),(37,'HH-37-4050',2.8000000,36.0000000,'Turkana','Turkana North','Female',30,'Housewife','None','No','No','No','Open containers','High','200','30.50','5','Difficult',1,0),(38,'HH-38-2746',2.8000000,36.0000000,'Turkana','Turkana North','Male',8,'None','Primary','No','No','No','Open containers','High','200','30.50','5','Difficult',1,0),(39,'HH-39-1580',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',25,'Shopkeeper','Secondary','No','No','No','Covered containers','Moderate','40','26.00','3','Easy',1,0),(40,'HH-40-9663',-0.6000000,37.0000000,'Machakos','Machakos Town','Male',28,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','40','26.00','3','Easy',1,0),(41,'HH-41-3577',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',3,'None','None','No','No','No','Covered containers','Moderate','40','26.00','3','Easy',1,0),(42,'HH-42-8895',0.0000000,37.9000000,'Meru','Imenti South','Male',55,'Farmer','Primary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(43,'HH-43-3745',0.0000000,37.9000000,'Meru','Imenti South','Female',50,'Housewife','Primary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(44,'HH-44-2039',0.0000000,37.9000000,'Meru','Imenti South','Male',25,'Farmer','Secondary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(45,'HH-45-8963',0.0000000,37.9000000,'Meru','Imenti South','Female',20,'Student','Secondary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(46,'HH-46-8696',0.0000000,37.9000000,'Meru','Imenti South','Male',15,'Student','Primary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(47,'HH-47-6592',0.0000000,37.9000000,'Meru','Imenti South','Female',8,'Student','Primary','No','No','Yes','Open containers','Moderate','90','23.00','6','Moderate',1,0),(48,'HH-48-6875',-2.1000000,40.0000000,'Lamu','Lamu West','Female',40,'Fisher','None','No','Yes','Yes','Open containers','High','160','28.80','5','Difficult',1,0),(49,'HH-49-4597',-2.1000000,40.0000000,'Lamu','Lamu West','Male',42,'Fisher','None','No','Yes','Yes','Open containers','High','160','28.80','5','Difficult',1,0),(50,'HH-50-2360',-2.1000000,40.0000000,'Lamu','Lamu West','Female',18,'Student','Primary','No','No','Yes','Open containers','High','160','28.80','5','Difficult',1,0),(51,'HH-51-8012',-2.1000000,40.0000000,'Lamu','Lamu West','Male',10,'Student','Primary','No','No','Yes','Open containers','High','160','28.80','5','Difficult',1,0),(52,'HH-52-2980',-2.1000000,40.0000000,'Lamu','Lamu West','Female',5,'None','None','No','No','Yes','Open containers','High','160','28.80','5','Difficult',1,0),(53,'HH-53-0862',-0.6900000,34.2500000,'Siaya','Bondo','Male',38,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(54,'HH-54-5374',-0.6900000,34.2500000,'Siaya','Bondo','Female',36,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(55,'HH-55-4281',-0.6900000,34.2500000,'Siaya','Bondo','Male',15,'Student','Secondary','No','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(56,'HH-56-5285',-0.6900000,34.2500000,'Siaya','Bondo','Female',12,'Student','Primary','Yes','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(57,'HH-57-3584',-0.6900000,34.2500000,'Siaya','Bondo','Male',8,'Student','Primary','No','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(58,'HH-58-2066',-0.6900000,34.2500000,'Siaya','Bondo','Female',5,'None','None','No','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(59,'HH-59-9577',-0.6900000,34.2500000,'Siaya','Bondo','Male',2,'None','None','No','No','Yes','Covered containers','Moderate','130','25.00','7','Moderate',1,0),(60,'HH-60-1689',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',50,'Farmer','Primary','No','No','No','No storage','Low','65','19.50','3','Moderate',1,0),(61,'HH-61-9713',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Male',52,'Farmer','Primary','No','No','No','No storage','Low','65','19.50','3','Moderate',1,0),(62,'HH-62-3498',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',20,'Student','Tertiary','No','No','No','No storage','Low','65','19.50','3','Moderate',1,0),(63,'HH-63-8351',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',40,'Pastoralist','None','Yes','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(64,'HH-64-1264',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',38,'Housewife','None','Yes','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(65,'HH-65-1266',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',15,'Student','Primary','No','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(66,'HH-66-2540',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',12,'None','None','No','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(67,'HH-67-8901',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',8,'None','None','No','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(68,'HH-68-6884',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',3,'None','None','No','No','No','Open containers','High','170','27.00','6','Difficult',1,0),(69,'HH-69-7719',-0.1000000,37.5000000,'Embu','Embu West','Female',33,'Trader','Secondary','No','No','No','Covered containers','Moderate','75','22.50','4','Easy',1,0),(70,'HH-70-7941',-0.1000000,37.5000000,'Embu','Embu West','Male',35,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','75','22.50','4','Easy',1,0),(71,'HH-71-6552',-0.1000000,37.5000000,'Embu','Embu West','Female',10,'Student','Primary','No','No','No','Covered containers','Moderate','75','22.50','4','Easy',1,0),(72,'HH-72-8938',-0.1000000,37.5000000,'Embu','Embu West','Male',5,'None','None','No','No','No','Covered containers','Moderate','75','22.50','4','Easy',1,0),(73,'HH-73-5031',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',45,'Farmer','Primary','No','No','Yes','Open containers','High','110','27.00','5','Moderate',1,0),(74,'HH-74-8344',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',42,'Housewife','Primary','No','No','Yes','Open containers','High','110','27.00','5','Moderate',1,0),(75,'HH-75-6628',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',20,'Student','Secondary','No','No','Yes','Open containers','High','110','27.00','5','Moderate',1,0),(76,'HH-76-8108',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',15,'Student','Primary','No','No','Yes','Open containers','High','110','27.00','5','Moderate',1,0),(77,'HH-77-0656',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',7,'None','None','No','No','Yes','Open containers','High','110','27.00','5','Moderate',1,0),(78,'HH-78-8956',0.7500000,34.5000000,'Kakamega','Butere','Female',58,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','140','24.00','4','Easy',1,0),(79,'HH-79-2814',0.7500000,34.5000000,'Kakamega','Butere','Male',60,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','140','24.00','4','Easy',1,0),(80,'HH-80-7203',0.7500000,34.5000000,'Kakamega','Butere','Female',25,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','140','24.00','4','Easy',1,0),(81,'HH-81-7571',0.7500000,34.5000000,'Kakamega','Butere','Male',22,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','140','24.00','4','Easy',1,0),(82,'HH-82-6247',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Male',30,'Salesperson','Secondary','No','No','No','No storage','Low','55','21.50','3','Easy',1,0),(83,'HH-83-8524',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',28,'Hairdresser','Secondary','No','No','No','No storage','Low','55','21.50','3','Easy',1,0),(84,'HH-84-3881',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',4,'None','None','No','No','No','No storage','Low','55','21.50','3','Easy',1,0),(85,'HH-85-3831',1.5000000,37.5000000,'Marsabit','Moyale','Female',60,'Pastoralist','None','Yes','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(86,'HH-86-7515',1.5000000,37.5000000,'Marsabit','Moyale','Male',62,'Pastoralist','None','Yes','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(87,'HH-87-6081',1.5000000,37.5000000,'Marsabit','Moyale','Female',30,'Housewife','None','No','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(88,'HH-88-7863',1.5000000,37.5000000,'Marsabit','Moyale','Male',28,'Pastoralist','None','Yes','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(89,'HH-89-1070',1.5000000,37.5000000,'Marsabit','Moyale','Female',15,'None','Primary','No','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(90,'HH-90-1760',1.5000000,37.5000000,'Marsabit','Moyale','Male',10,'None','None','No','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(91,'HH-91-5593',1.5000000,37.5000000,'Marsabit','Moyale','Female',5,'None','None','No','No','No','Open containers','High','190','31.00','7','Difficult',1,0),(92,'HH-92-2685',-0.0500000,35.3000000,'Kericho','Kericho East','Male',40,'Farmer','Secondary','No','No','No','Covered containers','Moderate','95','20.80','5','Moderate',1,0),(93,'HH-93-6646',-0.0500000,35.3000000,'Kericho','Kericho East','Female',38,'Housewife','Primary','No','No','No','Covered containers','Moderate','95','20.80','5','Moderate',1,0),(94,'HH-94-5175',-0.0500000,35.3000000,'Kericho','Kericho East','Male',15,'Student','Secondary','No','No','No','Covered containers','Moderate','95','20.80','5','Moderate',1,0),(95,'HH-95-5938',-0.0500000,35.3000000,'Kericho','Kericho East','Female',10,'Student','Primary','No','No','No','Covered containers','Moderate','95','20.80','5','Moderate',1,0),(96,'HH-96-4165',-0.0500000,35.3000000,'Kericho','Kericho East','Male',5,'None','None','No','No','No','Covered containers','Moderate','95','20.80','5','Moderate',1,0),(97,'HH-97-3011',0.6000000,39.0000000,'Garissa','Fafi','Female',50,'Trader','None','Yes','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(98,'HH-98-2563',0.6000000,39.0000000,'Garissa','Fafi','Male',55,'Trader','None','Yes','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(99,'HH-99-3780',0.6000000,39.0000000,'Garissa','Fafi','Female',25,'None','Primary','No','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(100,'HH-100-1212',0.6000000,39.0000000,'Garissa','Fafi','Male',20,'None','Primary','Yes','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(101,'HH-101-4720',0.6000000,39.0000000,'Garissa','Fafi','Female',10,'None','None','No','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(102,'HH-102-9967',0.6000000,39.0000000,'Garissa','Fafi','Male',5,'None','None','No','No','No','Open containers','High','210','32.00','6','Difficult',1,0),(103,'HH-103-5673',-1.0000000,36.5000000,'Kiambu','Limuru','Male',35,'Driver','Secondary','No','No','No','Covered containers','Low','60','20.00','4','Easy',1,0),(104,'HH-104-8465',-1.0000000,36.5000000,'Kiambu','Limuru','Female',32,'Hairdresser','Secondary','No','No','No','Covered containers','Low','60','20.00','4','Easy',1,0),(105,'HH-105-5305',-1.0000000,36.5000000,'Kiambu','Limuru','Male',8,'Student','Primary','No','No','No','Covered containers','Low','60','20.00','4','Easy',1,0),(106,'HH-106-1132',-1.0000000,36.5000000,'Kiambu','Limuru','Female',3,'None','None','No','No','No','Covered containers','Low','60','20.00','4','Easy',1,0),(107,'HH-107-9747',0.0000000,34.0000000,'Busia','Samia','Female',48,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(108,'HH-108-5337',0.0000000,34.0000000,'Busia','Samia','Male',50,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(109,'HH-109-7447',0.0000000,34.0000000,'Busia','Samia','Female',20,'Student','Secondary','No','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(110,'HH-110-1224',0.0000000,34.0000000,'Busia','Samia','Male',18,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(111,'HH-111-3778',0.0000000,34.0000000,'Busia','Samia','Female',10,'Student','Primary','No','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(112,'HH-112-5217',0.0000000,34.0000000,'Busia','Samia','Male',5,'None','None','No','No','Yes','Covered containers','Moderate','135','25.30','6','Moderate',1,0),(113,'HH-113-4754',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',65,'Pastoralist','None','Yes','No','No','Open containers','High','185','29.00','5','Difficult',1,0),(114,'HH-114-8121',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',63,'Housewife','None','Yes','No','No','Open containers','High','185','29.00','5','Difficult',1,0),(115,'HH-115-6341',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',30,'Pastoralist','None','No','No','No','Open containers','High','185','29.00','5','Difficult',1,0),(116,'HH-116-7343',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',28,'Housewife','None','No','No','No','Open containers','High','185','29.00','5','Difficult',1,0),(117,'HH-117-7693',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',10,'None','None','No','No','No','Open containers','High','185','29.00','5','Difficult',1,0),(118,'HH-118-6438',-0.5000000,37.0000000,'Makueni','Makueni','Female',38,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','85','26.50','5','Moderate',1,0),(119,'HH-119-9110',-0.5000000,37.0000000,'Makueni','Makueni','Male',40,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','85','26.50','5','Moderate',1,0),(120,'HH-120-6237',-0.5000000,37.0000000,'Makueni','Makueni','Female',15,'Student','Secondary','No','No','Yes','Covered containers','Moderate','85','26.50','5','Moderate',1,0),(121,'HH-121-3855',-0.5000000,37.0000000,'Makueni','Makueni','Male',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','85','26.50','5','Moderate',1,0),(122,'HH-122-0566',-0.5000000,37.0000000,'Makueni','Makueni','Female',5,'None','None','No','No','Yes','Covered containers','Moderate','85','26.50','5','Moderate',1,0),(123,'HH-123-1265',-1.5000000,38.0000000,'Tana River','Galole','Male',55,'Fisher','None','Yes','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(124,'HH-124-4627',-1.5000000,38.0000000,'Tana River','Galole','Female',52,'Housewife','None','Yes','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(125,'HH-125-9340',-1.5000000,38.0000000,'Tana River','Galole','Male',28,'Fisher','Primary','No','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(126,'HH-126-2821',-1.5000000,38.0000000,'Tana River','Galole','Female',25,'None','Primary','No','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(127,'HH-127-6085',-1.5000000,38.0000000,'Tana River','Galole','Male',10,'Student','None','No','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(128,'HH-128-1964',-1.5000000,38.0000000,'Tana River','Galole','Female',5,'None','None','No','No','Yes','Open containers','High','170','29.50','6','Difficult',1,0),(129,'HH-129-1563',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',30,'Trader','Secondary','Yes','No','Yes','Covered containers','Moderate','125','25.80','4','Easy',1,0),(130,'HH-130-1923',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',32,'Fisher','Secondary','Yes','No','Yes','Covered containers','Moderate','125','25.80','4','Easy',1,0),(131,'HH-131-4927',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',8,'Student','Primary','No','No','Yes','Covered containers','Moderate','125','25.80','4','Easy',1,0),(132,'HH-132-8869',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',3,'None','None','No','No','Yes','Covered containers','Moderate','125','25.80','4','Easy',1,0),(133,'HH-133-9561',0.5000000,36.0000000,'Baringo','Mogotio','Male',45,'Pastoralist','None','Yes','No','No','Open containers','High','195','28.00','5','Difficult',1,0),(134,'HH-134-1201',0.5000000,36.0000000,'Baringo','Mogotio','Female',42,'Housewife','None','Yes','No','No','Open containers','High','195','28.00','5','Difficult',1,0),(135,'HH-135-7323',0.5000000,36.0000000,'Baringo','Mogotio','Male',20,'Pastoralist','Primary','No','No','No','Open containers','High','195','28.00','5','Difficult',1,0),(136,'HH-136-3013',0.5000000,36.0000000,'Baringo','Mogotio','Female',15,'None','None','No','No','No','Open containers','High','195','28.00','5','Difficult',1,0),(137,'HH-137-3097',0.5000000,36.0000000,'Baringo','Mogotio','Male',7,'None','None','No','No','No','Open containers','High','195','28.00','5','Difficult',1,0),(138,'HH-138-6446',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',55,'Farmer','Primary','No','No','No','Covered containers','Low','70','18.50','3','Moderate',1,0),(139,'HH-139-2937',-0.4500000,36.2000000,'Nyandarua','Kinangop','Male',58,'Farmer','Primary','No','No','No','Covered containers','Low','70','18.50','3','Moderate',1,0),(140,'HH-140-5349',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',25,'Teacher','Tertiary','No','No','No','Covered containers','Low','70','18.50','3','Moderate',1,0),(141,'HH-141-7935',-1.2000000,37.8000000,'Kwale','Kinango','Male',40,'Farmer','Primary','Yes','No','Yes','Open containers','High','155','29.00','5','Difficult',1,0),(142,'HH-142-3629',-1.2000000,37.8000000,'Kwale','Kinango','Female',38,'Housewife','Primary','No','No','Yes','Open containers','High','155','29.00','5','Difficult',1,0),(143,'HH-143-4341',-1.2000000,37.8000000,'Kwale','Kinango','Male',15,'Student','Secondary','No','No','Yes','Open containers','High','155','29.00','5','Difficult',1,0),(144,'HH-144-0817',-1.2000000,37.8000000,'Kwale','Kinango','Female',12,'Student','Primary','No','No','Yes','Open containers','High','155','29.00','5','Difficult',1,0),(145,'HH-145-1061',-1.2000000,37.8000000,'Kwale','Kinango','Male',5,'None','None','No','No','Yes','Open containers','High','155','29.00','5','Difficult',1,0),(146,'HH-146-2857',0.5500000,34.7000000,'Vihiga','Sabatia','Female',30,'Businesswoman','Secondary','No','No','Yes','Covered containers','Moderate','115','23.50','4','Easy',1,0),(147,'HH-147-1102',0.5500000,34.7000000,'Vihiga','Sabatia','Male',32,'Carpenter','Secondary','No','No','Yes','Covered containers','Moderate','115','23.50','4','Easy',1,0),(148,'HH-148-6941',0.5500000,34.7000000,'Vihiga','Sabatia','Female',8,'Student','Primary','No','No','Yes','Covered containers','Moderate','115','23.50','4','Easy',1,0),(149,'HH-149-1400',0.5500000,34.7000000,'Vihiga','Sabatia','Male',3,'None','None','No','No','Yes','Covered containers','Moderate','115','23.50','4','Easy',1,0),(150,'HH-150-6177',-0.7000000,37.5000000,'Kwale','Msambweni','Male',45,'Fisher','Primary','No','Yes','Yes','Open containers','High','160','29.20','5','Difficult',1,0),(151,'HH-151-6686',-0.7000000,37.5000000,'Kwale','Msambweni','Female',43,'Trader','Primary','No','Yes','Yes','Open containers','High','160','29.20','5','Difficult',1,0),(152,'HH-152-4897',-0.7000000,37.5000000,'Kwale','Msambweni','Male',20,'Student','Secondary','No','No','Yes','Open containers','High','160','29.20','5','Difficult',1,0),(153,'HH-153-4428',-0.7000000,37.5000000,'Kwale','Msambweni','Female',15,'Student','Primary','No','No','Yes','Open containers','High','160','29.20','5','Difficult',1,0),(154,'HH-154-7448',-0.7000000,37.5000000,'Kwale','Msambweni','Male',7,'None','None','No','No','Yes','Open containers','High','160','29.20','5','Difficult',1,0),(155,'HH-155-3960',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',50,'Farmer','Primary','No','No','No','Covered containers','Low','80','21.00','4','Moderate',1,0),(156,'HH-156-7455',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',52,'Farmer','Primary','No','No','No','Covered containers','Low','80','21.00','4','Moderate',1,0),(157,'HH-157-5394',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',25,'Teacher','Tertiary','No','No','No','Covered containers','Low','80','21.00','4','Moderate',1,0),(158,'HH-158-4605',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',20,'Student','Secondary','No','No','No','Covered containers','Low','80','21.00','4','Moderate',1,0),(159,'HH-159-6847',-1.6000000,37.0000000,'Taita Taveta','Voi','Male',60,'Retired','Primary','No','No','No','No storage','Low','50','28.50','2','Easy',1,0),(160,'HH-160-0417',-1.6000000,37.0000000,'Taita Taveta','Voi','Female',58,'Housewife','Primary','No','No','No','No storage','Low','50','28.50','2','Easy',1,0),(161,'HH-161-1547',0.5000000,38.0000000,'Wajir','Wajir East','Female',40,'Pastoralist','None','Yes','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(162,'HH-162-6484',0.5000000,38.0000000,'Wajir','Wajir East','Male',42,'Pastoralist','None','Yes','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(163,'HH-163-7778',0.5000000,38.0000000,'Wajir','Wajir East','Female',18,'None','None','No','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(164,'HH-164-9438',0.5000000,38.0000000,'Wajir','Wajir East','Male',15,'None','None','No','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(165,'HH-165-3857',0.5000000,38.0000000,'Wajir','Wajir East','Female',8,'None','None','No','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(166,'HH-166-0973',0.5000000,38.0000000,'Wajir','Wajir East','Male',3,'None','None','No','No','No','Open containers','High','200','33.00','6','Difficult',1,0),(167,'HH-167-3295',-0.2000000,35.5000000,'Nyamira','Manga','Male',35,'Farmer','Secondary','No','No','No','Covered containers','Moderate','105','22.00','5','Moderate',1,0),(168,'HH-168-3557',-0.2000000,35.5000000,'Nyamira','Manga','Female',33,'Housewife','Primary','No','No','No','Covered containers','Moderate','105','22.00','5','Moderate',1,0),(169,'HH-169-7898',-0.2000000,35.5000000,'Nyamira','Manga','Male',10,'Student','Primary','No','No','No','Covered containers','Moderate','105','22.00','5','Moderate',1,0),(170,'HH-170-8822',-0.2000000,35.5000000,'Nyamira','Manga','Female',7,'None','None','No','No','No','Covered containers','Moderate','105','22.00','5','Moderate',1,0),(171,'HH-171-0413',-0.2000000,35.5000000,'Nyamira','Manga','Male',2,'None','None','No','No','No','Covered containers','Moderate','105','22.00','5','Moderate',1,0),(172,'HH-172-5603',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',48,'Farmer','Primary','No','No','No','No storage','Low','60','20.50','4','Moderate',1,0),(173,'HH-173-6776',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',50,'Farmer','Primary','No','No','No','No storage','Low','60','20.50','4','Moderate',1,0),(174,'HH-174-7073',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',20,'Student','Tertiary','No','No','No','No storage','Low','60','20.50','4','Moderate',1,0),(175,'HH-175-5036',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',18,'Student','Secondary','No','No','No','No storage','Low','60','20.50','4','Moderate',1,0),(176,'HH-176-3963',0.0000000,34.5000000,'Kakamega','Lurambi','Male',40,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','110','23.00','5','Easy',1,0),(177,'HH-177-4707',0.0000000,34.5000000,'Kakamega','Lurambi','Female',38,'Housewife','Secondary','No','No','Yes','Covered containers','Moderate','110','23.00','5','Easy',1,0),(178,'HH-178-1648',0.0000000,34.5000000,'Kakamega','Lurambi','Male',15,'Student','Secondary','No','No','Yes','Covered containers','Moderate','110','23.00','5','Easy',1,0),(179,'HH-179-4117',0.0000000,34.5000000,'Kakamega','Lurambi','Female',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','110','23.00','5','Easy',1,0),(180,'HH-180-5642',0.0000000,34.5000000,'Kakamega','Lurambi','Male',5,'None','None','No','No','Yes','Covered containers','Moderate','110','23.00','5','Easy',1,0),(181,'HH-181-5858',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',55,'Farmer','Primary','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(182,'HH-182-2365',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',58,'Farmer','Primary','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(183,'HH-183-4251',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',25,'Trader','Secondary','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(184,'HH-184-4160',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',22,'Farmer','Secondary','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(185,'HH-185-8050',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',10,'Student','Primary','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(186,'HH-186-7769',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',5,'None','None','No','No','No','Open containers','High','90','27.50','6','Difficult',1,0),(187,'HH-187-4695',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',40,'Civil Servant','Tertiary','No','No','No','Covered containers','Low','70','19.00','4','Easy',1,0),(188,'HH-188-0168',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',38,'Teacher','Tertiary','No','No','No','Covered containers','Low','70','19.00','4','Easy',1,0),(189,'HH-189-6755',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',12,'Student','Primary','No','No','No','Covered containers','Low','70','19.00','4','Easy',1,0),(190,'HH-190-3270',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',8,'Student','Primary','No','No','No','Covered containers','Low','70','19.00','4','Easy',1,0),(191,'HH-191-6088',0.1000000,34.2000000,'Bungoma','Kimilili','Female',50,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','23.00','5','Moderate',1,0),(192,'HH-192-0631',0.1000000,34.2000000,'Bungoma','Kimilili','Male',52,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','23.00','5','Moderate',1,0),(193,'HH-193-4892',0.1000000,34.2000000,'Bungoma','Kimilili','Female',20,'Student','Secondary','No','No','Yes','Covered containers','Moderate','120','23.00','5','Moderate',1,0),(194,'HH-194-2565',0.1000000,34.2000000,'Bungoma','Kimilili','Male',18,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','120','23.00','5','Moderate',1,0),(195,'HH-195-8149',0.1000000,34.2000000,'Bungoma','Kimilili','Female',10,'Student','Primary','No','No','Yes','Covered containers','Moderate','120','23.00','5','Moderate',1,0),(196,'HH-196-3052',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',35,'Rice Farmer','Secondary','No','No','No','Covered containers','Moderate','80','24.00','4','Easy',1,0),(197,'HH-197-0812',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',33,'Housewife','Primary','No','No','No','Covered containers','Moderate','80','24.00','4','Easy',1,0),(198,'HH-198-4905',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',10,'Student','Primary','No','No','No','Covered containers','Moderate','80','24.00','4','Easy',1,0),(199,'HH-199-2089',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',5,'None','None','No','No','No','Covered containers','Moderate','80','24.00','4','Easy',1,0),(200,'HH-200-5730',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',45,'Farmer','Primary','No','No','No','No storage','Low','75','20.00','5','Moderate',1,0),(201,'HH-201-2384',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',47,'Farmer','Primary','No','No','No','No storage','Low','75','20.00','5','Moderate',1,0),(202,'HH-202-4729',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',20,'Student','Secondary','No','No','No','No storage','Low','75','20.00','5','Moderate',1,0),(203,'HH-203-6493',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',18,'Farmer','Secondary','No','No','No','No storage','Low','75','20.00','5','Moderate',1,0),(204,'HH-204-8282',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',10,'Student','Primary','No','No','No','No storage','Low','75','20.00','5','Moderate',1,0),(205,'HH-205-1928',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',28,'Office Worker','Tertiary','No','No','No','Covered containers','Moderate','115','24.20','3','Easy',1,0),(206,'HH-206-4796',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',30,'Teacher','Tertiary','No','No','No','Covered containers','Moderate','115','24.20','3','Easy',1,0),(207,'HH-207-8196',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',2,'None','None','No','No','No','Covered containers','Moderate','115','24.20','3','Easy',1,0),(208,'HH-208-6591',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',60,'Retired','Primary','No','No','No','No storage','Low','65','19.80','2','Moderate',1,0),(209,'HH-209-8367',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',58,'Housewife','Primary','No','No','No','No storage','Low','65','19.80','2','Moderate',1,0),(210,'HH-210-2065',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',35,'Entrepreneur','Secondary','No','No','No','Covered containers','High','45','23.50','4','Easy',1,0),(211,'HH-211-5222',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',38,'IT Professional','Tertiary','No','No','No','Covered containers','High','45','23.50','4','Easy',1,0),(212,'HH-212-9915',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',10,'Student','Primary','No','No','No','Covered containers','High','45','23.50','4','Easy',1,0),(213,'HH-213-3909',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',5,'None','None','No','No','No','Covered containers','High','45','23.50','4','Easy',1,0),(214,'HH-214-9801',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',70,'Pastoralist','None','Yes','No','Yes','Open containers','High','170','28.00','5','Difficult',1,0),(215,'HH-215-7278',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',68,'Housewife','None','Yes','No','Yes','Open containers','High','170','28.00','5','Difficult',1,0),(216,'HH-216-6989',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',30,'Pastoralist','Primary','No','No','Yes','Open containers','High','170','28.00','5','Difficult',1,0),(217,'HH-217-3112',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',25,'None','Primary','No','No','Yes','Open containers','High','170','28.00','5','Difficult',1,0),(218,'HH-218-4591',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',8,'None','None','No','No','Yes','Open containers','High','170','28.00','5','Difficult',1,0),(219,'HH-219-3621',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',50,'Fisher','Primary','No','Yes','Yes','Open containers','High','140','28.90','4','Moderate',1,0),(220,'HH-220-4330',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',52,'Fisher','Primary','No','Yes','Yes','Open containers','High','140','28.90','4','Moderate',1,0),(221,'HH-221-0790',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',20,'Student','Secondary','No','No','Yes','Open containers','High','140','28.90','4','Moderate',1,0),(222,'HH-222-0959',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',15,'Student','Primary','No','No','Yes','Open containers','High','140','28.90','4','Moderate',1,0),(223,'HH-223-2428',0.2833000,34.7500000,'Bungoma','Bungoma Central','Male',70,'Retired','Primary','No','No','Yes','Covered containers','Moderate','95','21.80','2','Easy',1,0),(224,'HH-224-9263',0.2833000,34.7500000,'Bungoma','Bungoma Central','Female',68,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','95','21.80','2','Easy',1,0),(225,'HH-225-9030',-0.7833000,35.0000000,'Narok','Narok North','Female',35,'Trader','Primary','No','No','No','No storage','Low','55','25.30','5','Difficult',1,0),(226,'HH-226-7364',-0.7833000,35.0000000,'Narok','Narok North','Male',38,'Trader','Primary','No','No','No','No storage','Low','55','25.30','5','Difficult',1,0),(227,'HH-227-9729',-0.7833000,35.0000000,'Narok','Narok North','Female',10,'Student','Primary','No','No','No','No storage','Low','55','25.30','5','Difficult',1,0),(228,'HH-228-6552',-0.7833000,35.0000000,'Narok','Narok North','Male',7,'None','None','No','No','No','No storage','Low','55','25.30','5','Difficult',1,0),(229,'HH-229-3573',-0.7833000,35.0000000,'Narok','Narok North','Female',2,'None','None','No','No','No','No storage','Low','55','25.30','5','Difficult',1,0),(230,'HH-230-8209',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',55,'Farmer','Secondary','No','No','No','Covered containers','Moderate','75','20.80','4','Easy',1,0),(231,'HH-231-0327',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',52,'Housewife','Primary','No','No','No','Covered containers','Moderate','75','20.80','4','Easy',1,0),(232,'HH-232-7008',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',20,'Student','Tertiary','No','No','No','Covered containers','Moderate','75','20.80','4','Easy',1,0),(233,'HH-233-4060',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',15,'Student','Secondary','No','No','No','Covered containers','Moderate','75','20.80','4','Easy',1,0),(234,'HH-234-9277',2.8000000,36.0000000,'Turkana','Turkana North','Male',75,'Pastoralist','None','Yes','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(235,'HH-235-4204',2.8000000,36.0000000,'Turkana','Turkana North','Female',72,'Housewife','None','Yes','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(236,'HH-236-3190',2.8000000,36.0000000,'Turkana','Turkana North','Male',40,'Pastoralist','None','Yes','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(237,'HH-237-3338',2.8000000,36.0000000,'Turkana','Turkana North','Female',38,'Housewife','None','No','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(238,'HH-238-7121',2.8000000,36.0000000,'Turkana','Turkana North','Male',12,'Student','Primary','No','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(239,'HH-239-5592',2.8000000,36.0000000,'Turkana','Turkana North','Female',7,'None','None','No','No','No','Open containers','High','190','30.20','6','Difficult',1,0),(240,'HH-240-6599',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',30,'Shopkeeper','Secondary','No','No','No','Covered containers','Moderate','35','25.80','3','Easy',1,0),(241,'HH-241-6219',-0.6000000,37.0000000,'Machakos','Machakos Town','Male',33,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','35','25.80','3','Easy',1,0),(242,'HH-242-1299',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',5,'None','None','No','No','No','Covered containers','Moderate','35','25.80','3','Easy',1,0),(243,'HH-243-7840',0.0000000,37.9000000,'Meru','Imenti South','Male',60,'Farmer','Primary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(244,'HH-244-5300',0.0000000,37.9000000,'Meru','Imenti South','Female',55,'Housewife','Primary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(245,'HH-245-2981',0.0000000,37.9000000,'Meru','Imenti South','Male',30,'Farmer','Secondary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(246,'HH-246-9007',0.0000000,37.9000000,'Meru','Imenti South','Female',25,'Student','Secondary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(247,'HH-247-6090',0.0000000,37.9000000,'Meru','Imenti South','Male',18,'Student','Primary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(248,'HH-248-3433',0.0000000,37.9000000,'Meru','Imenti South','Female',10,'Student','Primary','No','No','Yes','Open containers','Moderate','85','22.80','6','Moderate',1,0),(249,'HH-249-8893',-2.1000000,40.0000000,'Lamu','Lamu West','Female',45,'Fisher','Primary','No','Yes','Yes','Open containers','High','150','28.50','5','Difficult',1,0),(250,'HH-250-4168',-2.1000000,40.0000000,'Lamu','Lamu West','Male',47,'Fisher','Primary','No','Yes','Yes','Open containers','High','150','28.50','5','Difficult',1,0),(251,'HH-251-4163',-2.1000000,40.0000000,'Lamu','Lamu West','Female',20,'Student','Secondary','No','No','Yes','Open containers','High','150','28.50','5','Difficult',1,0),(252,'HH-252-8308',-2.1000000,40.0000000,'Lamu','Lamu West','Male',12,'Student','Primary','No','No','Yes','Open containers','High','150','28.50','5','Difficult',1,0),(253,'HH-253-9053',-2.1000000,40.0000000,'Lamu','Lamu West','Female',7,'None','None','No','No','Yes','Open containers','High','150','28.50','5','Difficult',1,0),(254,'HH-254-0342',-0.6900000,34.2500000,'Siaya','Bondo','Male',42,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(255,'HH-255-4550',-0.6900000,34.2500000,'Siaya','Bondo','Female',40,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(256,'HH-256-1726',-0.6900000,34.2500000,'Siaya','Bondo','Male',18,'Student','Secondary','No','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(257,'HH-257-4982',-0.6900000,34.2500000,'Siaya','Bondo','Female',15,'Student','Primary','Yes','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(258,'HH-258-9732',-0.6900000,34.2500000,'Siaya','Bondo','Male',10,'Student','Primary','No','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(259,'HH-259-3712',-0.6900000,34.2500000,'Siaya','Bondo','Female',7,'None','None','No','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(260,'HH-260-9368',-0.6900000,34.2500000,'Siaya','Bondo','Male',3,'None','None','No','No','Yes','Covered containers','Moderate','125','24.80','7','Moderate',1,0),(261,'HH-261-5701',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',55,'Farmer','Primary','No','No','No','No storage','Low','60','19.20','3','Moderate',1,0),(262,'HH-262-0402',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Male',57,'Farmer','Primary','No','No','No','No storage','Low','60','19.20','3','Moderate',1,0),(263,'HH-263-4910',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',22,'Student','Tertiary','No','No','No','No storage','Low','60','19.20','3','Moderate',1,0),(264,'HH-264-3342',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',45,'Pastoralist','None','Yes','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(265,'HH-265-1981',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',43,'Housewife','None','Yes','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(266,'HH-266-9878',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',18,'Student','Primary','No','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(267,'HH-267-3448',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',15,'None','None','No','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(268,'HH-268-7608',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',10,'None','None','No','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(269,'HH-269-7698',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',5,'None','None','No','No','No','Open containers','High','160','26.80','6','Difficult',1,0),(270,'HH-270-5663',-0.1000000,37.5000000,'Embu','Embu West','Female',38,'Trader','Secondary','No','No','No','Covered containers','Moderate','70','22.30','4','Easy',1,0),(271,'HH-271-5222',-0.1000000,37.5000000,'Embu','Embu West','Male',40,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','70','22.30','4','Easy',1,0),(272,'HH-272-9124',-0.1000000,37.5000000,'Embu','Embu West','Female',12,'Student','Primary','No','No','No','Covered containers','Moderate','70','22.30','4','Easy',1,0),(273,'HH-273-9953',-0.1000000,37.5000000,'Embu','Embu West','Male',7,'None','None','No','No','No','Covered containers','Moderate','70','22.30','4','Easy',1,0),(274,'HH-274-2394',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',50,'Farmer','Primary','No','No','Yes','Open containers','High','105','26.80','5','Moderate',1,0),(275,'HH-275-2113',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',48,'Housewife','Primary','No','No','Yes','Open containers','High','105','26.80','5','Moderate',1,0),(276,'HH-276-3381',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',25,'Student','Secondary','No','No','Yes','Open containers','High','105','26.80','5','Moderate',1,0),(277,'HH-277-0569',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',20,'Student','Primary','No','No','Yes','Open containers','High','105','26.80','5','Moderate',1,0),(278,'HH-278-2702',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',10,'None','None','No','No','Yes','Open containers','High','105','26.80','5','Moderate',1,0),(279,'HH-279-1805',0.7500000,34.5000000,'Kakamega','Butere','Female',60,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','130','23.80','4','Easy',1,0),(280,'HH-280-0917',0.7500000,34.5000000,'Kakamega','Butere','Male',62,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','130','23.80','4','Easy',1,0),(281,'HH-281-9171',0.7500000,34.5000000,'Kakamega','Butere','Female',30,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','130','23.80','4','Easy',1,0),(282,'HH-282-3107',0.7500000,34.5000000,'Kakamega','Butere','Male',28,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','130','23.80','4','Easy',1,0),(283,'HH-283-8019',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Male',35,'Salesperson','Secondary','No','No','No','No storage','Low','50','21.30','3','Easy',1,0),(284,'HH-284-0777',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',33,'Hairdresser','Secondary','No','No','No','No storage','Low','50','21.30','3','Easy',1,0),(285,'HH-285-9828',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',7,'None','None','No','No','No','No storage','Low','50','21.30','3','Easy',1,0),(286,'HH-286-6811',1.5000000,37.5000000,'Marsabit','Moyale','Female',65,'Pastoralist','None','Yes','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(287,'HH-287-4572',1.5000000,37.5000000,'Marsabit','Moyale','Male',68,'Pastoralist','None','Yes','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(288,'HH-288-2425',1.5000000,37.5000000,'Marsabit','Moyale','Female',35,'Housewife','None','No','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(289,'HH-289-8409',1.5000000,37.5000000,'Marsabit','Moyale','Male',33,'Pastoralist','None','Yes','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(290,'HH-290-4771',1.5000000,37.5000000,'Marsabit','Moyale','Female',18,'None','Primary','No','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(291,'HH-291-8627',1.5000000,37.5000000,'Marsabit','Moyale','Male',12,'None','None','No','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(292,'HH-292-8825',1.5000000,37.5000000,'Marsabit','Moyale','Female',7,'None','None','No','No','No','Open containers','High','180','30.80','7','Difficult',1,0),(293,'HH-293-8244',-0.0500000,35.3000000,'Kericho','Kericho East','Male',45,'Farmer','Secondary','No','No','No','Covered containers','Moderate','90','20.50','5','Moderate',1,0),(294,'HH-294-4746',-0.0500000,35.3000000,'Kericho','Kericho East','Female',43,'Housewife','Primary','No','No','No','Covered containers','Moderate','90','20.50','5','Moderate',1,0),(295,'HH-295-9000',-0.0500000,35.3000000,'Kericho','Kericho East','Male',18,'Student','Secondary','No','No','No','Covered containers','Moderate','90','20.50','5','Moderate',1,0),(296,'HH-296-0760',-0.0500000,35.3000000,'Kericho','Kericho East','Female',12,'Student','Primary','No','No','No','Covered containers','Moderate','90','20.50','5','Moderate',1,0),(297,'HH-297-6803',-0.0500000,35.3000000,'Kericho','Kericho East','Male',7,'None','None','No','No','No','Covered containers','Moderate','90','20.50','5','Moderate',1,0),(298,'HH-298-1735',0.6000000,39.0000000,'Garissa','Fafi','Female',55,'Trader','None','Yes','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(299,'HH-299-8268',0.6000000,39.0000000,'Garissa','Fafi','Male',60,'Trader','None','Yes','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(300,'HH-300-6133',0.6000000,39.0000000,'Garissa','Fafi','Female',30,'None','Primary','No','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(301,'HH-301-5864',0.6000000,39.0000000,'Garissa','Fafi','Male',25,'None','Primary','Yes','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(302,'HH-302-0922',0.6000000,39.0000000,'Garissa','Fafi','Female',15,'None','None','No','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(303,'HH-303-7016',0.6000000,39.0000000,'Garissa','Fafi','Male',10,'None','None','No','No','No','Open containers','High','200','31.80','6','Difficult',1,0),(304,'HH-304-2315',-1.0000000,36.5000000,'Kiambu','Limuru','Male',40,'Driver','Secondary','No','No','No','Covered containers','Low','55','19.80','4','Easy',1,0),(305,'HH-305-0530',-1.0000000,36.5000000,'Kiambu','Limuru','Female',38,'Hairdresser','Secondary','No','No','No','Covered containers','Low','55','19.80','4','Easy',1,0),(306,'HH-306-5703',-1.0000000,36.5000000,'Kiambu','Limuru','Male',10,'Student','Primary','No','No','No','Covered containers','Low','55','19.80','4','Easy',1,0),(307,'HH-307-6928',-1.0000000,36.5000000,'Kiambu','Limuru','Female',5,'None','None','No','No','No','Covered containers','Low','55','19.80','4','Easy',1,0),(308,'HH-308-7530',0.0000000,34.0000000,'Busia','Samia','Female',52,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(309,'HH-309-6865',0.0000000,34.0000000,'Busia','Samia','Male',55,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(310,'HH-310-1736',0.0000000,34.0000000,'Busia','Samia','Female',22,'Student','Secondary','No','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(311,'HH-311-8086',0.0000000,34.0000000,'Busia','Samia','Male',20,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(312,'HH-312-5224',0.0000000,34.0000000,'Busia','Samia','Female',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(313,'HH-313-1863',0.0000000,34.0000000,'Busia','Samia','Male',7,'None','None','No','No','Yes','Covered containers','Moderate','125','25.00','6','Moderate',1,0),(314,'HH-314-3643',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',70,'Pastoralist','None','Yes','No','No','Open containers','High','175','28.80','5','Difficult',1,0),(315,'HH-315-2625',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',68,'Housewife','None','Yes','No','No','Open containers','High','175','28.80','5','Difficult',1,0),(316,'HH-316-2196',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',35,'Pastoralist','None','No','No','No','Open containers','High','175','28.80','5','Difficult',1,0),(317,'HH-317-3108',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',33,'Housewife','None','No','No','No','Open containers','High','175','28.80','5','Difficult',1,0),(318,'HH-318-8953',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',12,'None','None','No','No','No','Open containers','High','175','28.80','5','Difficult',1,0),(319,'HH-319-5439',-0.5000000,37.0000000,'Makueni','Makueni','Female',42,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','80','26.20','5','Moderate',1,0),(320,'HH-320-0336',-0.5000000,37.0000000,'Makueni','Makueni','Male',45,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','80','26.20','5','Moderate',1,0),(321,'HH-321-5364',-0.5000000,37.0000000,'Makueni','Makueni','Female',18,'Student','Secondary','No','No','Yes','Covered containers','Moderate','80','26.20','5','Moderate',1,0),(322,'HH-322-5811',-0.5000000,37.0000000,'Makueni','Makueni','Male',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','80','26.20','5','Moderate',1,0),(323,'HH-323-2964',-0.5000000,37.0000000,'Makueni','Makueni','Female',7,'None','None','No','No','Yes','Covered containers','Moderate','80','26.20','5','Moderate',1,0),(324,'HH-324-7387',-1.5000000,38.0000000,'Tana River','Galole','Male',60,'Fisher','Primary','Yes','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(325,'HH-325-8046',-1.5000000,38.0000000,'Tana River','Galole','Female',58,'Housewife','Primary','Yes','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(326,'HH-326-8067',-1.5000000,38.0000000,'Tana River','Galole','Male',30,'Fisher','Secondary','No','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(327,'HH-327-6199',-1.5000000,38.0000000,'Tana River','Galole','Female',28,'None','Primary','No','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(328,'HH-328-6792',-1.5000000,38.0000000,'Tana River','Galole','Male',12,'Student','None','No','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(329,'HH-329-5365',-1.5000000,38.0000000,'Tana River','Galole','Female',7,'None','None','No','No','Yes','Open containers','High','160','29.30','6','Difficult',1,0),(330,'HH-330-6451',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',35,'Trader','Secondary','Yes','No','Yes','Covered containers','Moderate','120','25.50','4','Easy',1,0),(331,'HH-331-6161',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',38,'Fisher','Secondary','Yes','No','Yes','Covered containers','Moderate','120','25.50','4','Easy',1,0),(332,'HH-332-1452',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',10,'Student','Primary','No','No','Yes','Covered containers','Moderate','120','25.50','4','Easy',1,0),(333,'HH-333-8778',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',5,'None','None','No','No','Yes','Covered containers','Moderate','120','25.50','4','Easy',1,0),(334,'HH-334-9534',0.5000000,36.0000000,'Baringo','Mogotio','Male',50,'Pastoralist','None','Yes','No','No','Open containers','High','185','27.80','5','Difficult',1,0),(335,'HH-335-1336',0.5000000,36.0000000,'Baringo','Mogotio','Female',48,'Housewife','None','Yes','No','No','Open containers','High','185','27.80','5','Difficult',1,0),(336,'HH-336-8077',0.5000000,36.0000000,'Baringo','Mogotio','Male',25,'Pastoralist','Primary','No','No','No','Open containers','High','185','27.80','5','Difficult',1,0),(337,'HH-337-6377',0.5000000,36.0000000,'Baringo','Mogotio','Female',20,'None','None','No','No','No','Open containers','High','185','27.80','5','Difficult',1,0),(338,'HH-338-7657',0.5000000,36.0000000,'Baringo','Mogotio','Male',10,'None','None','No','No','No','Open containers','High','185','27.80','5','Difficult',1,0),(339,'HH-339-9155',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',60,'Farmer','Primary','No','No','No','Covered containers','Low','65','18.30','3','Moderate',1,0),(340,'HH-340-2804',-0.4500000,36.2000000,'Nyandarua','Kinangop','Male',62,'Farmer','Primary','No','No','No','Covered containers','Low','65','18.30','3','Moderate',1,0),(341,'HH-341-6556',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',30,'Teacher','Tertiary','No','No','No','Covered containers','Low','65','18.30','3','Moderate',1,0),(342,'HH-342-4367',-1.2000000,37.8000000,'Kwale','Kinango','Male',45,'Farmer','Primary','Yes','No','Yes','Open containers','High','145','28.80','5','Difficult',1,0),(343,'HH-343-2169',-1.2000000,37.8000000,'Kwale','Kinango','Female',43,'Housewife','Primary','No','No','Yes','Open containers','High','145','28.80','5','Difficult',1,0),(344,'HH-344-7742',-1.2000000,37.8000000,'Kwale','Kinango','Male',18,'Student','Secondary','No','No','Yes','Open containers','High','145','28.80','5','Difficult',1,0),(345,'HH-345-2205',-1.2000000,37.8000000,'Kwale','Kinango','Female',15,'Student','Primary','No','No','Yes','Open containers','High','145','28.80','5','Difficult',1,0),(346,'HH-346-7801',-1.2000000,37.8000000,'Kwale','Kinango','Male',7,'None','None','No','No','Yes','Open containers','High','145','28.80','5','Difficult',1,0),(347,'HH-347-2389',0.5500000,34.7000000,'Vihiga','Sabatia','Female',35,'Businesswoman','Secondary','No','No','Yes','Covered containers','Moderate','110','23.30','4','Easy',1,0),(348,'HH-348-8543',0.5500000,34.7000000,'Vihiga','Sabatia','Male',38,'Carpenter','Secondary','No','No','Yes','Covered containers','Moderate','110','23.30','4','Easy',1,0),(349,'HH-349-5548',0.5500000,34.7000000,'Vihiga','Sabatia','Female',10,'Student','Primary','No','No','Yes','Covered containers','Moderate','110','23.30','4','Easy',1,0),(350,'HH-350-2112',0.5500000,34.7000000,'Vihiga','Sabatia','Male',5,'None','None','No','No','Yes','Covered containers','Moderate','110','23.30','4','Easy',1,0),(351,'HH-351-3917',-0.7000000,37.5000000,'Kwale','Msambweni','Male',50,'Fisher','Primary','No','Yes','Yes','Open containers','High','150','29.00','5','Difficult',1,0),(352,'HH-352-3249',-0.7000000,37.5000000,'Kwale','Msambweni','Female',48,'Trader','Primary','No','Yes','Yes','Open containers','High','150','29.00','5','Difficult',1,0),(353,'HH-353-4492',-0.7000000,37.5000000,'Kwale','Msambweni','Male',25,'Student','Secondary','No','No','Yes','Open containers','High','150','29.00','5','Difficult',1,0),(354,'HH-354-2717',-0.7000000,37.5000000,'Kwale','Msambweni','Female',20,'Student','Primary','No','No','Yes','Open containers','High','150','29.00','5','Difficult',1,0),(355,'HH-355-0109',-0.7000000,37.5000000,'Kwale','Msambweni','Male',10,'None','None','No','No','Yes','Open containers','High','150','29.00','5','Difficult',1,0),(356,'HH-356-2392',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',55,'Farmer','Primary','No','No','No','Covered containers','Low','75','20.80','4','Moderate',1,0),(357,'HH-357-1636',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',58,'Farmer','Primary','No','No','No','Covered containers','Low','75','20.80','4','Moderate',1,0),(358,'HH-358-1004',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',30,'Teacher','Tertiary','No','No','No','Covered containers','Low','75','20.80','4','Moderate',1,0),(359,'HH-359-0113',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',25,'Student','Secondary','No','No','No','Covered containers','Low','75','20.80','4','Moderate',1,0),(360,'HH-360-7554',-1.6000000,37.0000000,'Taita Taveta','Voi','Male',65,'Retired','Primary','No','No','No','No storage','Low','45','28.30','2','Easy',1,0),(361,'HH-361-7429',-1.6000000,37.0000000,'Taita Taveta','Voi','Female',63,'Housewife','Primary','No','No','No','No storage','Low','45','28.30','2','Easy',1,0),(362,'HH-362-4485',0.5000000,38.0000000,'Wajir','Wajir East','Female',45,'Pastoralist','None','Yes','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(363,'HH-363-0138',0.5000000,38.0000000,'Wajir','Wajir East','Male',48,'Pastoralist','None','Yes','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(364,'HH-364-7236',0.5000000,38.0000000,'Wajir','Wajir East','Female',20,'None','None','No','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(365,'HH-365-5764',0.5000000,38.0000000,'Wajir','Wajir East','Male',18,'None','None','No','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(366,'HH-366-7115',0.5000000,38.0000000,'Wajir','Wajir East','Female',10,'None','None','No','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(367,'HH-367-8282',0.5000000,38.0000000,'Wajir','Wajir East','Male',5,'None','None','No','No','No','Open containers','High','190','32.80','6','Difficult',1,0),(368,'HH-368-0068',-0.2000000,35.5000000,'Nyamira','Manga','Male',40,'Farmer','Secondary','No','No','No','Covered containers','Moderate','100','21.80','5','Moderate',1,0),(369,'HH-369-5492',-0.2000000,35.5000000,'Nyamira','Manga','Female',38,'Housewife','Primary','No','No','No','Covered containers','Moderate','100','21.80','5','Moderate',1,0),(370,'HH-370-7255',-0.2000000,35.5000000,'Nyamira','Manga','Male',12,'Student','Primary','No','No','No','Covered containers','Moderate','100','21.80','5','Moderate',1,0),(371,'HH-371-9803',-0.2000000,35.5000000,'Nyamira','Manga','Female',10,'None','None','No','No','No','Covered containers','Moderate','100','21.80','5','Moderate',1,0),(372,'HH-372-7248',-0.2000000,35.5000000,'Nyamira','Manga','Male',5,'None','None','No','No','No','Covered containers','Moderate','100','21.80','5','Moderate',1,0),(373,'HH-373-6831',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',52,'Farmer','Primary','No','No','No','No storage','Low','55','20.30','4','Moderate',1,0),(374,'HH-374-2412',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',55,'Farmer','Primary','No','No','No','No storage','Low','55','20.30','4','Moderate',1,0),(375,'HH-375-1567',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',22,'Student','Tertiary','No','No','No','No storage','Low','55','20.30','4','Moderate',1,0),(376,'HH-376-0600',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',20,'Student','Secondary','No','No','No','No storage','Low','55','20.30','4','Moderate',1,0),(377,'HH-377-8300',0.0000000,34.5000000,'Kakamega','Lurambi','Male',45,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','105','22.80','5','Easy',1,0),(378,'HH-378-9700',0.0000000,34.5000000,'Kakamega','Lurambi','Female',43,'Housewife','Secondary','No','No','Yes','Covered containers','Moderate','105','22.80','5','Easy',1,0),(379,'HH-379-3600',0.0000000,34.5000000,'Kakamega','Lurambi','Male',18,'Student','Secondary','No','No','Yes','Covered containers','Moderate','105','22.80','5','Easy',1,0),(380,'HH-380-8901',0.0000000,34.5000000,'Kakamega','Lurambi','Female',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','105','22.80','5','Easy',1,0),(381,'HH-381-3706',0.0000000,34.5000000,'Kakamega','Lurambi','Male',7,'None','None','No','No','Yes','Covered containers','Moderate','105','22.80','5','Easy',1,0),(382,'HH-382-1828',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',60,'Farmer','Primary','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(383,'HH-383-8020',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',62,'Farmer','Primary','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(384,'HH-384-4618',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',30,'Trader','Secondary','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(385,'HH-385-9029',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',28,'Farmer','Secondary','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(386,'HH-386-1292',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',12,'Student','Primary','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(387,'HH-387-9375',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',7,'None','None','No','No','No','Open containers','High','85','27.30','6','Difficult',1,0),(388,'HH-388-2998',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',45,'Civil Servant','Tertiary','No','No','No','Covered containers','Low','65','18.80','4','Easy',1,0),(389,'HH-389-6868',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',43,'Teacher','Tertiary','No','No','No','Covered containers','Low','65','18.80','4','Easy',1,0),(390,'HH-390-5346',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',15,'Student','Primary','No','No','No','Covered containers','Low','65','18.80','4','Easy',1,0),(391,'HH-391-6124',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',10,'Student','Primary','No','No','No','Covered containers','Low','65','18.80','4','Easy',1,0),(392,'HH-392-4583',0.1000000,34.2000000,'Bungoma','Kimilili','Female',55,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','115','22.80','5','Moderate',1,0),(393,'HH-393-4543',0.1000000,34.2000000,'Bungoma','Kimilili','Male',57,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','115','22.80','5','Moderate',1,0),(394,'HH-394-8965',0.1000000,34.2000000,'Bungoma','Kimilili','Female',22,'Student','Secondary','No','No','Yes','Covered containers','Moderate','115','22.80','5','Moderate',1,0),(395,'HH-395-1199',0.1000000,34.2000000,'Bungoma','Kimilili','Male',20,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','115','22.80','5','Moderate',1,0),(396,'HH-396-9101',0.1000000,34.2000000,'Bungoma','Kimilili','Female',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','115','22.80','5','Moderate',1,0),(397,'HH-397-1906',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',40,'Rice Farmer','Secondary','No','No','No','Covered containers','Moderate','75','23.80','4','Easy',1,0),(398,'HH-398-2229',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',38,'Housewife','Primary','No','No','No','Covered containers','Moderate','75','23.80','4','Easy',1,0),(399,'HH-399-5426',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',12,'Student','Primary','No','No','No','Covered containers','Moderate','75','23.80','4','Easy',1,0),(400,'HH-400-0445',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',7,'None','None','No','No','No','Covered containers','Moderate','75','23.80','4','Easy',1,0),(401,'HH-401-5947',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',50,'Farmer','Primary','No','No','No','No storage','Low','70','19.80','5','Moderate',1,0),(402,'HH-402-8402',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',52,'Farmer','Primary','No','No','No','No storage','Low','70','19.80','5','Moderate',1,0),(403,'HH-403-4170',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',22,'Student','Secondary','No','No','No','No storage','Low','70','19.80','5','Moderate',1,0),(404,'HH-404-5645',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',20,'Farmer','Secondary','No','No','No','No storage','Low','70','19.80','5','Moderate',1,0),(405,'HH-405-5712',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',12,'Student','Primary','No','No','No','No storage','Low','70','19.80','5','Moderate',1,0),(406,'HH-406-1629',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',30,'Office Worker','Tertiary','No','No','No','Covered containers','Moderate','110','24.00','3','Easy',1,0),(407,'HH-407-1006',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',32,'Teacher','Tertiary','No','No','No','Covered containers','Moderate','110','24.00','3','Easy',1,0),(408,'HH-408-0146',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',3,'None','None','No','No','No','Covered containers','Moderate','110','24.00','3','Easy',1,0),(409,'HH-409-7711',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',65,'Retired','Primary','No','No','No','No storage','Low','60','19.60','2','Moderate',1,0),(410,'HH-410-8118',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',63,'Housewife','Primary','No','No','No','No storage','Low','60','19.60','2','Moderate',1,0),(411,'HH-411-7458',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',40,'Entrepreneur','Secondary','No','No','No','Covered containers','High','40','23.30','4','Easy',1,0),(412,'HH-412-2935',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',42,'IT Professional','Tertiary','No','No','No','Covered containers','High','40','23.30','4','Easy',1,0),(413,'HH-413-2300',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',12,'Student','Primary','No','No','No','Covered containers','High','40','23.30','4','Easy',1,0),(414,'HH-414-2699',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',7,'None','None','No','No','No','Covered containers','High','40','23.30','4','Easy',1,0),(415,'HH-415-6593',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',75,'Pastoralist','None','Yes','No','Yes','Open containers','High','160','27.80','5','Difficult',1,0),(416,'HH-416-4870',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',72,'Housewife','None','Yes','No','Yes','Open containers','High','160','27.80','5','Difficult',1,0),(417,'HH-417-4569',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',35,'Pastoralist','Primary','No','No','Yes','Open containers','High','160','27.80','5','Difficult',1,0),(418,'HH-418-8239',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',30,'None','Primary','No','No','Yes','Open containers','High','160','27.80','5','Difficult',1,0),(419,'HH-419-7485',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',10,'None','None','No','No','Yes','Open containers','High','160','27.80','5','Difficult',1,0),(420,'HH-420-2712',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',55,'Fisher','Primary','No','Yes','Yes','Open containers','High','130','28.70','4','Moderate',1,0),(421,'HH-421-1104',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',57,'Fisher','Primary','No','Yes','Yes','Open containers','High','130','28.70','4','Moderate',1,0),(422,'HH-422-7383',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',22,'Student','Secondary','No','No','Yes','Open containers','High','130','28.70','4','Moderate',1,0),(423,'HH-423-3605',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',18,'Student','Primary','No','No','Yes','Open containers','High','130','28.70','4','Moderate',1,0),(424,'HH-424-5877',0.2833000,34.7500000,'Bungoma','Bungoma Central','Male',75,'Retired','Primary','No','No','Yes','Covered containers','Moderate','90','21.60','2','Easy',1,0),(425,'HH-425-8571',0.2833000,34.7500000,'Bungoma','Bungoma Central','Female',73,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','90','21.60','2','Easy',1,0),(426,'HH-426-5225',-0.7833000,35.0000000,'Narok','Narok North','Female',40,'Trader','Primary','No','No','No','No storage','Low','50','25.10','5','Difficult',1,0),(427,'HH-427-0411',-0.7833000,35.0000000,'Narok','Narok North','Male',42,'Trader','Primary','No','No','No','No storage','Low','50','25.10','5','Difficult',1,0),(428,'HH-428-6381',-0.7833000,35.0000000,'Narok','Narok North','Female',12,'Student','Primary','No','No','No','No storage','Low','50','25.10','5','Difficult',1,0),(429,'HH-429-0673',-0.7833000,35.0000000,'Narok','Narok North','Male',10,'None','None','No','No','No','No storage','Low','50','25.10','5','Difficult',1,0),(430,'HH-430-4223',-0.7833000,35.0000000,'Narok','Narok North','Female',5,'None','None','No','No','No','No storage','Low','50','25.10','5','Difficult',1,0),(431,'HH-431-9096',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',60,'Farmer','Secondary','No','No','No','Covered containers','Moderate','70','20.60','4','Easy',1,0),(432,'HH-432-2810',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',58,'Housewife','Primary','No','No','No','Covered containers','Moderate','70','20.60','4','Easy',1,0),(433,'HH-433-6763',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',22,'Student','Tertiary','No','No','No','Covered containers','Moderate','70','20.60','4','Easy',1,0),(434,'HH-434-5384',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',18,'Student','Secondary','No','No','No','Covered containers','Moderate','70','20.60','4','Easy',1,0),(435,'HH-435-6632',2.8000000,36.0000000,'Turkana','Turkana North','Male',80,'Pastoralist','None','Yes','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(436,'HH-436-7009',2.8000000,36.0000000,'Turkana','Turkana North','Female',78,'Housewife','None','Yes','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(437,'HH-437-5151',2.8000000,36.0000000,'Turkana','Turkana North','Male',45,'Pastoralist','None','Yes','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(438,'HH-438-4727',2.8000000,36.0000000,'Turkana','Turkana North','Female',43,'Housewife','None','No','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(439,'HH-439-8182',2.8000000,36.0000000,'Turkana','Turkana North','Male',15,'Student','Primary','No','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(440,'HH-440-6730',2.8000000,36.0000000,'Turkana','Turkana North','Female',10,'None','None','No','No','No','Open containers','High','180','30.00','6','Difficult',1,0),(441,'HH-441-9105',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',35,'Shopkeeper','Secondary','No','No','No','Covered containers','Moderate','30','25.60','3','Easy',1,0),(442,'HH-442-5333',-0.6000000,37.0000000,'Machakos','Machakos Town','Male',38,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','30','25.60','3','Easy',1,0),(443,'HH-443-9354',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',7,'None','None','No','No','No','Covered containers','Moderate','30','25.60','3','Easy',1,0),(444,'HH-444-0769',0.0000000,37.9000000,'Meru','Imenti South','Male',65,'Farmer','Primary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(445,'HH-445-5784',0.0000000,37.9000000,'Meru','Imenti South','Female',60,'Housewife','Primary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(446,'HH-446-6614',0.0000000,37.9000000,'Meru','Imenti South','Male',35,'Farmer','Secondary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(447,'HH-447-5718',0.0000000,37.9000000,'Meru','Imenti South','Female',30,'Student','Secondary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(448,'HH-448-8748',0.0000000,37.9000000,'Meru','Imenti South','Male',20,'Student','Primary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(449,'HH-449-6587',0.0000000,37.9000000,'Meru','Imenti South','Female',12,'Student','Primary','No','No','Yes','Open containers','Moderate','80','22.60','6','Moderate',1,0),(450,'HH-450-6693',-2.1000000,40.0000000,'Lamu','Lamu West','Female',50,'Fisher','Primary','No','Yes','Yes','Open containers','High','140','28.30','5','Difficult',1,0),(451,'HH-451-3704',-2.1000000,40.0000000,'Lamu','Lamu West','Male',52,'Fisher','Primary','No','Yes','Yes','Open containers','High','140','28.30','5','Difficult',1,0),(452,'HH-452-8443',-2.1000000,40.0000000,'Lamu','Lamu West','Female',25,'Student','Secondary','No','No','Yes','Open containers','High','140','28.30','5','Difficult',1,0),(453,'HH-453-1102',-2.1000000,40.0000000,'Lamu','Lamu West','Male',18,'Student','Primary','No','No','Yes','Open containers','High','140','28.30','5','Difficult',1,0),(454,'HH-454-0184',-2.1000000,40.0000000,'Lamu','Lamu West','Female',10,'None','None','No','No','Yes','Open containers','High','140','28.30','5','Difficult',1,0),(455,'HH-455-7612',-0.6900000,34.2500000,'Siaya','Bondo','Male',48,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(456,'HH-456-7508',-0.6900000,34.2500000,'Siaya','Bondo','Female',46,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(457,'HH-457-4707',-0.6900000,34.2500000,'Siaya','Bondo','Male',20,'Student','Secondary','No','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(458,'HH-458-1011',-0.6900000,34.2500000,'Siaya','Bondo','Female',18,'Student','Primary','Yes','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(459,'HH-459-0934',-0.6900000,34.2500000,'Siaya','Bondo','Male',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(460,'HH-460-1638',-0.6900000,34.2500000,'Siaya','Bondo','Female',10,'None','None','No','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(461,'HH-461-5388',-0.6900000,34.2500000,'Siaya','Bondo','Male',5,'None','None','No','No','Yes','Covered containers','Moderate','120','24.60','7','Moderate',1,0),(462,'HH-462-2027',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',60,'Farmer','Primary','No','No','No','No storage','Low','55','19.00','3','Moderate',1,0),(463,'HH-463-3969',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Male',62,'Farmer','Primary','No','No','No','No storage','Low','55','19.00','3','Moderate',1,0),(464,'HH-464-3768',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',25,'Student','Tertiary','No','No','No','No storage','Low','55','19.00','3','Moderate',1,0),(465,'HH-465-6932',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',50,'Pastoralist','None','Yes','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(466,'HH-466-3359',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',48,'Housewife','None','Yes','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(467,'HH-467-5996',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',20,'Student','Primary','No','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(468,'HH-468-9904',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',18,'None','None','No','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(469,'HH-469-1532',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',12,'None','None','No','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(470,'HH-470-7949',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',7,'None','None','No','No','No','Open containers','High','150','26.60','6','Difficult',1,0),(471,'HH-471-5151',-0.1000000,37.5000000,'Embu','Embu West','Female',42,'Trader','Secondary','No','No','No','Covered containers','Moderate','65','22.10','4','Easy',1,0),(472,'HH-472-1906',-0.1000000,37.5000000,'Embu','Embu West','Male',45,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','65','22.10','4','Easy',1,0),(473,'HH-473-4078',-0.1000000,37.5000000,'Embu','Embu West','Female',15,'Student','Primary','No','No','No','Covered containers','Moderate','65','22.10','4','Easy',1,0),(474,'HH-474-4675',-0.1000000,37.5000000,'Embu','Embu West','Male',10,'None','None','No','No','No','Covered containers','Moderate','65','22.10','4','Easy',1,0),(475,'HH-475-1139',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',55,'Farmer','Primary','No','No','Yes','Open containers','High','100','26.60','5','Moderate',1,0),(476,'HH-476-1673',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',52,'Housewife','Primary','No','No','Yes','Open containers','High','100','26.60','5','Moderate',1,0),(477,'HH-477-4949',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',30,'Student','Secondary','No','No','Yes','Open containers','High','100','26.60','5','Moderate',1,0),(478,'HH-478-9724',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',25,'Student','Primary','No','No','Yes','Open containers','High','100','26.60','5','Moderate',1,0),(479,'HH-479-3776',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',12,'None','None','No','No','Yes','Open containers','High','100','26.60','5','Moderate',1,0),(480,'HH-480-9709',0.7500000,34.5000000,'Kakamega','Butere','Female',65,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','125','23.60','4','Easy',1,0),(481,'HH-481-7214',0.7500000,34.5000000,'Kakamega','Butere','Male',68,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','125','23.60','4','Easy',1,0),(482,'HH-482-6947',0.7500000,34.5000000,'Kakamega','Butere','Female',35,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','125','23.60','4','Easy',1,0),(483,'HH-483-3091',0.7500000,34.5000000,'Kakamega','Butere','Male',33,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','125','23.60','4','Easy',1,0),(484,'HH-484-4617',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Male',40,'Salesperson','Secondary','No','No','No','No storage','Low','45','21.10','3','Easy',1,0),(485,'HH-485-3812',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',38,'Hairdresser','Secondary','No','No','No','No storage','Low','45','21.10','3','Easy',1,0),(486,'HH-486-5209',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',10,'None','None','No','No','No','No storage','Low','45','21.10','3','Easy',1,0),(487,'HH-487-4608',1.5000000,37.5000000,'Marsabit','Moyale','Female',70,'Pastoralist','None','Yes','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(488,'HH-488-7414',1.5000000,37.5000000,'Marsabit','Moyale','Male',72,'Pastoralist','None','Yes','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(489,'HH-489-3245',1.5000000,37.5000000,'Marsabit','Moyale','Female',40,'Housewife','None','No','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(490,'HH-490-3986',1.5000000,37.5000000,'Marsabit','Moyale','Male',38,'Pastoralist','None','Yes','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(491,'HH-491-0195',1.5000000,37.5000000,'Marsabit','Moyale','Female',20,'None','Primary','No','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(492,'HH-492-9016',1.5000000,37.5000000,'Marsabit','Moyale','Male',15,'None','None','No','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(493,'HH-493-4496',1.5000000,37.5000000,'Marsabit','Moyale','Female',10,'None','None','No','No','No','Open containers','High','170','30.60','7','Difficult',1,0),(494,'HH-494-5433',-0.0500000,35.3000000,'Kericho','Kericho East','Male',50,'Farmer','Secondary','No','No','No','Covered containers','Moderate','85','20.30','5','Moderate',1,0),(495,'HH-495-3676',-0.0500000,35.3000000,'Kericho','Kericho East','Female',48,'Housewife','Primary','No','No','No','Covered containers','Moderate','85','20.30','5','Moderate',1,0),(496,'HH-496-2082',-0.0500000,35.3000000,'Kericho','Kericho East','Male',20,'Student','Secondary','No','No','No','Covered containers','Moderate','85','20.30','5','Moderate',1,0),(497,'HH-497-9383',-0.0500000,35.3000000,'Kericho','Kericho East','Female',15,'Student','Primary','No','No','No','Covered containers','Moderate','85','20.30','5','Moderate',1,0),(498,'HH-498-0670',-0.0500000,35.3000000,'Kericho','Kericho East','Male',10,'None','None','No','No','No','Covered containers','Moderate','85','20.30','5','Moderate',1,0),(499,'HH-499-5201',0.6000000,39.0000000,'Garissa','Fafi','Female',60,'Trader','None','Yes','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(500,'HH-500-3996',0.6000000,39.0000000,'Garissa','Fafi','Male',65,'Trader','None','Yes','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(501,'HH-501-4379',0.6000000,39.0000000,'Garissa','Fafi','Female',35,'None','Primary','No','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(502,'HH-502-9905',0.6000000,39.0000000,'Garissa','Fafi','Male',30,'None','Primary','Yes','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(503,'HH-503-6391',0.6000000,39.0000000,'Garissa','Fafi','Female',18,'None','None','No','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(504,'HH-504-2239',0.6000000,39.0000000,'Garissa','Fafi','Male',12,'None','None','No','No','No','Open containers','High','190','31.60','6','Difficult',1,0),(505,'HH-505-2023',-1.0000000,36.5000000,'Kiambu','Limuru','Male',45,'Driver','Secondary','No','No','No','Covered containers','Low','50','19.60','4','Easy',1,0),(506,'HH-506-3398',-1.0000000,36.5000000,'Kiambu','Limuru','Female',43,'Hairdresser','Secondary','No','No','No','Covered containers','Low','50','19.60','4','Easy',1,0),(507,'HH-507-0921',-1.0000000,36.5000000,'Kiambu','Limuru','Male',12,'Student','Primary','No','No','No','Covered containers','Low','50','19.60','4','Easy',1,0),(508,'HH-508-4412',-1.0000000,36.5000000,'Kiambu','Limuru','Female',7,'None','None','No','No','No','Covered containers','Low','50','19.60','4','Easy',1,0),(509,'HH-509-9300',0.0000000,34.0000000,'Busia','Samia','Female',58,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(510,'HH-510-3261',0.0000000,34.0000000,'Busia','Samia','Male',60,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(511,'HH-511-8406',0.0000000,34.0000000,'Busia','Samia','Female',25,'Student','Secondary','No','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(512,'HH-512-2248',0.0000000,34.0000000,'Busia','Samia','Male',22,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(513,'HH-513-6024',0.0000000,34.0000000,'Busia','Samia','Female',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(514,'HH-514-3374',0.0000000,34.0000000,'Busia','Samia','Male',10,'None','None','No','No','Yes','Covered containers','Moderate','120','24.80','6','Moderate',1,0),(515,'HH-515-8800',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',75,'Pastoralist','None','Yes','No','No','Open containers','High','165','28.60','5','Difficult',1,0),(516,'HH-516-3878',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',73,'Housewife','None','Yes','No','No','Open containers','High','165','28.60','5','Difficult',1,0),(517,'HH-517-2993',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',40,'Pastoralist','None','No','No','No','Open containers','High','165','28.60','5','Difficult',1,0),(518,'HH-518-3329',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',38,'Housewife','None','No','No','No','Open containers','High','165','28.60','5','Difficult',1,0),(519,'HH-519-7665',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',15,'None','None','No','No','No','Open containers','High','165','28.60','5','Difficult',1,0),(520,'HH-520-8340',-0.5000000,37.0000000,'Makueni','Makueni','Female',48,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','75','26.00','5','Moderate',1,0),(521,'HH-521-8705',-0.5000000,37.0000000,'Makueni','Makueni','Male',50,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','75','26.00','5','Moderate',1,0),(522,'HH-522-8505',-0.5000000,37.0000000,'Makueni','Makueni','Female',20,'Student','Secondary','No','No','Yes','Covered containers','Moderate','75','26.00','5','Moderate',1,0),(523,'HH-523-6413',-0.5000000,37.0000000,'Makueni','Makueni','Male',18,'Student','Primary','No','No','Yes','Covered containers','Moderate','75','26.00','5','Moderate',1,0),(524,'HH-524-6548',-0.5000000,37.0000000,'Makueni','Makueni','Female',10,'None','None','No','No','Yes','Covered containers','Moderate','75','26.00','5','Moderate',1,0),(525,'HH-525-3501',-1.5000000,38.0000000,'Tana River','Galole','Male',65,'Fisher','Primary','Yes','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(526,'HH-526-7864',-1.5000000,38.0000000,'Tana River','Galole','Female',63,'Housewife','Primary','Yes','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(527,'HH-527-8816',-1.5000000,38.0000000,'Tana River','Galole','Male',35,'Fisher','Secondary','No','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(528,'HH-528-0488',-1.5000000,38.0000000,'Tana River','Galole','Female',33,'None','Primary','No','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(529,'HH-529-5995',-1.5000000,38.0000000,'Tana River','Galole','Male',15,'Student','None','No','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(530,'HH-530-8510',-1.5000000,38.0000000,'Tana River','Galole','Female',10,'None','None','No','No','Yes','Open containers','High','150','29.10','6','Difficult',1,0),(531,'HH-531-4565',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',40,'Trader','Secondary','Yes','No','Yes','Covered containers','Moderate','115','25.30','4','Easy',1,0),(532,'HH-532-7297',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',42,'Fisher','Secondary','Yes','No','Yes','Covered containers','Moderate','115','25.30','4','Easy',1,0),(533,'HH-533-2790',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','115','25.30','4','Easy',1,0),(534,'HH-534-2060',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',7,'None','None','No','No','Yes','Covered containers','Moderate','115','25.30','4','Easy',1,0),(535,'HH-535-1928',0.5000000,36.0000000,'Baringo','Mogotio','Male',55,'Pastoralist','None','Yes','No','No','Open containers','High','175','27.60','5','Difficult',1,0),(536,'HH-536-3463',0.5000000,36.0000000,'Baringo','Mogotio','Female',53,'Housewife','None','Yes','No','No','Open containers','High','175','27.60','5','Difficult',1,0),(537,'HH-537-1530',0.5000000,36.0000000,'Baringo','Mogotio','Male',28,'Pastoralist','Primary','No','No','No','Open containers','High','175','27.60','5','Difficult',1,0),(538,'HH-538-7261',0.5000000,36.0000000,'Baringo','Mogotio','Female',22,'None','None','No','No','No','Open containers','High','175','27.60','5','Difficult',1,0),(539,'HH-539-1716',0.5000000,36.0000000,'Baringo','Mogotio','Male',12,'None','None','No','No','No','Open containers','High','175','27.60','5','Difficult',1,0),(540,'HH-540-6798',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',65,'Farmer','Primary','No','No','No','Covered containers','Low','60','18.10','3','Moderate',1,0),(541,'HH-541-8841',-0.4500000,36.2000000,'Nyandarua','Kinangop','Male',68,'Farmer','Primary','No','No','No','Covered containers','Low','60','18.10','3','Moderate',1,0),(542,'HH-542-3810',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',35,'Teacher','Tertiary','No','No','No','Covered containers','Low','60','18.10','3','Moderate',1,0),(543,'HH-543-2531',-1.2000000,37.8000000,'Kwale','Kinango','Male',50,'Farmer','Primary','Yes','No','Yes','Open containers','High','135','28.60','5','Difficult',1,0),(544,'HH-544-1223',-1.2000000,37.8000000,'Kwale','Kinango','Female',48,'Housewife','Primary','No','No','Yes','Open containers','High','135','28.60','5','Difficult',1,0),(545,'HH-545-8524',-1.2000000,37.8000000,'Kwale','Kinango','Male',20,'Student','Secondary','No','No','Yes','Open containers','High','135','28.60','5','Difficult',1,0),(546,'HH-546-8951',-1.2000000,37.8000000,'Kwale','Kinango','Female',18,'Student','Primary','No','No','Yes','Open containers','High','135','28.60','5','Difficult',1,0),(547,'HH-547-9183',-1.2000000,37.8000000,'Kwale','Kinango','Male',10,'None','None','No','No','Yes','Open containers','High','135','28.60','5','Difficult',1,0),(548,'HH-548-9062',0.5500000,34.7000000,'Vihiga','Sabatia','Female',40,'Businesswoman','Secondary','No','No','Yes','Covered containers','Moderate','105','23.10','4','Easy',1,0),(549,'HH-549-7760',0.5500000,34.7000000,'Vihiga','Sabatia','Male',42,'Carpenter','Secondary','No','No','Yes','Covered containers','Moderate','105','23.10','4','Easy',1,0),(550,'HH-550-1617',0.5500000,34.7000000,'Vihiga','Sabatia','Female',12,'Student','Primary','No','No','Yes','Covered containers','Moderate','105','23.10','4','Easy',1,0),(551,'HH-551-4804',0.5500000,34.7000000,'Vihiga','Sabatia','Male',7,'None','None','No','No','Yes','Covered containers','Moderate','105','23.10','4','Easy',1,0),(552,'HH-552-9172',-0.7000000,37.5000000,'Kwale','Msambweni','Male',55,'Fisher','Primary','No','Yes','Yes','Open containers','High','140','28.80','5','Difficult',1,0),(553,'HH-553-1447',-0.7000000,37.5000000,'Kwale','Msambweni','Female',53,'Trader','Primary','No','Yes','Yes','Open containers','High','140','28.80','5','Difficult',1,0),(554,'HH-554-9719',-0.7000000,37.5000000,'Kwale','Msambweni','Male',28,'Student','Secondary','No','No','Yes','Open containers','High','140','28.80','5','Difficult',1,0),(555,'HH-555-4254',-0.7000000,37.5000000,'Kwale','Msambweni','Female',22,'Student','Primary','No','No','Yes','Open containers','High','140','28.80','5','Difficult',1,0),(556,'HH-556-2112',-0.7000000,37.5000000,'Kwale','Msambweni','Male',12,'None','None','No','No','Yes','Open containers','High','140','28.80','5','Difficult',1,0),(557,'HH-557-7801',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',60,'Farmer','Primary','No','No','No','Covered containers','Low','70','20.60','4','Moderate',1,0),(558,'HH-558-2668',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',62,'Farmer','Primary','No','No','No','Covered containers','Low','70','20.60','4','Moderate',1,0),(559,'HH-559-9940',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',35,'Teacher','Tertiary','No','No','No','Covered containers','Low','70','20.60','4','Moderate',1,0),(560,'HH-560-1694',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',30,'Student','Secondary','No','No','No','Covered containers','Low','70','20.60','4','Moderate',1,0),(561,'HH-561-8649',-1.6000000,37.0000000,'Taita Taveta','Voi','Male',70,'Retired','Primary','No','No','No','No storage','Low','40','28.10','2','Easy',1,0),(562,'HH-562-8167',-1.6000000,37.0000000,'Taita Taveta','Voi','Female',68,'Housewife','Primary','No','No','No','No storage','Low','40','28.10','2','Easy',1,0),(563,'HH-563-4886',0.5000000,38.0000000,'Wajir','Wajir East','Female',50,'Pastoralist','None','Yes','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(564,'HH-564-9929',0.5000000,38.0000000,'Wajir','Wajir East','Male',52,'Pastoralist','None','Yes','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(565,'HH-565-4988',0.5000000,38.0000000,'Wajir','Wajir East','Female',25,'None','None','No','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(566,'HH-566-5153',0.5000000,38.0000000,'Wajir','Wajir East','Male',22,'None','None','No','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(567,'HH-567-0800',0.5000000,38.0000000,'Wajir','Wajir East','Female',12,'None','None','No','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(568,'HH-568-8545',0.5000000,38.0000000,'Wajir','Wajir East','Male',7,'None','None','No','No','No','Open containers','High','180','32.60','6','Difficult',1,0),(569,'HH-569-0322',-0.2000000,35.5000000,'Nyamira','Manga','Male',45,'Farmer','Secondary','No','No','No','Covered containers','Moderate','95','21.60','5','Moderate',1,0),(570,'HH-570-5979',-0.2000000,35.5000000,'Nyamira','Manga','Female',43,'Housewife','Primary','No','No','No','Covered containers','Moderate','95','21.60','5','Moderate',1,0),(571,'HH-571-8927',-0.2000000,35.5000000,'Nyamira','Manga','Male',15,'Student','Primary','No','No','No','Covered containers','Moderate','95','21.60','5','Moderate',1,0),(572,'HH-572-6698',-0.2000000,35.5000000,'Nyamira','Manga','Female',12,'None','None','No','No','No','Covered containers','Moderate','95','21.60','5','Moderate',1,0),(573,'HH-573-6710',-0.2000000,35.5000000,'Nyamira','Manga','Male',7,'None','None','No','No','No','Covered containers','Moderate','95','21.60','5','Moderate',1,0),(574,'HH-574-3459',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',58,'Farmer','Primary','No','No','No','No storage','Low','50','20.10','4','Moderate',1,0),(575,'HH-575-7162',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',60,'Farmer','Primary','No','No','No','No storage','Low','50','20.10','4','Moderate',1,0),(576,'HH-576-5436',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',25,'Student','Tertiary','No','No','No','No storage','Low','50','20.10','4','Moderate',1,0),(577,'HH-577-5693',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',22,'Student','Secondary','No','No','No','No storage','Low','50','20.10','4','Moderate',1,0),(578,'HH-578-2159',0.0000000,34.5000000,'Kakamega','Lurambi','Male',50,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','100','22.60','5','Easy',1,0),(579,'HH-579-3716',0.0000000,34.5000000,'Kakamega','Lurambi','Female',48,'Housewife','Secondary','No','No','Yes','Covered containers','Moderate','100','22.60','5','Easy',1,0),(580,'HH-580-2103',0.0000000,34.5000000,'Kakamega','Lurambi','Male',20,'Student','Secondary','No','No','Yes','Covered containers','Moderate','100','22.60','5','Easy',1,0),(581,'HH-581-9366',0.0000000,34.5000000,'Kakamega','Lurambi','Female',18,'Student','Primary','No','No','Yes','Covered containers','Moderate','100','22.60','5','Easy',1,0),(582,'HH-582-0524',0.0000000,34.5000000,'Kakamega','Lurambi','Male',10,'None','None','No','No','Yes','Covered containers','Moderate','100','22.60','5','Easy',1,0),(583,'HH-583-4522',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',65,'Farmer','Primary','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(584,'HH-584-1036',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',68,'Farmer','Primary','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(585,'HH-585-1618',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',35,'Trader','Secondary','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(586,'HH-586-4982',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',33,'Farmer','Secondary','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(587,'HH-587-0055',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',15,'Student','Primary','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(588,'HH-588-5332',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',10,'None','None','No','No','No','Open containers','High','80','27.10','6','Difficult',1,0),(589,'HH-589-6492',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',50,'Civil Servant','Tertiary','No','No','No','Covered containers','Low','60','18.60','4','Easy',1,0),(590,'HH-590-6467',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',48,'Teacher','Tertiary','No','No','No','Covered containers','Low','60','18.60','4','Easy',1,0),(591,'HH-591-2857',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',18,'Student','Primary','No','No','No','Covered containers','Low','60','18.60','4','Easy',1,0),(592,'HH-592-4888',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',12,'Student','Primary','No','No','No','Covered containers','Low','60','18.60','4','Easy',1,0),(593,'HH-593-5866',0.1000000,34.2000000,'Bungoma','Kimilili','Female',60,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','110','22.60','5','Moderate',1,0),(594,'HH-594-4668',0.1000000,34.2000000,'Bungoma','Kimilili','Male',62,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','110','22.60','5','Moderate',1,0),(595,'HH-595-5740',0.1000000,34.2000000,'Bungoma','Kimilili','Female',25,'Student','Secondary','No','No','Yes','Covered containers','Moderate','110','22.60','5','Moderate',1,0),(596,'HH-596-4700',0.1000000,34.2000000,'Bungoma','Kimilili','Male',22,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','110','22.60','5','Moderate',1,0),(597,'HH-597-6279',0.1000000,34.2000000,'Bungoma','Kimilili','Female',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','110','22.60','5','Moderate',1,0),(598,'HH-598-7296',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',45,'Rice Farmer','Secondary','No','No','No','Covered containers','Moderate','70','23.60','4','Easy',1,0),(599,'HH-599-7642',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',43,'Housewife','Primary','No','No','No','Covered containers','Moderate','70','23.60','4','Easy',1,0),(600,'HH-600-6322',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',15,'Student','Primary','No','No','No','Covered containers','Moderate','70','23.60','4','Easy',1,0),(601,'HH-601-8686',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',10,'None','None','No','No','No','Covered containers','Moderate','70','23.60','4','Easy',1,0),(602,'HH-602-4462',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',55,'Farmer','Primary','No','No','No','No storage','Low','65','19.60','5','Moderate',1,0),(603,'HH-603-6254',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',57,'Farmer','Primary','No','No','No','No storage','Low','65','19.60','5','Moderate',1,0),(604,'HH-604-7886',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',25,'Student','Secondary','No','No','No','No storage','Low','65','19.60','5','Moderate',1,0),(605,'HH-605-0667',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',22,'Farmer','Secondary','No','No','No','No storage','Low','65','19.60','5','Moderate',1,0),(606,'HH-606-9676',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',15,'Student','Primary','No','No','No','No storage','Low','65','19.60','5','Moderate',1,0),(607,'HH-607-6380',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',35,'Office Worker','Tertiary','No','No','No','Covered containers','Moderate','105','23.80','3','Easy',1,0),(608,'HH-608-2873',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',38,'Teacher','Tertiary','No','No','No','Covered containers','Moderate','105','23.80','3','Easy',1,0),(609,'HH-609-5225',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',5,'None','None','No','No','No','Covered containers','Moderate','105','23.80','3','Easy',1,0),(610,'HH-610-7508',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',70,'Retired','Primary','No','No','No','No storage','Low','55','19.40','2','Moderate',1,0),(611,'HH-611-1863',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',68,'Housewife','Primary','No','No','No','No storage','Low','55','19.40','2','Moderate',1,0),(612,'HH-612-6794',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',45,'Entrepreneur','Secondary','No','No','No','Covered containers','High','35','23.10','4','Easy',1,0),(613,'HH-613-8381',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',48,'IT Professional','Tertiary','No','No','No','Covered containers','High','35','23.10','4','Easy',1,0),(614,'HH-614-1522',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',15,'Student','Primary','No','No','No','Covered containers','High','35','23.10','4','Easy',1,0),(615,'HH-615-2468',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',10,'None','None','No','No','No','Covered containers','High','35','23.10','4','Easy',1,0),(616,'HH-616-7775',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',80,'Pastoralist','None','Yes','No','Yes','Open containers','High','150','27.60','5','Difficult',1,0),(617,'HH-617-1472',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',78,'Housewife','None','Yes','No','Yes','Open containers','High','150','27.60','5','Difficult',1,0),(618,'HH-618-4035',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',40,'Pastoralist','Primary','No','No','Yes','Open containers','High','150','27.60','5','Difficult',1,0),(619,'HH-619-5760',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',35,'None','Primary','No','No','Yes','Open containers','High','150','27.60','5','Difficult',1,0),(620,'HH-620-6696',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',12,'None','None','No','No','Yes','Open containers','High','150','27.60','5','Difficult',1,0),(621,'HH-621-6200',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',60,'Fisher','Primary','No','Yes','Yes','Open containers','High','120','28.50','4','Moderate',1,0),(622,'HH-622-0910',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',62,'Fisher','Primary','No','Yes','Yes','Open containers','High','120','28.50','4','Moderate',1,0),(623,'HH-623-5954',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',25,'Student','Secondary','No','No','Yes','Open containers','High','120','28.50','4','Moderate',1,0),(624,'HH-624-7040',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',20,'Student','Primary','No','No','Yes','Open containers','High','120','28.50','4','Moderate',1,0),(625,'HH-625-7338',0.2833000,34.7500000,'Bungoma','Bungoma Central','Male',80,'Retired','Primary','No','No','Yes','Covered containers','Moderate','85','21.40','2','Easy',1,0),(626,'HH-626-5570',0.2833000,34.7500000,'Bungoma','Bungoma Central','Female',78,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','85','21.40','2','Easy',1,0),(627,'HH-627-5836',-0.7833000,35.0000000,'Narok','Narok North','Female',45,'Trader','Primary','No','No','No','No storage','Low','45','24.90','5','Difficult',1,0),(628,'HH-628-2472',-0.7833000,35.0000000,'Narok','Narok North','Male',48,'Trader','Primary','No','No','No','No storage','Low','45','24.90','5','Difficult',1,0),(629,'HH-629-4852',-0.7833000,35.0000000,'Narok','Narok North','Female',15,'Student','Primary','No','No','No','No storage','Low','45','24.90','5','Difficult',1,0),(630,'HH-630-6845',-0.7833000,35.0000000,'Narok','Narok North','Male',12,'None','None','No','No','No','No storage','Low','45','24.90','5','Difficult',1,0),(631,'HH-631-9668',-0.7833000,35.0000000,'Narok','Narok North','Female',7,'None','None','No','No','No','No storage','Low','45','24.90','5','Difficult',1,0),(632,'HH-632-7808',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',65,'Farmer','Secondary','No','No','No','Covered containers','Moderate','65','20.40','4','Easy',1,0),(633,'HH-633-0034',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',63,'Housewife','Primary','No','No','No','Covered containers','Moderate','65','20.40','4','Easy',1,0),(634,'HH-634-6749',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',25,'Student','Tertiary','No','No','No','Covered containers','Moderate','65','20.40','4','Easy',1,0),(635,'HH-635-3640',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',20,'Student','Secondary','No','No','No','Covered containers','Moderate','65','20.40','4','Easy',1,0),(636,'HH-636-7957',2.8000000,36.0000000,'Turkana','Turkana North','Male',85,'Pastoralist','None','Yes','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(637,'HH-637-8864',2.8000000,36.0000000,'Turkana','Turkana North','Female',82,'Housewife','None','Yes','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(638,'HH-638-0449',2.8000000,36.0000000,'Turkana','Turkana North','Male',50,'Pastoralist','None','Yes','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(639,'HH-639-5652',2.8000000,36.0000000,'Turkana','Turkana North','Female',48,'Housewife','None','No','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(640,'HH-640-6915',2.8000000,36.0000000,'Turkana','Turkana North','Male',18,'Student','Primary','No','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(641,'HH-641-7621',2.8000000,36.0000000,'Turkana','Turkana North','Female',12,'None','None','No','No','No','Open containers','High','170','29.80','6','Difficult',1,0),(642,'HH-642-7357',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',40,'Shopkeeper','Secondary','No','No','No','Covered containers','Moderate','25','25.40','3','Easy',1,0),(643,'HH-643-3925',-0.6000000,37.0000000,'Machakos','Machakos Town','Male',42,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','25','25.40','3','Easy',1,0),(644,'HH-644-7556',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',10,'None','None','No','No','No','Covered containers','Moderate','25','25.40','3','Easy',1,0),(645,'HH-645-6003',0.0000000,37.9000000,'Meru','Imenti South','Male',70,'Farmer','Primary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(646,'HH-646-7346',0.0000000,37.9000000,'Meru','Imenti South','Female',65,'Housewife','Primary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(647,'HH-647-8725',0.0000000,37.9000000,'Meru','Imenti South','Male',40,'Farmer','Secondary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(648,'HH-648-1587',0.0000000,37.9000000,'Meru','Imenti South','Female',35,'Student','Secondary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(649,'HH-649-1759',0.0000000,37.9000000,'Meru','Imenti South','Male',22,'Student','Primary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(650,'HH-650-4035',0.0000000,37.9000000,'Meru','Imenti South','Female',15,'Student','Primary','No','No','Yes','Open containers','Moderate','75','22.40','6','Moderate',1,0),(651,'HH-651-4899',-2.1000000,40.0000000,'Lamu','Lamu West','Female',55,'Fisher','Primary','No','Yes','Yes','Open containers','High','130','28.10','5','Difficult',1,0),(652,'HH-652-2392',-2.1000000,40.0000000,'Lamu','Lamu West','Male',57,'Fisher','Primary','No','Yes','Yes','Open containers','High','130','28.10','5','Difficult',1,0),(653,'HH-653-7261',-2.1000000,40.0000000,'Lamu','Lamu West','Female',28,'Student','Secondary','No','No','Yes','Open containers','High','130','28.10','5','Difficult',1,0),(654,'HH-654-9131',-2.1000000,40.0000000,'Lamu','Lamu West','Male',20,'Student','Primary','No','No','Yes','Open containers','High','130','28.10','5','Difficult',1,0),(655,'HH-655-3872',-2.1000000,40.0000000,'Lamu','Lamu West','Female',12,'None','None','No','No','Yes','Open containers','High','130','28.10','5','Difficult',1,0),(656,'HH-656-1967',-0.6900000,34.2500000,'Siaya','Bondo','Male',55,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(657,'HH-657-8218',-0.6900000,34.2500000,'Siaya','Bondo','Female',53,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(658,'HH-658-5193',-0.6900000,34.2500000,'Siaya','Bondo','Male',25,'Student','Secondary','No','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(659,'HH-659-1308',-0.6900000,34.2500000,'Siaya','Bondo','Female',22,'Student','Primary','Yes','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(660,'HH-660-0964',-0.6900000,34.2500000,'Siaya','Bondo','Male',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(661,'HH-661-0894',-0.6900000,34.2500000,'Siaya','Bondo','Female',12,'None','None','No','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(662,'HH-662-1578',-0.6900000,34.2500000,'Siaya','Bondo','Male',7,'None','None','No','No','Yes','Covered containers','Moderate','115','24.40','7','Moderate',1,0),(663,'HH-663-5211',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',65,'Farmer','Primary','No','No','No','No storage','Low','50','18.80','3','Moderate',1,0),(664,'HH-664-1323',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Male',67,'Farmer','Primary','No','No','No','No storage','Low','50','18.80','3','Moderate',1,0),(665,'HH-665-0979',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',28,'Student','Tertiary','No','No','No','No storage','Low','50','18.80','3','Moderate',1,0),(666,'HH-666-0929',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',55,'Pastoralist','None','Yes','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(667,'HH-667-1708',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',53,'Housewife','None','Yes','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(668,'HH-668-5752',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',25,'Student','Primary','No','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(669,'HH-669-3636',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',22,'None','None','No','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(670,'HH-670-0925',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',15,'None','None','No','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(671,'HH-671-3720',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',10,'None','None','No','No','No','Open containers','High','140','26.40','6','Difficult',1,0),(672,'HH-672-5822',-0.1000000,37.5000000,'Embu','Embu West','Female',48,'Trader','Secondary','No','No','No','Covered containers','Moderate','60','21.90','4','Easy',1,0),(673,'HH-673-7951',-0.1000000,37.5000000,'Embu','Embu West','Male',50,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','60','21.90','4','Easy',1,0),(674,'HH-674-2291',-0.1000000,37.5000000,'Embu','Embu West','Female',18,'Student','Primary','No','No','No','Covered containers','Moderate','60','21.90','4','Easy',1,0),(675,'HH-675-7604',-0.1000000,37.5000000,'Embu','Embu West','Male',12,'None','None','No','No','No','Covered containers','Moderate','60','21.90','4','Easy',1,0),(676,'HH-676-1146',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',60,'Farmer','Primary','No','No','Yes','Open containers','High','95','26.40','5','Moderate',1,0),(677,'HH-677-2918',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',58,'Housewife','Primary','No','No','Yes','Open containers','High','95','26.40','5','Moderate',1,0),(678,'HH-678-1154',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',35,'Student','Secondary','No','No','Yes','Open containers','High','95','26.40','5','Moderate',1,0),(679,'HH-679-7017',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',30,'Student','Primary','No','No','Yes','Open containers','High','95','26.40','5','Moderate',1,0),(680,'HH-680-1621',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',15,'None','None','No','No','Yes','Open containers','High','95','26.40','5','Moderate',1,0),(681,'HH-681-7056',0.7500000,34.5000000,'Kakamega','Butere','Female',70,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','23.40','4','Easy',1,0),(682,'HH-682-0419',0.7500000,34.5000000,'Kakamega','Butere','Male',72,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','120','23.40','4','Easy',1,0),(683,'HH-683-0927',0.7500000,34.5000000,'Kakamega','Butere','Female',40,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','120','23.40','4','Easy',1,0),(684,'HH-684-3380',0.7500000,34.5000000,'Kakamega','Butere','Male',38,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','120','23.40','4','Easy',1,0),(685,'HH-685-4118',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Male',45,'Salesperson','Secondary','No','No','No','No storage','Low','40','20.90','3','Easy',1,0),(686,'HH-686-0450',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',43,'Hairdresser','Secondary','No','No','No','No storage','Low','40','20.90','3','Easy',1,0),(687,'HH-687-9896',-0.3000000,36.0000000,'Nakuru','Nakuru Town East','Female',12,'None','None','No','No','No','No storage','Low','40','20.90','3','Easy',1,0),(688,'HH-688-8132',1.5000000,37.5000000,'Marsabit','Moyale','Female',75,'Pastoralist','None','Yes','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(689,'HH-689-0971',1.5000000,37.5000000,'Marsabit','Moyale','Male',78,'Pastoralist','None','Yes','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(690,'HH-690-0458',1.5000000,37.5000000,'Marsabit','Moyale','Female',45,'Housewife','None','No','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(691,'HH-691-9380',1.5000000,37.5000000,'Marsabit','Moyale','Male',43,'Pastoralist','None','Yes','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(692,'HH-692-5525',1.5000000,37.5000000,'Marsabit','Moyale','Female',22,'None','Primary','No','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(693,'HH-693-9484',1.5000000,37.5000000,'Marsabit','Moyale','Male',18,'None','None','No','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(694,'HH-694-0849',1.5000000,37.5000000,'Marsabit','Moyale','Female',12,'None','None','No','No','No','Open containers','High','160','30.40','7','Difficult',1,0),(695,'HH-695-5790',-0.0500000,35.3000000,'Kericho','Kericho East','Male',55,'Farmer','Secondary','No','No','No','Covered containers','Moderate','80','20.10','5','Moderate',1,0),(696,'HH-696-6407',-0.0500000,35.3000000,'Kericho','Kericho East','Female',53,'Housewife','Primary','No','No','No','Covered containers','Moderate','80','20.10','5','Moderate',1,0),(697,'HH-697-4663',-0.0500000,35.3000000,'Kericho','Kericho East','Male',22,'Student','Secondary','No','No','No','Covered containers','Moderate','80','20.10','5','Moderate',1,0),(698,'HH-698-4093',-0.0500000,35.3000000,'Kericho','Kericho East','Female',18,'Student','Primary','No','No','No','Covered containers','Moderate','80','20.10','5','Moderate',1,0),(699,'HH-699-6478',-0.0500000,35.3000000,'Kericho','Kericho East','Male',12,'None','None','No','No','No','Covered containers','Moderate','80','20.10','5','Moderate',1,0),(700,'HH-700-0114',0.6000000,39.0000000,'Garissa','Fafi','Female',65,'Trader','None','Yes','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(701,'HH-701-1133',0.6000000,39.0000000,'Garissa','Fafi','Male',70,'Trader','None','Yes','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(702,'HH-702-5326',0.6000000,39.0000000,'Garissa','Fafi','Female',40,'None','Primary','No','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(703,'HH-703-3229',0.6000000,39.0000000,'Garissa','Fafi','Male',35,'None','Primary','Yes','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(704,'HH-704-0168',0.6000000,39.0000000,'Garissa','Fafi','Female',20,'None','None','No','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(705,'HH-705-1153',0.6000000,39.0000000,'Garissa','Fafi','Male',15,'None','None','No','No','No','Open containers','High','180','31.40','6','Difficult',1,0),(706,'HH-706-5262',-1.0000000,36.5000000,'Kiambu','Limuru','Male',50,'Driver','Secondary','No','No','No','Covered containers','Low','45','19.40','4','Easy',1,0),(707,'HH-707-2850',-1.0000000,36.5000000,'Kiambu','Limuru','Female',48,'Hairdresser','Secondary','No','No','No','Covered containers','Low','45','19.40','4','Easy',1,0),(708,'HH-708-8464',-1.0000000,36.5000000,'Kiambu','Limuru','Male',15,'Student','Primary','No','No','No','Covered containers','Low','45','19.40','4','Easy',1,0),(709,'HH-709-3772',-1.0000000,36.5000000,'Kiambu','Limuru','Female',10,'None','None','No','No','No','Covered containers','Low','45','19.40','4','Easy',1,0),(710,'HH-710-3467',0.0000000,34.0000000,'Busia','Samia','Female',65,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(711,'HH-711-6022',0.0000000,34.0000000,'Busia','Samia','Male',68,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(712,'HH-712-9710',0.0000000,34.0000000,'Busia','Samia','Female',30,'Student','Secondary','No','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(713,'HH-713-0483',0.0000000,34.0000000,'Busia','Samia','Male',28,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(714,'HH-714-3286',0.0000000,34.0000000,'Busia','Samia','Female',18,'Student','Primary','No','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(715,'HH-715-4982',0.0000000,34.0000000,'Busia','Samia','Male',12,'None','None','No','No','Yes','Covered containers','Moderate','115','24.60','6','Moderate',1,0),(716,'HH-716-5053',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',80,'Pastoralist','None','Yes','No','No','Open containers','High','155','28.40','5','Difficult',1,0),(717,'HH-717-0317',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',78,'Housewife','None','Yes','No','No','Open containers','High','155','28.40','5','Difficult',1,0),(718,'HH-718-6429',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',45,'Pastoralist','None','No','No','No','Open containers','High','155','28.40','5','Difficult',1,0),(719,'HH-719-1194',1.0000000,35.0000000,'West Pokot','Pokot Central','Female',43,'Housewife','None','No','No','No','Open containers','High','155','28.40','5','Difficult',1,0),(720,'HH-720-6681',1.0000000,35.0000000,'West Pokot','Pokot Central','Male',18,'None','None','No','No','No','Open containers','High','155','28.40','5','Difficult',1,0),(721,'HH-721-9826',-0.5000000,37.0000000,'Makueni','Makueni','Female',52,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','70','25.80','5','Moderate',1,0),(722,'HH-722-9088',-0.5000000,37.0000000,'Makueni','Makueni','Male',55,'Farmer','Primary','No','No','Yes','Covered containers','Moderate','70','25.80','5','Moderate',1,0),(723,'HH-723-5961',-0.5000000,37.0000000,'Makueni','Makueni','Female',22,'Student','Secondary','No','No','Yes','Covered containers','Moderate','70','25.80','5','Moderate',1,0),(724,'HH-724-2540',-0.5000000,37.0000000,'Makueni','Makueni','Male',20,'Student','Primary','No','No','Yes','Covered containers','Moderate','70','25.80','5','Moderate',1,0),(725,'HH-725-4821',-0.5000000,37.0000000,'Makueni','Makueni','Female',12,'None','None','No','No','Yes','Covered containers','Moderate','70','25.80','5','Moderate',1,0),(726,'HH-726-6484',-1.5000000,38.0000000,'Tana River','Galole','Male',70,'Fisher','Primary','Yes','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(727,'HH-727-7958',-1.5000000,38.0000000,'Tana River','Galole','Female',68,'Housewife','Primary','Yes','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(728,'HH-728-0337',-1.5000000,38.0000000,'Tana River','Galole','Male',40,'Fisher','Secondary','No','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(729,'HH-729-7813',-1.5000000,38.0000000,'Tana River','Galole','Female',38,'None','Primary','No','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(730,'HH-730-8054',-1.5000000,38.0000000,'Tana River','Galole','Male',18,'Student','None','No','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(731,'HH-731-6833',-1.5000000,38.0000000,'Tana River','Galole','Female',12,'None','None','No','No','Yes','Open containers','High','140','28.90','6','Difficult',1,0),(732,'HH-732-0001',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',45,'Trader','Secondary','Yes','No','Yes','Covered containers','Moderate','110','25.10','4','Easy',1,0),(733,'HH-733-9507',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',48,'Fisher','Secondary','Yes','No','Yes','Covered containers','Moderate','110','25.10','4','Easy',1,0),(734,'HH-734-7532',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Female',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','110','25.10','4','Easy',1,0),(735,'HH-735-9139',-0.2500000,34.7000000,'Homa Bay','Homa Bay Town','Male',10,'None','None','No','No','Yes','Covered containers','Moderate','110','25.10','4','Easy',1,0),(736,'HH-736-3099',0.5000000,36.0000000,'Baringo','Mogotio','Male',60,'Pastoralist','None','Yes','No','No','Open containers','High','165','27.40','5','Difficult',1,0),(737,'HH-737-8078',0.5000000,36.0000000,'Baringo','Mogotio','Female',58,'Housewife','None','Yes','No','No','Open containers','High','165','27.40','5','Difficult',1,0),(738,'HH-738-1093',0.5000000,36.0000000,'Baringo','Mogotio','Male',30,'Pastoralist','Primary','No','No','No','Open containers','High','165','27.40','5','Difficult',1,0),(739,'HH-739-1233',0.5000000,36.0000000,'Baringo','Mogotio','Female',25,'None','None','No','No','No','Open containers','High','165','27.40','5','Difficult',1,0),(740,'HH-740-2886',0.5000000,36.0000000,'Baringo','Mogotio','Male',15,'None','None','No','No','No','Open containers','High','165','27.40','5','Difficult',1,0),(741,'HH-741-0730',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',70,'Farmer','Primary','No','No','No','Covered containers','Low','55','17.90','3','Moderate',1,0),(742,'HH-742-4994',-0.4500000,36.2000000,'Nyandarua','Kinangop','Male',72,'Farmer','Primary','No','No','No','Covered containers','Low','55','17.90','3','Moderate',1,0),(743,'HH-743-2781',-0.4500000,36.2000000,'Nyandarua','Kinangop','Female',40,'Teacher','Tertiary','No','No','No','Covered containers','Low','55','17.90','3','Moderate',1,0),(744,'HH-744-8922',-1.2000000,37.8000000,'Kwale','Kinango','Male',55,'Farmer','Primary','Yes','No','Yes','Open containers','High','125','28.40','5','Difficult',1,0),(745,'HH-745-6268',-1.2000000,37.8000000,'Kwale','Kinango','Female',53,'Housewife','Primary','No','No','Yes','Open containers','High','125','28.40','5','Difficult',1,0),(746,'HH-746-4575',-1.2000000,37.8000000,'Kwale','Kinango','Male',22,'Student','Secondary','No','No','Yes','Open containers','High','125','28.40','5','Difficult',1,0),(747,'HH-747-4072',-1.2000000,37.8000000,'Kwale','Kinango','Female',20,'Student','Primary','No','No','Yes','Open containers','High','125','28.40','5','Difficult',1,0),(748,'HH-748-6636',-1.2000000,37.8000000,'Kwale','Kinango','Male',12,'None','None','No','No','Yes','Open containers','High','125','28.40','5','Difficult',1,0),(749,'HH-749-0964',0.5500000,34.7000000,'Vihiga','Sabatia','Female',45,'Businesswoman','Secondary','No','No','Yes','Covered containers','Moderate','100','22.90','4','Easy',1,0),(750,'HH-750-4914',0.5500000,34.7000000,'Vihiga','Sabatia','Male',48,'Carpenter','Secondary','No','No','Yes','Covered containers','Moderate','100','22.90','4','Easy',1,0),(751,'HH-751-1676',0.5500000,34.7000000,'Vihiga','Sabatia','Female',15,'Student','Primary','No','No','Yes','Covered containers','Moderate','100','22.90','4','Easy',1,0),(752,'HH-752-3639',0.5500000,34.7000000,'Vihiga','Sabatia','Male',10,'None','None','No','No','Yes','Covered containers','Moderate','100','22.90','4','Easy',1,0),(753,'HH-753-3167',-0.7000000,37.5000000,'Kwale','Msambweni','Male',60,'Fisher','Primary','No','Yes','Yes','Open containers','High','130','28.60','5','Difficult',1,0),(754,'HH-754-4920',-0.7000000,37.5000000,'Kwale','Msambweni','Female',58,'Trader','Primary','No','Yes','Yes','Open containers','High','130','28.60','5','Difficult',1,0),(755,'HH-755-5097',-0.7000000,37.5000000,'Kwale','Msambweni','Male',30,'Student','Secondary','No','No','Yes','Open containers','High','130','28.60','5','Difficult',1,0),(756,'HH-756-0726',-0.7000000,37.5000000,'Kwale','Msambweni','Female',25,'Student','Primary','No','No','Yes','Open containers','High','130','28.60','5','Difficult',1,0),(757,'HH-757-8338',-0.7000000,37.5000000,'Kwale','Msambweni','Male',15,'None','None','No','No','Yes','Open containers','High','130','28.60','5','Difficult',1,0),(758,'HH-758-9514',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',65,'Farmer','Primary','No','No','No','Covered containers','Low','65','20.40','4','Moderate',1,0),(759,'HH-759-2558',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',68,'Farmer','Primary','No','No','No','Covered containers','Low','65','20.40','4','Moderate',1,0),(760,'HH-760-4248',-0.0800000,34.9000000,'Nyamira','Nyamira North','Female',40,'Teacher','Tertiary','No','No','No','Covered containers','Low','65','20.40','4','Moderate',1,0),(761,'HH-761-3567',-0.0800000,34.9000000,'Nyamira','Nyamira North','Male',35,'Student','Secondary','No','No','No','Covered containers','Low','65','20.40','4','Moderate',1,0),(762,'HH-762-5091',-1.6000000,37.0000000,'Taita Taveta','Voi','Male',75,'Retired','Primary','No','No','No','No storage','Low','35','27.90','2','Easy',1,0),(763,'HH-763-4755',-1.6000000,37.0000000,'Taita Taveta','Voi','Female',73,'Housewife','Primary','No','No','No','No storage','Low','35','27.90','2','Easy',1,0),(764,'HH-764-8503',0.5000000,38.0000000,'Wajir','Wajir East','Female',55,'Pastoralist','None','Yes','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(765,'HH-765-8251',0.5000000,38.0000000,'Wajir','Wajir East','Male',58,'Pastoralist','None','Yes','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(766,'HH-766-5747',0.5000000,38.0000000,'Wajir','Wajir East','Female',30,'None','None','No','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(767,'HH-767-3981',0.5000000,38.0000000,'Wajir','Wajir East','Male',28,'None','None','No','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(768,'HH-768-2665',0.5000000,38.0000000,'Wajir','Wajir East','Female',15,'None','None','No','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(769,'HH-769-1381',0.5000000,38.0000000,'Wajir','Wajir East','Male',10,'None','None','No','No','No','Open containers','High','170','32.40','6','Difficult',1,0),(770,'HH-770-8912',-0.2000000,35.5000000,'Nyamira','Manga','Male',50,'Farmer','Secondary','No','No','No','Covered containers','Moderate','90','21.40','5','Moderate',1,0),(771,'HH-771-0416',-0.2000000,35.5000000,'Nyamira','Manga','Female',48,'Housewife','Primary','No','No','No','Covered containers','Moderate','90','21.40','5','Moderate',1,0),(772,'HH-772-5346',-0.2000000,35.5000000,'Nyamira','Manga','Male',18,'Student','Primary','No','No','No','Covered containers','Moderate','90','21.40','5','Moderate',1,0),(773,'HH-773-5480',-0.2000000,35.5000000,'Nyamira','Manga','Female',15,'None','None','No','No','No','Covered containers','Moderate','90','21.40','5','Moderate',1,0),(774,'HH-774-1366',-0.2000000,35.5000000,'Nyamira','Manga','Male',10,'None','None','No','No','No','Covered containers','Moderate','90','21.40','5','Moderate',1,0),(775,'HH-775-0387',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',63,'Farmer','Primary','No','No','No','No storage','Low','45','19.90','4','Moderate',1,0),(776,'HH-776-7840',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',65,'Farmer','Primary','No','No','No','No storage','Low','45','19.90','4','Moderate',1,0),(777,'HH-777-8039',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',28,'Student','Tertiary','No','No','No','No storage','Low','45','19.90','4','Moderate',1,0),(778,'HH-778-6676',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',25,'Student','Secondary','No','No','No','No storage','Low','45','19.90','4','Moderate',1,0),(779,'HH-779-9263',0.0000000,34.5000000,'Kakamega','Lurambi','Male',55,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','95','22.40','5','Easy',1,0),(780,'HH-780-6286',0.0000000,34.5000000,'Kakamega','Lurambi','Female',53,'Housewife','Secondary','No','No','Yes','Covered containers','Moderate','95','22.40','5','Easy',1,0),(781,'HH-781-3644',0.0000000,34.5000000,'Kakamega','Lurambi','Male',22,'Student','Secondary','No','No','Yes','Covered containers','Moderate','95','22.40','5','Easy',1,0),(782,'HH-782-9363',0.0000000,34.5000000,'Kakamega','Lurambi','Female',20,'Student','Primary','No','No','Yes','Covered containers','Moderate','95','22.40','5','Easy',1,0),(783,'HH-783-5882',0.0000000,34.5000000,'Kakamega','Lurambi','Male',12,'None','None','No','No','Yes','Covered containers','Moderate','95','22.40','5','Easy',1,0),(784,'HH-784-1320',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',70,'Farmer','Primary','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(785,'HH-785-8958',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',72,'Farmer','Primary','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(786,'HH-786-0828',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',40,'Trader','Secondary','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(787,'HH-787-7268',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',38,'Farmer','Secondary','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(788,'HH-788-3854',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',18,'Student','Primary','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(789,'HH-789-7467',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',12,'None','None','No','No','No','Open containers','High','75','26.90','6','Difficult',1,0),(790,'HH-790-5774',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',55,'Civil Servant','Tertiary','No','No','No','Covered containers','Low','55','18.40','4','Easy',1,0),(791,'HH-791-6468',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',53,'Teacher','Tertiary','No','No','No','Covered containers','Low','55','18.40','4','Easy',1,0),(792,'HH-792-5017',0.2500000,37.0000000,'Nyeri','Nyeri Central','Male',20,'Student','Primary','No','No','No','Covered containers','Low','55','18.40','4','Easy',1,0),(793,'HH-793-5685',0.2500000,37.0000000,'Nyeri','Nyeri Central','Female',15,'Student','Primary','No','No','No','Covered containers','Low','55','18.40','4','Easy',1,0),(794,'HH-794-3375',0.1000000,34.2000000,'Bungoma','Kimilili','Female',65,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','105','22.40','5','Moderate',1,0),(795,'HH-795-9820',0.1000000,34.2000000,'Bungoma','Kimilili','Male',67,'Farmer','Primary','Yes','No','Yes','Covered containers','Moderate','105','22.40','5','Moderate',1,0),(796,'HH-796-8973',0.1000000,34.2000000,'Bungoma','Kimilili','Female',28,'Student','Secondary','No','No','Yes','Covered containers','Moderate','105','22.40','5','Moderate',1,0),(797,'HH-797-5408',0.1000000,34.2000000,'Bungoma','Kimilili','Male',25,'Farmer','Secondary','No','No','Yes','Covered containers','Moderate','105','22.40','5','Moderate',1,0),(798,'HH-798-0120',0.1000000,34.2000000,'Bungoma','Kimilili','Female',18,'Student','Primary','No','No','Yes','Covered containers','Moderate','105','22.40','5','Moderate',1,0),(799,'HH-799-4379',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',50,'Rice Farmer','Secondary','No','No','No','Covered containers','Moderate','65','23.40','4','Easy',1,0),(800,'HH-800-1535',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',48,'Housewife','Primary','No','No','No','Covered containers','Moderate','65','23.40','4','Easy',1,0),(801,'HH-801-4536',0.0000000,37.0000000,'Kirinyaga','Mwea','Male',18,'Student','Primary','No','No','No','Covered containers','Moderate','65','23.40','4','Easy',1,0),(802,'HH-802-8076',0.0000000,37.0000000,'Kirinyaga','Mwea','Female',12,'None','None','No','No','No','Covered containers','Moderate','65','23.40','4','Easy',1,0),(803,'HH-803-6772',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',60,'Farmer','Primary','No','No','No','No storage','Low','60','19.40','5','Moderate',1,0),(804,'HH-804-9635',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',62,'Farmer','Primary','No','No','No','No storage','Low','60','19.40','5','Moderate',1,0),(805,'HH-805-7857',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',28,'Student','Secondary','No','No','No','No storage','Low','60','19.40','5','Moderate',1,0),(806,'HH-806-0379',0.7000000,35.0000000,'Trans Nzoia','Kitale','Male',25,'Farmer','Secondary','No','No','No','No storage','Low','60','19.40','5','Moderate',1,0),(807,'HH-807-8328',0.7000000,35.0000000,'Trans Nzoia','Kitale','Female',18,'Student','Primary','No','No','No','No storage','Low','60','19.40','5','Moderate',1,0),(808,'HH-808-0502',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',40,'Office Worker','Tertiary','No','No','No','Covered containers','Moderate','100','23.60','3','Easy',1,0),(809,'HH-809-7528',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Male',42,'Teacher','Tertiary','No','No','No','Covered containers','Moderate','100','23.60','3','Easy',1,0),(810,'HH-810-6134',-0.0245000,34.7678000,'Kisumu','Kisumu Central','Female',7,'None','None','No','No','No','Covered containers','Moderate','100','23.60','3','Easy',1,0),(811,'HH-811-8086',0.5147000,35.2698000,'Nandi','Nandi Hills','Male',75,'Retired','Primary','No','No','No','No storage','Low','50','19.20','2','Moderate',1,0),(812,'HH-812-2029',0.5147000,35.2698000,'Nandi','Nandi Hills','Female',73,'Housewife','Primary','No','No','No','No storage','Low','50','19.20','2','Moderate',1,0),(813,'HH-813-5887',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',50,'Entrepreneur','Secondary','No','No','No','Covered containers','High','30','22.90','4','Easy',1,0),(814,'HH-814-3347',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',52,'IT Professional','Tertiary','No','No','No','Covered containers','High','30','22.90','4','Easy',1,0),(815,'HH-815-9075',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Female',18,'Student','Primary','No','No','No','Covered containers','High','30','22.90','4','Easy',1,0),(816,'HH-816-5334',-1.2921000,36.8219000,'Nairobi','Dagoretti North','Male',12,'None','None','No','No','No','Covered containers','High','30','22.90','4','Easy',1,0),(817,'HH-817-9446',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',85,'Pastoralist','None','Yes','No','Yes','Open containers','High','140','27.40','5','Difficult',1,0),(818,'HH-818-1228',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',83,'Housewife','None','Yes','No','Yes','Open containers','High','140','27.40','5','Difficult',1,0),(819,'HH-819-7804',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',45,'Pastoralist','Primary','No','No','Yes','Open containers','High','140','27.40','5','Difficult',1,0),(820,'HH-820-5337',1.0456000,37.0000000,'Isiolo','Isiolo Central','Female',40,'None','Primary','No','No','Yes','Open containers','High','140','27.40','5','Difficult',1,0),(821,'HH-821-3275',1.0456000,37.0000000,'Isiolo','Isiolo Central','Male',15,'None','None','No','No','Yes','Open containers','High','140','27.40','5','Difficult',1,0),(822,'HH-822-0361',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',65,'Fisher','Primary','No','Yes','Yes','Open containers','High','110','28.30','4','Moderate',1,0),(823,'HH-823-1984',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',67,'Fisher','Primary','No','Yes','Yes','Open containers','High','110','28.30','4','Moderate',1,0),(824,'HH-824-8834',-0.5000000,39.8000000,'Kilifi','Kilifi North','Female',28,'Student','Secondary','No','No','Yes','Open containers','High','110','28.30','4','Moderate',1,0),(825,'HH-825-8220',-0.5000000,39.8000000,'Kilifi','Kilifi North','Male',22,'Student','Primary','No','No','Yes','Open containers','High','110','28.30','4','Moderate',1,0),(826,'HH-826-4600',0.2833000,34.7500000,'Bungoma','Bungoma Central','Male',85,'Retired','Primary','No','No','Yes','Covered containers','Moderate','80','21.20','2','Easy',1,0),(827,'HH-827-8338',0.2833000,34.7500000,'Bungoma','Bungoma Central','Female',83,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','80','21.20','2','Easy',1,0),(828,'HH-828-7892',-0.7833000,35.0000000,'Narok','Narok North','Female',50,'Trader','Primary','No','No','No','No storage','Low','40','24.70','5','Difficult',1,0),(829,'HH-829-4444',-0.7833000,35.0000000,'Narok','Narok North','Male',52,'Trader','Primary','No','No','No','No storage','Low','40','24.70','5','Difficult',1,0),(830,'HH-830-8547',-0.7833000,35.0000000,'Narok','Narok North','Female',18,'Student','Primary','No','No','No','No storage','Low','40','24.70','5','Difficult',1,0),(831,'HH-831-9402',-0.7833000,35.0000000,'Narok','Narok North','Male',15,'None','None','No','No','No','No storage','Low','40','24.70','5','Difficult',1,0),(832,'HH-832-1372',-0.7833000,35.0000000,'Narok','Narok North','Female',10,'None','None','No','No','No','No storage','Low','40','24.70','5','Difficult',1,0),(833,'HH-833-8653',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',70,'Farmer','Secondary','No','No','No','Covered containers','Moderate','60','20.20','4','Easy',1,0),(834,'HH-834-9147',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',68,'Housewife','Primary','No','No','No','Covered containers','Moderate','60','20.20','4','Easy',1,0),(835,'HH-835-9780',-0.4000000,36.9000000,'Murang\'a','Kandara','Female',28,'Student','Tertiary','No','No','No','Covered containers','Moderate','60','20.20','4','Easy',1,0),(836,'HH-836-1460',-0.4000000,36.9000000,'Murang\'a','Kandara','Male',22,'Student','Secondary','No','No','No','Covered containers','Moderate','60','20.20','4','Easy',1,0),(837,'HH-837-7959',2.8000000,36.0000000,'Turkana','Turkana North','Male',90,'Pastoralist','None','Yes','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(838,'HH-838-5416',2.8000000,36.0000000,'Turkana','Turkana North','Female',88,'Housewife','None','Yes','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(839,'HH-839-3203',2.8000000,36.0000000,'Turkana','Turkana North','Male',55,'Pastoralist','None','Yes','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(840,'HH-840-9766',2.8000000,36.0000000,'Turkana','Turkana North','Female',53,'Housewife','None','No','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(841,'HH-841-9221',2.8000000,36.0000000,'Turkana','Turkana North','Male',20,'Student','Primary','No','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(842,'HH-842-6809',2.8000000,36.0000000,'Turkana','Turkana North','Female',15,'None','None','No','No','No','Open containers','High','160','29.60','6','Difficult',1,0),(843,'HH-843-6384',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',45,'Shopkeeper','Secondary','No','No','No','Covered containers','Moderate','20','25.20','3','Easy',1,0),(844,'HH-844-1493',-0.6000000,37.0000000,'Machakos','Machakos Town','Male',48,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','20','25.20','3','Easy',1,0),(845,'HH-845-8312',-0.6000000,37.0000000,'Machakos','Machakos Town','Female',12,'None','None','No','No','No','Covered containers','Moderate','20','25.20','3','Easy',1,0),(846,'HH-846-7082',0.0000000,37.9000000,'Meru','Imenti South','Male',75,'Farmer','Primary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(847,'HH-847-0475',0.0000000,37.9000000,'Meru','Imenti South','Female',70,'Housewife','Primary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(848,'HH-848-1130',0.0000000,37.9000000,'Meru','Imenti South','Male',45,'Farmer','Secondary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(849,'HH-849-4224',0.0000000,37.9000000,'Meru','Imenti South','Female',40,'Student','Secondary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(850,'HH-850-7730',0.0000000,37.9000000,'Meru','Imenti South','Male',25,'Student','Primary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(851,'HH-851-5981',0.0000000,37.9000000,'Meru','Imenti South','Female',18,'Student','Primary','No','No','Yes','Open containers','Moderate','70','22.20','6','Moderate',1,0),(852,'HH-852-6715',-2.1000000,40.0000000,'Lamu','Lamu West','Female',60,'Fisher','Primary','No','Yes','Yes','Open containers','High','120','27.90','5','Difficult',1,0),(853,'HH-853-5631',-2.1000000,40.0000000,'Lamu','Lamu West','Male',62,'Fisher','Primary','No','Yes','Yes','Open containers','High','120','27.90','5','Difficult',1,0),(854,'HH-854-8011',-2.1000000,40.0000000,'Lamu','Lamu West','Female',30,'Student','Secondary','No','No','Yes','Open containers','High','120','27.90','5','Difficult',1,0),(855,'HH-855-3162',-2.1000000,40.0000000,'Lamu','Lamu West','Male',25,'Student','Primary','No','No','Yes','Open containers','High','120','27.90','5','Difficult',1,0),(856,'HH-856-1778',-2.1000000,40.0000000,'Lamu','Lamu West','Female',15,'None','None','No','No','Yes','Open containers','High','120','27.90','5','Difficult',1,0),(857,'HH-857-9404',-0.6900000,34.2500000,'Siaya','Bondo','Male',60,'Farmer','Secondary','Yes','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(858,'HH-858-1686',-0.6900000,34.2500000,'Siaya','Bondo','Female',58,'Housewife','Primary','No','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(859,'HH-859-0217',-0.6900000,34.2500000,'Siaya','Bondo','Male',30,'Student','Secondary','No','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(860,'HH-860-6029',-0.6900000,34.2500000,'Siaya','Bondo','Female',28,'Student','Primary','Yes','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(861,'HH-861-9496',-0.6900000,34.2500000,'Siaya','Bondo','Male',18,'Student','Primary','No','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(862,'HH-862-9394',-0.6900000,34.2500000,'Siaya','Bondo','Female',15,'None','None','No','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(863,'HH-863-8481',-0.6900000,34.2500000,'Siaya','Bondo','Male',10,'None','None','No','No','Yes','Covered containers','Moderate','110','24.20','7','Moderate',1,0),(864,'HH-864-4222',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',70,'Farmer','Primary','No','No','No','No storage','Low','45','18.60','3','Moderate',1,0),(865,'HH-865-5671',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Male',72,'Farmer','Primary','No','No','No','No storage','Low','45','18.60','3','Moderate',1,0),(866,'HH-866-5687',0.3000000,36.5000000,'Nyandarua','Ol Kalou','Female',30,'Student','Tertiary','No','No','No','No storage','Low','45','18.60','3','Moderate',1,0),(867,'HH-867-1423',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',60,'Pastoralist','None','Yes','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(868,'HH-868-0056',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',58,'Housewife','None','Yes','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(869,'HH-869-6009',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',30,'Student','Primary','No','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(870,'HH-870-9877',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',28,'None','None','No','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(871,'HH-871-1361',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Male',18,'None','None','No','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(872,'HH-872-7172',-1.0000000,35.0000000,'Kajiado','Kajiado Central','Female',12,'None','None','No','No','No','Open containers','High','130','26.20','6','Difficult',1,0),(873,'HH-873-1781',-0.1000000,37.5000000,'Embu','Embu West','Female',52,'Trader','Secondary','No','No','No','Covered containers','Moderate','55','21.70','4','Easy',1,0),(874,'HH-874-7386',-0.1000000,37.5000000,'Embu','Embu West','Male',55,'Mechanic','Secondary','No','No','No','Covered containers','Moderate','55','21.70','4','Easy',1,0),(875,'HH-875-1590',-0.1000000,37.5000000,'Embu','Embu West','Female',20,'Student','Primary','No','No','No','Covered containers','Moderate','55','21.70','4','Easy',1,0),(876,'HH-876-5793',-0.1000000,37.5000000,'Embu','Embu West','Male',15,'None','None','No','No','No','Covered containers','Moderate','55','21.70','4','Easy',1,0),(877,'HH-877-4194',-0.2000000,38.0000000,'Kitui','Kitui Central','Male',65,'Farmer','Primary','No','No','Yes','Open containers','High','90','26.20','5','Moderate',1,0),(878,'HH-878-3592',-0.2000000,38.0000000,'Kitui','Kitui Central','Female',63,'Housewife','Primary','No','No','Yes','Open containers','High','90','26.20','5','Moderate',1,0),(879,'HH-879-5378',0.5000000,38.0000000,'Wajir','Wajir East','Female',18,'None','None','No','No','No','Open containers','High','160','32.20','6','Difficult',1,0),(880,'HH-880-6113',0.5000000,38.0000000,'Wajir','Wajir East','Male',15,'None','None','No','No','No','Open containers','High','160','32.20','6','Difficult',1,0),(881,'HH-881-4432',-0.2000000,35.5000000,'Nyamira','Manga','Male',55,'Farmer','Secondary','No','No','No','Covered containers','Moderate','85','21.20','5','Moderate',1,0),(882,'HH-882-3821',-0.2000000,35.5000000,'Nyamira','Manga','Female',53,'Housewife','Primary','No','No','No','Covered containers','Moderate','85','21.20','5','Moderate',1,0),(883,'HH-883-5810',-0.2000000,35.5000000,'Nyamira','Manga','Male',22,'Student','Primary','No','No','No','Covered containers','Moderate','85','21.20','5','Moderate',1,0),(884,'HH-884-7587',-0.2000000,35.5000000,'Nyamira','Manga','Female',20,'None','None','No','No','No','Covered containers','Moderate','85','21.20','5','Moderate',1,0),(885,'HH-885-0505',-0.2000000,35.5000000,'Nyamira','Manga','Male',12,'None','None','No','No','No','Covered containers','Moderate','85','21.20','5','Moderate',1,0),(886,'HH-886-9764',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',68,'Farmer','Primary','No','No','No','No storage','Low','40','19.70','4','Moderate',1,0),(887,'HH-887-7305',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',70,'Farmer','Primary','No','No','No','No storage','Low','40','19.70','4','Moderate',1,0),(888,'HH-888-7235',-0.1500000,36.0000000,'Laikipia','Laikipia West','Female',30,'Student','Tertiary','No','No','No','No storage','Low','40','19.70','4','Moderate',1,0),(889,'HH-889-4258',-0.1500000,36.0000000,'Laikipia','Laikipia West','Male',28,'Student','Secondary','No','No','No','No storage','Low','40','19.70','4','Moderate',1,0),(890,'HH-890-9588',0.0000000,34.5000000,'Kakamega','Lurambi','Male',60,'Teacher','Tertiary','No','No','Yes','Covered containers','Moderate','90','22.20','5','Easy',1,0),(891,'HH-891-5164',0.0000000,34.5000000,'Kakamega','Lurambi','Female',58,'Housewife','Secondary','No','No','Yes','Covered containers','Moderate','90','22.20','5','Easy',1,0),(892,'HH-892-7057',0.0000000,34.5000000,'Kakamega','Lurambi','Male',25,'Student','Secondary','No','No','Yes','Covered containers','Moderate','90','22.20','5','Easy',1,0),(893,'HH-893-9793',0.0000000,34.5000000,'Kakamega','Lurambi','Female',22,'Student','Primary','No','No','Yes','Covered containers','Moderate','90','22.20','5','Easy',1,0),(894,'HH-894-7796',0.0000000,34.5000000,'Kakamega','Lurambi','Male',15,'None','None','No','No','Yes','Covered containers','Moderate','90','22.20','5','Easy',1,0),(895,'HH-895-9603',-1.5000000,36.0000000,'Kajiado','Loitokitok','Female',75,'Farmer','Primary','No','No','No','Open containers','High','70','26.70','6','Difficult',1,0),(896,'HH-896-4626',-1.5000000,36.0000000,'Kajiado','Loitokitok','Male',78,'Farmer','Primary','No','No','No','Open containers','High','70','26.70','6','Difficult',1,0);
/*!40000 ALTER TABLE `kemri_studyparticipants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_subcounties`
--

DROP TABLE IF EXISTS `kemri_subcounties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_subcounties` (
  `subcountyId` int NOT NULL AUTO_INCREMENT,
  `countyId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `email` text,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `geoSpatial` varchar(255) DEFAULT NULL,
  `polygon` text,
  `geoCode` varchar(255) DEFAULT NULL,
  `geoLat` varchar(255) DEFAULT NULL,
  `geoLon` varchar(255) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`subcountyId`),
  KEY `fk_subcounty_county` (`countyId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `fk_subcounty_county` FOREIGN KEY (`countyId`) REFERENCES `kemri_counties` (`countyId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_subcounties_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_subcounties_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_subcounties`
--

LOCK TABLES `kemri_subcounties` WRITE;
/*!40000 ALTER TABLE `kemri_subcounties` DISABLE KEYS */;
INSERT INTO `kemri_subcounties` VALUES (1,1,'SEME',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_241.geojson','483E0296-EFA6-40E7-BDD6-1F2A0A96C0A7','-0.14663','34.517169',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(2,1,'NYANDO',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_242.geojson','185A58CA-0D65-4886-9BC1-9D3CE235429B','-0.210135','34.867001',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(3,1,'NYAKACH',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_244.geojson','CDB2118E-7944-4F67-B7A3-A4BEEF904773','-0.321534','34.906165',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(4,1,'MUHORONI',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_243.geojson','6E7B2D40-2EF4-4722-8D60-75DD24040DF8','-0.105183','35.080538',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(5,1,'KISUMU WEST',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_239.geojson','2B3AB64D-4D01-4864-BDA2-571D4E0F2035','-0.089224','34.654886',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(6,1,'KISUMU EAST',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_238.geojson','BF36E5FE-0645-4D08-A67B-1FA2903DEA13','-0.106159','34.793786',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(7,1,'KISUMU CENTRAL',NULL,NULL,NULL,NULL,NULL,'geojson/constituency_240.geojson','A8B08C73-F08E-4AE3-984D-EED3E4796D3B','-0.115682','34.741149',0,1,'2024-04-27 15:25:15','2025-10-15 07:35:23',NULL),(8,1,'KADIBO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0','0',0,1,'2025-10-15 07:35:23','2025-10-15 07:35:23',NULL),(9,1,'Countywide',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'10','10',0,1,'2025-10-15 07:35:23','2025-10-15 07:35:23',NULL);
/*!40000 ALTER TABLE `kemri_subcounties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_subprograms`
--

DROP TABLE IF EXISTS `kemri_subprograms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_subprograms` (
  `subProgramId` int NOT NULL AUTO_INCREMENT,
  `programId` int DEFAULT NULL,
  `subProgramme` text,
  `keyOutcome` text,
  `kpi` text,
  `baseline` varchar(255) DEFAULT NULL,
  `yr1Targets` varchar(255) DEFAULT NULL,
  `yr2Targets` varchar(255) DEFAULT NULL,
  `yr3Targets` varchar(255) DEFAULT NULL,
  `yr4Targets` varchar(255) DEFAULT NULL,
  `yr5Targets` varchar(255) DEFAULT NULL,
  `yr1Budget` decimal(15,2) DEFAULT NULL,
  `yr2Budget` decimal(15,2) DEFAULT NULL,
  `yr3Budget` decimal(15,2) DEFAULT NULL,
  `yr4Budget` decimal(15,2) DEFAULT NULL,
  `yr5Budget` decimal(15,2) DEFAULT NULL,
  `totalBudget` decimal(15,2) DEFAULT NULL,
  `remarks` text,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`subProgramId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `kemri_subprograms_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_subprograms_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=774 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_subprograms`
--

LOCK TABLES `kemri_subprograms` WRITE;
/*!40000 ALTER TABLE `kemri_subprograms` DISABLE KEYS */;
INSERT INTO `kemri_subprograms` VALUES (1,6,'Agricultural Extension Services','Key outcome for Agricultural Extension Services','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Agricultural Extension Services',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(2,1,'Audit and Compliance Programs','Key outcome for Audit and Compliance Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Audit and Compliance Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(3,1,'Borehole Construction','Key outcome for Borehole Construction','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Borehole Construction',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(4,1,'Business Development Support','Key outcome for Business Development Support','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Business Development Support',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(5,1,'Certified Seeds Distribution','Key outcome for Certified Seeds Distribution','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Certified Seeds Distribution',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(6,1,'Climate Change Adaptation','Key outcome for Climate Change Adaptation','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Climate Change Adaptation',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(7,6,'Community Health Programs','Key outcome for Community Health Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Community Health Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(8,1,'Cultural Preservation Programs','Key outcome for Cultural Preservation Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Cultural Preservation Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(9,6,'Digital Government Services','Key outcome for Digital Government Services','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Digital Government Services',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(10,2,'Educational Equipment Procurement','Key outcome for Educational Equipment Procurement','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Educational Equipment Procurement',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(11,7,'Energy Infrastructure','Key outcome for Energy Infrastructure','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Energy Infrastructure',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(12,3,'Environmental Conservation Programs','Key outcome for Environmental Conservation Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Environmental Conservation Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(13,1,'Farmer Training Programs','Key outcome for Farmer Training Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Farmer Training Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(14,4,'Financial Planning and Budgeting','Key outcome for Financial Planning and Budgeting','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Financial Planning and Budgeting',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(15,4,'Financial Reporting Systems','Key outcome for Financial Reporting Systems','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Financial Reporting Systems',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(16,8,'Gender and Social Equity Programs','Key outcome for Gender and Social Equity Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Gender and Social Equity Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(17,6,'Health Facility Construction','Key outcome for Health Facility Construction','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Health Facility Construction',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(18,6,'Health Personnel Training','Key outcome for Health Personnel Training','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Health Personnel Training',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(19,1,'ICT Infrastructure Development','Key outcome for ICT Infrastructure Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: ICT Infrastructure Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(20,1,'Industrial Park Development','Key outcome for Industrial Park Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Industrial Park Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(21,1,'Innovation and Research Programs','Key outcome for Innovation and Research Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Innovation and Research Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(22,1,'Irrigation Development','Key outcome for Irrigation Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Irrigation Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(23,1,'Market Infrastructure Development','Key outcome for Market Infrastructure Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Market Infrastructure Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(24,1,'Medical Equipment Procurement','Key outcome for Medical Equipment Procurement','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Medical Equipment Procurement',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(25,1,'Public Building Construction','Key outcome for Public Building Construction','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Public Building Construction',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(26,1,'Renewable Energy Projects','Key outcome for Renewable Energy Projects','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Renewable Energy Projects',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(27,2,'Revenue Collection Enhancement','Key outcome for Revenue Collection Enhancement','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Revenue Collection Enhancement',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(28,1,'Road Construction and Maintenance','Key outcome for Road Construction and Maintenance','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Road Construction and Maintenance',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(29,1,'School Infrastructure Development','Key outcome for School Infrastructure Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: School Infrastructure Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(30,1,'Sports and Recreation Development','Key outcome for Sports and Recreation Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Sports and Recreation Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(31,1,'Student Support Programs','Key outcome for Student Support Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Student Support Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(32,1,'Teacher Training Programs','Key outcome for Teacher Training Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Teacher Training Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(33,9,'Technology Training Programs','Key outcome for Technology Training Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Technology Training Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(34,1,'Trade Facilitation Programs','Key outcome for Trade Facilitation Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Trade Facilitation Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(35,1,'Urban Planning and Development','Key outcome for Urban Planning and Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Urban Planning and Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(36,3,'Waste Management Systems','Key outcome for Waste Management Systems','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Waste Management Systems',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(37,1,'Water Infrastructure Development','Key outcome for Water Infrastructure Development','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Water Infrastructure Development',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(38,10,'Water Pipeline Extension','Key outcome for Water Pipeline Extension','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Water Pipeline Extension',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(39,10,'Water Treatment Facilities','Key outcome for Water Treatment Facilities','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Water Treatment Facilities',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(40,1,'Youth Development Programs','Key outcome for Youth Development Programs','Performance indicators','Baseline measurement',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Strategic plan subprogram: Youth Development Programs',NULL,NULL,'2025-09-26 14:37:11','2025-09-26 14:37:11',NULL),(701,601,'Integrated Disease Surveillance and Response (IDSR)','Timely detection and reporting of epidemic-prone diseases.','Percentage of alerts investigated within 48 hours','70%','75%','80%','85%','90%','95%',500000.00,600000.00,700000.00,800000.00,900000.00,3500000.00,'Focus on strengthening district-level surveillance.',0,NULL,'2025-08-08 07:30:57','2025-08-08 07:30:57',NULL),(702,601,'Laboratory Network Strengthening','Enhanced diagnostic capacity for priority diseases.','Number of labs achieving external quality assurance (EQA) certification','5','7','10','12','15','18',400000.00,7777.00,888777.00,50000.00,800000.00,946554.00,'1 Equipping and training for molecular diagnostics.\n2 User training on new molecular equipment maintenance',0,NULL,'2025-08-08 07:30:57','2025-08-08 07:30:57',NULL),(703,602,'Diabetes Prevention and Control','Reduced incidence and improved management of diabetes.','Prevalence of undiagnosed diabetes','15%','14%','13%','12%','11%','10%',700000.00,800000.00,900000.00,1000000.00,1100000.00,4500000.00,'Community screening and lifestyle modification programs.',0,NULL,'2025-08-08 07:30:57','2025-08-08 07:30:57',NULL),(704,603,'Antenatal Care (ANC) Uptake Improvement','Increased proportion of pregnant women attending 4+ ANC visits.','Percentage of pregnant women with 4+ ANC visits','60%','65%','70%','75%','80%','85%',300000.00,350000.00,400000.00,450000.00,500000.00,2000000.00,'Focus on hard-to-reach areas and mobile clinics.',0,NULL,'2025-08-08 07:30:57','2025-08-08 07:30:57',NULL),(705,604,'Climate-Sensitive Disease Early Warning Systems','Timely alerts for climate-sensitive disease outbreaks.','Number of climate-health early warning bulletins issued per quarter','2','3','4','5','6','7',450000.00,550000.00,650000.00,750000.00,850000.00,3250000.00,'Integration of meteorological and health data.',0,NULL,'2025-08-08 07:30:57','2025-08-08 07:30:57',NULL),(706,606,'asa','asa oee fxcx','asas','323','45','56','33','54','6',56666.00,54.00,43.00,34.00,44.00,56841.00,'44',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(707,610,'Increase skilled birth attendance rates','Skilled birth attendance rate (%)','70','75','80','85','90',NULL,'1000000',1200000.00,1500000.00,1800000.00,2000000.00,7500000.00,14000000.00,'Community health workers training and deployment',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(708,610,'Achieve 95% immunization coverage for children','Immunization coverage (%)','90','92','93','94','95',NULL,'500000',600000.00,700000.00,800000.00,900000.00,3500000.00,6500000.00,'Mobile clinics and awareness campaigns',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(709,611,'Construct 5 new ECDE centers annually','Number of new ECDE centers','0','5','5','5','5',NULL,'2000000',2500000.00,3000000.00,3500000.00,4000000.00,15000000.00,28000000.00,'Phased construction over 5 years',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(710,612,'Drill 10 new boreholes annually','Number of boreholes','0','10','10','10','10',NULL,'3000000',3200000.00,3500000.00,3800000.00,4000000.00,17500000.00,32000000.00,'Engage local contractors for drilling',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(711,613,'sdsds','dsd','sdd','1000','12','2','22','22','22',1000.00,2000.00,7000.00,6000.00,7000.00,1600.00,'',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(712,606,'testnu','ddd','dd','dd','','','','','',34555.00,67800.00,50000.00,9000000.00,8000000.00,17152355.00,'1. Year 1 looks good\n2. Year 1 budget appears too much',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(713,1,'ewersub','xcx\nxcx\nxc\nx','cxc\nxc\nxc\nxc','233','1','2','2','3','3',1200098.00,21111.00,3000000.00,977745.00,56665.00,122.00,'22222\nree\ns\ne\n\ne',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(714,1,'asas','asas',NULL,'asa','1','11','11','11','11',3000.00,323.00,23.00,323.00,23.00,323.00,'23',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(715,1,'Alpha subprogram','sdsd','sdsd','sd','sd','sds','sd','sd','sd',1121212.00,2121.00,121212.00,121212.00,1212.00,121212121.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(716,1,'2121`2','1212','1212','2`12','12','2`1','2','1`2',NULL,234343.00,4.00,3423.00,434.00,324.00,34234.00,'434',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(717,1,'sAS','AS',NULL,'AS','32','23','213','213','23',54545.00,454.00,454.00,45454544.00,NULL,NULL,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(718,1,'dsad test','sdsd','ds','sd',NULL,'12','21','12',NULL,344343434.00,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(719,1,'as','as','as','sas','as','sa','as','as',NULL,3434324.00,NULL,NULL,NULL,NULL,3434324.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(720,1,'sas','asa','asas',NULL,NULL,NULL,'sas',NULL,NULL,23232.00,NULL,NULL,NULL,NULL,23232.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(721,1,'sdsdsd','sds','sdsd','dsds','sdsd',NULL,NULL,NULL,'s43343',3434.00,343.00,3443.00,434.00,NULL,7654.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(722,1,'sdsd','sds','ds',NULL,'23',NULL,NULL,NULL,NULL,NULL,NULL,3434.00,NULL,21323343.00,21326777.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(723,1,'asa','as','as','as','asa','121',NULL,'1212',NULL,121.00,NULL,NULL,NULL,NULL,121.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(724,1,'sas','sas',NULL,NULL,NULL,NULL,NULL,'33232',NULL,232323.00,NULL,NULL,NULL,NULL,232323.00,NULL,0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(725,618,'Climate-Sensitive Disease Early Warning Systems ','232323','323','21212','1','121','zx12','12','21',1211212.00,1212.00,121.00,1212.00,2121.00,0.00,'sdsdsd\ndsds\nsdsd',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(726,618,'Achieve 95% immunization coverage for children','kpi','uuu','123','33','33','3','33','33',334554.00,32323.00,2323.00,232.00,23.00,369455.00,'323',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(727,601,'Hapa New SubProgram',NULL,NULL,NULL,'112','212','212','121','12',1000000.00,200000.00,30000.00,40000000.00,5000000.00,46230000.00,'21221\n12\n12',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(728,619,'1233','44','44','4','4','4','4','4','4',4.00,1.00,2.00,2.00,2.00,11.00,'2',0,NULL,'2025-08-08 07:30:57','2025-08-08 23:04:43',NULL),(729,NULL,'sdsd','sds','sdsd','1233','2','2','4','333wewe','3',50000.00,54444.00,423333.00,453444.00,44444.00,1025665.00,'4444',0,NULL,'2025-08-11 16:54:25','2025-08-11 16:54:25',NULL),(730,NULL,'Testing me alpha','dsds','dsd','2323','wewe','wewe','wewe','wew','we',434.00,3434.00,3434.00,3434343.00,43433434.00,46875079.00,'3434',0,NULL,'2025-08-11 16:56:31','2025-08-11 16:56:31',NULL),(731,NULL,'ikow api subprogram',NULL,NULL,NULL,NULL,'0','0','5000','00',9000.00,NULL,NULL,NULL,NULL,9000.00,NULL,0,NULL,'2025-08-11 17:02:46','2025-08-11 17:02:46',NULL),(732,NULL,'asasa','asasa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:03:24','2025-08-11 17:03:24',NULL),(733,NULL,'rrrr',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:03:54','2025-08-11 17:03:54',NULL),(734,NULL,'sdsdsad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:06:02','2025-08-11 17:06:02',NULL),(735,NULL,'sdsdsds',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:07:06','2025-08-11 17:07:06',NULL),(736,NULL,'dsdsdwere',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:09:54','2025-08-11 17:09:54',NULL),(737,NULL,'xzxzx','zxzxxzx',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:20:57','2025-08-11 17:20:57',NULL),(738,1,'wqwwqewqe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:24:23','2025-08-11 17:24:23',NULL),(739,1,'sasas','sas',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:27:28','2025-08-11 17:27:28',NULL),(740,1,'qwqw','rer','erer',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:28:50','2025-08-11 17:28:50',NULL),(741,601,'wewer','w',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,NULL,0,NULL,'2025-08-11 17:32:51','2025-08-11 17:36:31',NULL),(742,601,'ssss','uuu','sss',NULL,'10','30003','3','30020','40000',4500000.00,45000.00,10000.00,65000000.00,820020.00,70375020.00,'uiiuii',0,NULL,'2025-08-11 18:51:53','2025-08-11 18:51:53',NULL),(743,601,'sdsds',NULL,'dsdsd',NULL,'1','3','50000','5','4',3000.00,70000.00,70000.00,80000.00,80000000.00,80223000.00,NULL,0,NULL,'2025-08-11 19:03:51','2025-08-11 19:03:51',NULL),(744,601,'wewqewe','ere','rere',NULL,'3','3','3','3','6',50000.00,60000.00,700000.00,650000.00,8100000.00,9560000.00,'rere',0,NULL,'2025-08-11 19:33:20','2025-08-11 19:33:20',NULL),(745,622,'resdtt','asas','aasa',NULL,'1','3','5','7','9',70000.00,600000.00,57000.00,9.00,11.00,727020.00,'asa',0,NULL,'2025-08-11 20:38:10','2025-08-11 20:38:10',NULL),(746,624,'Kibera Sanitation and Waste Management','Improved sanitation and waste management in Kibera slums','Number of households with access to improved sanitation','2000','2500','3000','3500','4000','500000',750000.00,1000000.00,1250000.00,1500000.00,5000000.00,9500000.00,'Phased implementation over 5 years.',0,NULL,'2025-08-13 20:12:38','2025-08-13 21:49:41',NULL),(747,625,'Community Maternal Health Outreach','Increased skilled birth attendance rates','Skilled birth attendance rate (%)','70','75','80','85','90','1000000',1200000.00,1500000.00,1800000.00,2000000.00,7500000.00,14000000.00,'Community health workers training and deployment.',0,NULL,'2025-08-13 20:12:38','2025-08-13 21:49:41',NULL),(748,626,'Informal Settlement Waste Collection','Establish community-led waste collection points','Number of new waste collection points established','5',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'2025-08-13 20:12:38','2025-08-13 20:12:38',NULL),(749,627,'Subprogram 1','Improved Medical Services, Public Health and Sanitation services','Service rate (%)','72','90','95','98','100','100',2862461.00,6410471.00,16015235.00,25010091.00,34566446.00,84864704.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(750,628,'Subprogram 2','Improved Sports, Culture, Gender and Youth Affairs services','Service rate (%)','72','88','91','98','100','100',4731634.00,7016538.00,15400937.00,26713864.00,35922635.00,89785608.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(751,629,'Subprogram 3','Improved City of Kisumu Management services','Service rate (%)','56','84','94','100','100','100',1466278.00,7270887.00,17051180.00,25126008.00,38695962.00,89610315.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(752,630,'Subprogram 4','Improved Trade, Tourism, Industry and Marketing services','Service rate (%)','79','82','92','97','100','100',2778738.00,7438172.00,19463049.00,20483460.00,40240269.00,90403688.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(753,631,'Subprogram 5','Improved Finance, Economic Planning and ICT(E-Government) Services services','Service rate (%)','80','82','91','97','100','100',3647583.00,6984587.00,19959643.00,21743044.00,32901522.00,85236379.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(754,632,'Subprogram 6','Improved Finance, Economic Planning and ICT(E-Government) Services services','Service rate (%)','53','88','95','96','100','100',4858134.00,9630822.00,15708315.00,23538358.00,32048817.00,85784446.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(755,633,'Subprogram 7','Improved City of Kisumu Management services','Service rate (%)','73','82','93','96','100','100',2977045.00,8100605.00,16118249.00,25006646.00,47940034.00,100142579.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(756,634,'Subprogram 8','Improved Infrastructure, Energy and Public Works services','Service rate (%)','57','87','94','99','100','100',2907794.00,7250576.00,13170529.00,22713822.00,33949637.00,79992358.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(757,635,'Subprogram 9','Improved Finance, Economic Planning and ICT(E-Government) Services services','Service rate (%)','60','81','91','96','100','100',4768130.00,6971414.00,16997629.00,29088651.00,30425434.00,88251258.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(758,636,'Subprogram 10','Improved Education, Technical Training, Innovation and Social Services services','Service rate (%)','75','86','92','98','100','100',4359028.00,9905206.00,11667633.00,25153588.00,37252044.00,88337499.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(759,637,'Subprogram 11','Improved Water, Environment, Natural Resources and Climate Change services','Service rate (%)','71','87','92','96','100','100',2924017.00,9217652.00,10703767.00,26797142.00,37090239.00,86732817.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(760,638,'Subprogram 12','Improved Education, Technical Training, Innovation and Social Services services','Service rate (%)','64','87','91','100','100','100',1689158.00,9043482.00,10020117.00,26256868.00,45445076.00,92454701.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(761,639,'Subprogram 13','Improved Sports, Culture, Gender and Youth Affairs services','Service rate (%)','79','82','94','97','100','100',3813780.00,6948930.00,12346555.00,22939684.00,33928269.00,79977218.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(762,640,'Subprogram 14','Improved Water, Environment, Natural Resources and Climate Change services','Service rate (%)','77','88','93','96','100','100',2300600.00,8368717.00,10465141.00,22498648.00,34736198.00,78369304.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(763,641,'Subprogram 15','Improved Medical Services, Public Health and Sanitation services','Service rate (%)','54','87','92','99','100','100',3599538.00,9558741.00,17250528.00,25908452.00,32489376.00,88806635.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(764,642,'Subprogram 16','Improved Medical Services, Public Health and Sanitation services','Service rate (%)','52','87','95','100','100','100',4744626.00,9945801.00,11939394.00,24612195.00,33744272.00,84986288.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(765,643,'Subprogram 17','Improved Public Service, County Administration services','Service rate (%)','59','84','91','98','100','100',2185010.00,8690085.00,11644809.00,24726512.00,40690322.00,87936738.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(766,644,'Subprogram 18','Improved Public Service, County Administration services','Service rate (%)','62','86','92','100','100','100',3338429.00,8676444.00,15634688.00,23709377.00,37694086.00,89053024.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(767,645,'Subprogram 19','Improved Water, Environment, Natural Resources and Climate Change services','Service rate (%)','69','90','91','100','100','100',4684448.00,9771052.00,15941605.00,21463713.00,40141302.00,92002120.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(768,646,'Subprogram 20','Improved Agriculture, Fisheries, Livestock Development and Irrigation services','Service rate (%)','76','86','93','99','100','100',2003274.00,6253909.00,14451333.00,26576201.00,44806878.00,94091595.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(769,647,'Subprogram 21','Improved Infrastructure, Energy and Public Works services','Service rate (%)','55','90','93','97','100','100',1171057.00,5109728.00,15774130.00,27407346.00,37231639.00,86693900.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(770,648,'Subprogram 22','Improved Medical Services, Public Health and Sanitation services','Service rate (%)','57','84','93','98','100','100',4188573.00,8744270.00,17834337.00,27059258.00,38416474.00,96242912.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(771,649,'Subprogram 23','Improved Sports, Culture, Gender and Youth Affairs services','Service rate (%)','79','90','94','98','100','100',4929595.00,7419924.00,19111932.00,25758081.00,40004297.00,97223829.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(772,650,'Subprogram 24','Improved Agriculture, Fisheries, Livestock Development and Irrigation services','Service rate (%)','79','90','93','99','100','100',1768085.00,8789419.00,19277318.00,28133302.00,41676450.00,99644574.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL),(773,651,'Subprogram 25','Improved Public Service, County Administration services','Service rate (%)','63','82','95','97','100','100',2255310.00,9628839.00,12593324.00,27877274.00,33141920.00,85496667.00,'Community training and deployment.',0,NULL,'2025-08-27 20:06:49','2025-08-27 20:06:49',NULL);
/*!40000 ALTER TABLE `kemri_subprograms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_users`
--

DROP TABLE IF EXISTS `kemri_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `email` text,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `voided` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_users`
--

LOCK TABLES `kemri_users` WRITE;
/*!40000 ALTER TABLE `kemri_users` DISABLE KEYS */;
INSERT INTO `kemri_users` VALUES (1,'testuser','$2b$10$NnXB0EdxugGjczGSVL9n4uGdwRg7YmyRvYswALG4b7UUhZLWcmuOW','test@example.com','Test','User',1,1,'2025-07-15 18:21:53','2025-10-02 07:20:59',0),(2,'akwatuha','$2b$10$QtfPgO.TsMeK/hkWEvY6vOOcKtbYxqG7kBM.cEKned64YTWi2Us6.','kwatuha@gmail.com','Alfayo','Kwatuha',1,1,'2025-07-15 18:36:23','2025-10-02 07:34:25',0),(3,'emaru','$2b$10$rw1otXRYFaSSL2p7xOE3SOV3NJ3oqx0eebF6eNQe02GuYLz3GkrJ.','maru@gmail.com','Ezekiel','Maru',1,1,'2025-07-18 20:09:54','2025-07-18 20:09:54',0),(4,'testal','$2b$10$7IzckbsdsdV7CzLzMW2y0.0WqLfNdHwxrtnqqwT35uyhWLXdmAMtu','test@gmail.com','Testing','Teser',1,1,'2025-07-18 20:20:27','2025-07-18 20:20:27',0),(5,'testuser','$2b$10$AK.zhA7okyFJtXgyF12NhezYzKENXqMeHZ2c3l8z7Q.u0y9Zd1mCa','test@example.com','Test','User',1,1,'2025-07-15 21:21:53','2025-07-18 23:17:20',0),(6,'akwatuha','$2b$10$QtfPgO.TsMeK/hkWEvY6vOOcKtbYxqG7kBM.cEKned64YTWi2Us6.','kwatuha@gmail.com','Alfayo','Kwatuha',1,1,'2025-07-15 21:36:23','2025-07-18 21:34:44',0),(7,'emaru','$2b$10$rw1otXRYFaSSL2p7xOE3SOV3NJ3oqx0eebF6eNQe02GuYLz3GkrJ.','maru@gmail.com','Ezekiel','Maru',1,1,'2025-07-18 23:09:54','2025-07-18 23:09:54',0),(8,'testal','$2b$10$7IzckbsdsdV7CzLzMW2y0.0WqLfNdHwxrtnqqwT35uyhWLXdmAMtu','test@gmail.com','Testing','Teser',1,1,'2025-07-18 23:20:27','2025-07-18 23:20:27',0),(9,'ekwat','$2b$10$tCRDO7m2sFekGA6uUZ9PJ.nS.S4odkXvrb4cJIK/sjQkAYlNNhmku','alpha@yahoo.com','Alphone','Makaja',21,1,'2025-07-30 14:34:42','2025-10-02 07:36:36',0),(10,'contractor','$2b$10$lVk9/fJPmCTEQv.IvobTg.wa6lPSlUe5Vq7ml9HhRNCXjGf6SoWVG','contractor@gmail.com','John ','Doe',21,1,'2025-08-09 23:47:10','2025-08-09 23:47:10',0),(11,'george11','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','george11@kisumu.co.ke','George','Taylor',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(12,'edward12','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward12@kisumu.co.ke','Edward','Miller',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(13,'george13','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','george13@kisumu.co.ke','George','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(14,'alice14','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice14@kisumu.co.ke','Alice','Davis',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(15,'bob15','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','bob15@kisumu.co.ke','Bob','Jones',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(16,'diana16','$2b$10$XAjMehMxLb5DzKCLP2DH6.dQ71AxjXAC7a9mp.dX67pd66Alr2aie','diana16@kisumu.co.ke','Diana','Evans',6,1,'2025-08-29 06:21:13','2025-10-04 12:27:19',0),(17,'charlie17','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','charlie17@kisumu.co.ke','Charlie','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(18,'edward18','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward18@kisumu.co.ke','Edward','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(19,'hannah19','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','hannah19@kisumu.co.ke','Hannah','Taylor',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(20,'alice20','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice20@kisumu.co.ke','Alice','Evans',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(21,'bob21','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','bob21@kisumu.co.ke','Bob','Davis',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(22,'fiona22','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','fiona22@kisumu.co.ke','Fiona','Smith',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(23,'edward23','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward23@kisumu.co.ke','Edward','Davis',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(24,'edward24','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward24@kisumu.co.ke','Edward','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(25,'alice25','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice25@kisumu.co.ke','Alice','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(26,'edward26','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward26@kisumu.co.ke','Edward','Wilson',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(27,'diana27','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','diana27@kisumu.co.ke','Diana','Jones',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(28,'alice28','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice28@kisumu.co.ke','Alice','Jones',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(29,'fiona29','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','fiona29@kisumu.co.ke','Fiona','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(30,'charlie30','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','charlie30@kisumu.co.ke','Charlie','Brown',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(31,'fmulama','$2b$10$L1MfyylehMAyorTCNiEhNuWbfu404tiDkL5km5vEhbl8gD5785aYi','alfam1989@gmail.com','Alpha','Mulama',6,1,'2025-10-02 07:41:05','2025-10-02 07:41:05',0),(32,'fmudola','$2b$10$uBJ8BCfDyJu71uUR8z0IW.LqgrDkh/A9.AhrTNKWY/MQjCZeBMoxe','fmula@gmailc.com','Farice','Mudol',20,1,'2025-10-02 15:13:03','2025-10-02 15:13:03',0);
/*!40000 ALTER TABLE `kemri_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kemri_wards`
--

DROP TABLE IF EXISTS `kemri_wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kemri_wards` (
  `wardId` int NOT NULL AUTO_INCREMENT,
  `subcountyId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `email` text,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `polygon` text,
  `geoSpatial` varchar(255) DEFAULT NULL,
  `geoCode` varchar(255) DEFAULT NULL,
  `geoLat` varchar(255) DEFAULT NULL,
  `geoLon` varchar(255) DEFAULT NULL,
  `voided` tinyint(1) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voidedBy` int DEFAULT NULL,
  PRIMARY KEY (`wardId`),
  KEY `fk_ward_subcounty` (`subcountyId`),
  KEY `userId` (`userId`),
  KEY `voidedBy` (`voidedBy`),
  CONSTRAINT `fk_ward_subcounty` FOREIGN KEY (`subcountyId`) REFERENCES `kemri_subcounties` (`subcountyId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_wards_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `kemri_wards_ibfk_2` FOREIGN KEY (`voidedBy`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_wards`
--

LOCK TABLES `kemri_wards` WRITE;
/*!40000 ALTER TABLE `kemri_wards` DISABLE KEYS */;
INSERT INTO `kemri_wards` VALUES (1,1,'WEST SEME',NULL,NULL,NULL,NULL,'geojson/ward_1202.geojson',NULL,'39687CCF-1572-48AD-85D6-5D7C1DE730CB','-0.183905','34.484834',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(2,3,'WEST NYAKACH',NULL,NULL,NULL,NULL,'geojson/ward_1219.geojson',NULL,'630EF613-E9DE-48EE-80BF-89980C6231FD','-0.315152','34.81339',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(3,5,'WEST KISUMU',NULL,NULL,NULL,NULL,'geojson/ward_1194.geojson',NULL,'3E112DF7-0A58-4454-868B-7E77CE7E46DC','-0.050197','34.640099',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(4,3,'SOUTH WEST NYAKACH',NULL,NULL,NULL,NULL,'geojson/ward_1216.geojson',NULL,'76ED48F1-46B2-4409-8BAD-63A4A238E08F','-0.37674','34.910834',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(5,5,'SOUTH WEST KISUMU',NULL,NULL,NULL,NULL,'geojson/ward_1191.geojson',NULL,'6E21783C-41A0-4ACB-A24B-DC058FB15E03','-0.130812','34.631604',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(6,3,'SOUTH EAST NYAKACH',NULL,NULL,NULL,NULL,'geojson/ward_1220.geojson',NULL,'55A25CE8-3677-4064-96EC-6F650D8BE173','-0.365169','34.974202',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(7,7,'SHAURIMOYO KALOLENI',NULL,NULL,NULL,NULL,'geojson/ward_1198.geojson',NULL,'CC68431F-BD9F-40BA-A462-1D3CFD4CC798','-0.091383','34.767243',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(8,7,'RAILWAYS',NULL,NULL,NULL,NULL,'geojson/ward_1196.geojson',NULL,'69A3D78A-3F7E-4A8F-9F07-A705BE4E4B0A','-0.068981','34.756676',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(9,4,'OMBEYI',NULL,NULL,NULL,NULL,'geojson/ward_1212.geojson',NULL,'1290A778-69AF-4842-9A95-DBDDD49C1E96','-0.104543','34.925022',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(10,7,'NYALENDA B',NULL,NULL,NULL,NULL,'geojson/ward_1201.geojson',NULL,'E18385FF-4FA0-45E6-9319-DDC32F2E8B0D','-0.142473','34.732296',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(11,6,'NYALENDA \'A\'',NULL,NULL,NULL,NULL,'geojson/ward_1189.geojson',NULL,'32F22EA0-D320-45C2-A382-8A5C4FDB1301','-0.110778','34.772652',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(12,5,'NORTH WEST KISUMU',NULL,NULL,NULL,NULL,'geojson/ward_1195.geojson',NULL,'91290829-83FC-4537-9927-79DEFE9F3C5A','-0.016844','34.617314',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(13,1,'NORTH SEME',NULL,NULL,NULL,NULL,'geojson/ward_1205.geojson',NULL,'68FF0601-E8F4-4813-88DE-4BCBD5C8A3CF','-0.049353','34.501523',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(14,3,'NORTH NYAKACH',NULL,NULL,NULL,NULL,'geojson/ward_1217.geojson',NULL,'87A5C25A-0477-46C8-B375-AFF2FF631729','-0.273269','34.966254',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(15,4,'MUHORONI/KORU',NULL,NULL,NULL,NULL,'geojson/ward_1215.geojson',NULL,'5EAF373B-B064-42AB-82E6-6E954A75F277','-0.171079','35.253127',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(16,4,'MIWANI',NULL,NULL,NULL,NULL,'geojson/ward_1211.geojson',NULL,'1EA2D97F-FFF8-46F2-9ABF-B81179D1800A','-0.045109','34.925275',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(17,7,'MIGOSI',NULL,NULL,NULL,NULL,'geojson/ward_1197.geojson',NULL,'1877C325-5AFC-46DC-A702-1C68C972521C','-0.069772','34.777945',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(18,4,'MASOGO/NYANG\'OMA',NULL,NULL,NULL,NULL,'geojson/ward_1213.geojson',NULL,'668761A7-E8B2-4937-8C38-551C60CBA7BE','-0.111696','35.04683',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(19,7,'MARKET MILIMANI',NULL,NULL,NULL,NULL,'geojson/ward_1199.geojson',NULL,'F8699095-5E70-471B-87E1-EC9A04B36438','-0.123495','34.725161',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(20,6,'MANYATTA \'B\'',NULL,NULL,NULL,NULL,'geojson/ward_1188.geojson',NULL,'48D26BA6-7CA3-4ABC-A382-25A1FE71ED1F','-0.085293','34.784513',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(21,7,'KONDELE',NULL,NULL,NULL,NULL,'geojson/ward_1200.geojson',NULL,'9765636A-5F60-4DF6-8882-FF9A33D1822E','-0.0839','34.779663',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(22,6,'KOLWA EAST',NULL,NULL,NULL,NULL,'geojson/ward_1187.geojson',NULL,'62D4D8D2-7B87-4D98-8F67-8AFB6804EB00','-0.124745','34.808883',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(23,6,'KOLWA CENTRAL',NULL,NULL,NULL,NULL,'geojson/ward_1190.geojson',NULL,'C913BA5A-FE03-4CD4-A3B5-6595F5EE7303','-0.126029','34.77382',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(24,2,'KOBURA',NULL,NULL,NULL,NULL,'geojson/ward_1210.geojson',NULL,'430CE20E-247D-48B7-8FDA-DFF151C7AA20','-0.186182','34.763932',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(25,8,'kOBURA','','','','',NULL,NULL,NULL,'0','0',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(26,5,'KISUMU NORTH',NULL,NULL,NULL,NULL,'geojson/ward_1193.geojson',NULL,'D50B521F-96CC-4D21-9E62-748264D621D1','-0.031826','34.724293',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(27,6,'KAJULU',NULL,NULL,NULL,NULL,'geojson/ward_1186.geojson',NULL,'96D7D848-67E3-44C2-B573-31B3A8BDEF69','-0.025538','34.79142',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(28,2,'KABONYO/KANYAGWAL',NULL,NULL,NULL,NULL,'geojson/ward_1209.geojson',NULL,'F83918D0-2100-4D67-A78A-F77A0A174796','-0.234843','34.78082',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(29,8,'kABONYO','','','','',NULL,NULL,NULL,'0','0',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(30,1,'EAST SEME',NULL,NULL,NULL,NULL,'geojson/ward_1204.geojson',NULL,'27ADA6C9-DD08-4BB4-A7C9-D8DCF51A31CD','-0.095034','34.563529',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(31,2,'EAST KANO/WAWIDHI',NULL,NULL,NULL,NULL,'geojson/ward_1206.geojson',NULL,'A9B1B262-35F8-47D8-B487-FC4FCA1E1696','-0.223412','35.000012',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(32,4,'CHEMELIL',NULL,NULL,NULL,NULL,'geojson/ward_1214.geojson',NULL,'D75450CA-FB44-442C-9DD6-5614EF5087BC','-0.069691','35.152636',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(33,1,'CENTRAL SEME',NULL,NULL,NULL,NULL,'geojson/ward_1203.geojson',NULL,'E116932B-7588-45CB-8264-C50130465943','-0.162358','34.548493',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(34,3,'CENTRAL NYAKACH',NULL,NULL,NULL,NULL,'geojson/ward_1218.geojson',NULL,'2869E9B7-392C-4728-B325-38C7AD57F4B1','-0.310445','34.9161',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(35,5,'CENTRAL KISUMU',NULL,NULL,NULL,NULL,'geojson/ward_1192.geojson',NULL,'C495B889-7B84-48AE-A493-C8AF68C60F49','-0.095107','34.702204',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(36,2,'AWASI/ONJIKO',NULL,NULL,NULL,NULL,'geojson/ward_1207.geojson',NULL,'770191E4-FDE0-4A01-8BB2-3AC6D1603255','-0.174287','35.065386',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL),(37,2,'AHERO',NULL,NULL,NULL,NULL,'geojson/ward_1208.geojson',NULL,'E0AE0A69-5324-42B0-9616-740551C71733','-0.186427','34.937169',0,1,'2025-10-15 04:47:26','2025-10-15 04:47:26',NULL);
/*!40000 ALTER TABLE `kemri_wards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `public_feedback`
--

DROP TABLE IF EXISTS `public_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `public_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Optional - Respondent name (for follow-up)',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` int DEFAULT NULL,
  `status` enum('pending','reviewed','responded','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `responded_by` int DEFAULT NULL,
  `responded_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rating_overall_support` tinyint DEFAULT NULL COMMENT 'Overall Satisfaction/Support (1=Strongly Oppose, 5=Strongly Support)',
  `rating_quality_of_life_impact` tinyint DEFAULT NULL COMMENT 'Perceived Impact on Quality of Life (1=Highly Negative, 5=Highly Positive)',
  `rating_community_alignment` tinyint DEFAULT NULL COMMENT 'Alignment with Community Needs (1=Not Aligned, 5=Perfectly Aligned)',
  `rating_transparency` tinyint DEFAULT NULL COMMENT 'Perceived Transparency and Communication (1=Very Poor, 5=Excellent)',
  `rating_feasibility_confidence` tinyint DEFAULT NULL COMMENT 'Confidence in Timeline and Budget (1=Very Low, 5=Very High)',
  PRIMARY KEY (`id`),
  KEY `responded_by` (`responded_by`),
  KEY `idx_status` (`status`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_ratings` (`rating_overall_support`,`rating_quality_of_life_impact`,`rating_community_alignment`,`rating_transparency`,`rating_feasibility_confidence`),
  CONSTRAINT `public_feedback_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `kemri_projects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `public_feedback_ibfk_2` FOREIGN KEY (`responded_by`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `public_feedback_chk_1` CHECK ((`rating_overall_support` between 1 and 5)),
  CONSTRAINT `public_feedback_chk_2` CHECK ((`rating_quality_of_life_impact` between 1 and 5)),
  CONSTRAINT `public_feedback_chk_3` CHECK ((`rating_community_alignment` between 1 and 5)),
  CONSTRAINT `public_feedback_chk_4` CHECK ((`rating_transparency` between 1 and 5)),
  CONSTRAINT `public_feedback_chk_5` CHECK ((`rating_feasibility_confidence` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Public feedback with 5-point Likert scale ratings for county projects';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `public_feedback`
--

LOCK TABLES `public_feedback` WRITE;
/*!40000 ALTER TABLE `public_feedback` DISABLE KEYS */;
INSERT INTO `public_feedback` VALUES (1,'Test User','test@example.com','+254 700 000 000','Test feedback','This is a test feedback message',NULL,'pending',NULL,NULL,NULL,'2025-10-10 22:08:44','2025-10-10 22:08:44',NULL,NULL,NULL,NULL,NULL),(2,'Alfayo Kwatuha','kwatuha@gmail.com','0718109108','Improvement ','It requires more staff to run this projects',NULL,'responded','Your feedback is highly appreciated, we look forward  to increasing the number of staff for this facilicty',2,'2025-10-10 23:10:48','2025-10-10 22:09:53','2025-10-10 23:10:48',NULL,NULL,NULL,NULL,NULL),(3,'Maina Francis','fmaina@gmail.com','0718109196','Curlvert Blockage','This road has several blocked culverts causing damages to road shoulders',NULL,'pending',NULL,NULL,NULL,'2025-10-11 00:43:11','2025-10-11 00:43:11',NULL,NULL,NULL,NULL,NULL),(4,'Test User with Ratings','test.ratings@example.com','+254 712 345 678','Test Feedback with Ratings','This is a test feedback submission to verify the rating system works correctly.',NULL,'pending',NULL,NULL,NULL,'2025-10-11 22:55:26','2025-10-11 22:55:26',5,4,5,3,4),(5,'Test User without Ratings','test.no.ratings@example.com','+254 712 345 679','Test Feedback without Ratings','This feedback has no ratings - testing that they are optional.',NULL,'pending',NULL,NULL,NULL,'2025-10-11 22:55:27','2025-10-11 22:55:27',NULL,NULL,NULL,NULL,NULL),(6,'test','sdsa','sd','sd','fdfdfdsf',NULL,'pending',NULL,NULL,NULL,'2025-10-11 23:03:52','2025-10-11 23:03:52',1,1,3,5,2),(7,NULL,NULL,NULL,NULL,'This is anonymous feedback - testing that name is now optional',NULL,'pending',NULL,NULL,NULL,'2025-10-11 23:19:52','2025-10-11 23:19:52',4,NULL,NULL,NULL,NULL),(8,'','','','Feedback on: Mwingi East ICT Incubation Hub Setup','The project is taking too long to be completed',NULL,'pending',NULL,NULL,NULL,'2025-10-12 00:01:06','2025-10-12 00:01:06',1,3,2,2,4);
/*!40000 ALTER TABLE `public_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_dashboard_config`
--

DROP TABLE IF EXISTS `role_dashboard_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_dashboard_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `tab_key` varchar(50) NOT NULL,
  `component_key` varchar(100) NOT NULL,
  `component_order` int DEFAULT '0',
  `is_required` tinyint(1) DEFAULT '0',
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_tab_component` (`role_name`,`tab_key`,`component_key`),
  KEY `component_key` (`component_key`),
  KEY `idx_role_dashboard_config_role` (`role_name`),
  KEY `idx_role_dashboard_config_tab` (`tab_key`),
  CONSTRAINT `role_dashboard_config_ibfk_1` FOREIGN KEY (`tab_key`) REFERENCES `dashboard_tabs` (`tab_key`),
  CONSTRAINT `role_dashboard_config_ibfk_2` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_dashboard_config`
--

LOCK TABLES `role_dashboard_config` WRITE;
/*!40000 ALTER TABLE `role_dashboard_config` DISABLE KEYS */;
INSERT INTO `role_dashboard_config` VALUES (12,'contractor','overview','contractorMetrics',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(13,'contractor','overview','recentActivity',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(14,'contractor','projects','assignedTasks',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(15,'contractor','projects','projectComments',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(16,'contractor','projects','projectActivity',3,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(17,'contractor','payments','paymentRequests',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(18,'contractor','payments','paymentHistory',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(19,'contractor','payments','financialSummary',3,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(20,'project_manager','overview','metrics',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(21,'project_manager','overview','quickStats',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(22,'project_manager','overview','recentActivity',3,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(23,'project_manager','projects','tasks',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(24,'project_manager','projects','activity',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(25,'project_manager','projects','alerts',3,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(26,'project_manager','collaboration','teamDirectory',1,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(27,'project_manager','collaboration','announcements',2,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(28,'project_manager','collaboration','conversations',3,1,NULL,'2025-09-30 11:08:28','2025-09-30 13:27:43'),(158,'user','overview','metrics',1,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(159,'user','overview','quickStats',2,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(160,'user','overview','contractorMetrics',3,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(161,'user','overview','project_metrics_card',4,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(162,'user','overview','budget_overview_card',5,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(163,'user','overview','user_stats_card',6,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43'),(164,'user','overview','financialSummary',7,1,'{}','2025-10-02 11:33:43','2025-10-02 11:33:43');
/*!40000 ALTER TABLE `role_dashboard_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_dashboard_permissions`
--

DROP TABLE IF EXISTS `role_dashboard_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_dashboard_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `permission_key` varchar(100) NOT NULL,
  `granted` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_name`,`permission_key`),
  KEY `permission_key` (`permission_key`),
  KEY `idx_role_dashboard_permissions_role` (`role_name`),
  CONSTRAINT `role_dashboard_permissions_ibfk_1` FOREIGN KEY (`permission_key`) REFERENCES `dashboard_permissions` (`permission_key`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_dashboard_permissions`
--

LOCK TABLES `role_dashboard_permissions` WRITE;
/*!40000 ALTER TABLE `role_dashboard_permissions` DISABLE KEYS */;
INSERT INTO `role_dashboard_permissions` VALUES (17,'contractor','view_metrics',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(18,'contractor','view_quick_stats',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(19,'contractor','view_activity',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(20,'contractor','view_tasks',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(21,'contractor','manage_tasks',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(22,'contractor','view_alerts',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(23,'contractor','manage_alerts',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(24,'contractor','view_team_directory',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(25,'contractor','view_announcements',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(26,'contractor','view_conversations',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(27,'contractor','view_analytics',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(28,'contractor','view_reports',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(29,'contractor','generate_reports',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(30,'contractor','view_payment_requests',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(31,'contractor','submit_payment_requests',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(32,'contractor','view_payment_history',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(33,'contractor','view_financial_summary',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(34,'project_manager','view_metrics',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(35,'project_manager','view_quick_stats',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(36,'project_manager','view_activity',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(37,'project_manager','view_tasks',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(38,'project_manager','manage_tasks',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(39,'project_manager','view_alerts',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(40,'project_manager','manage_alerts',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(41,'project_manager','view_team_directory',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(42,'project_manager','view_announcements',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(43,'project_manager','view_conversations',1,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(44,'project_manager','view_analytics',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(45,'project_manager','view_reports',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(46,'project_manager','generate_reports',0,'2025-09-30 11:08:28','2025-09-30 11:08:28'),(58,'admin','view_project_summary',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(59,'admin','view_recent_activities',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(60,'admin','view_project_stats',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(61,'admin','manage_users',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(62,'admin','view_projects',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(63,'admin','view_reports',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(64,'admin','view_active_users',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(65,'admin','view_kpi_metrics',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(66,'admin','view_contractor_metrics',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(67,'admin','view_financial_summary',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(68,'admin','view_user_stats',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(69,'admin','view_project_metrics',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(70,'admin','view_budget_overview',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(71,'admin','view_charts_dashboard',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(72,'admin','view_project_tasks',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(73,'admin','view_project_activities',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(74,'admin','view_project_alerts',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(75,'admin','view_team_directory',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(76,'admin','view_team_announcements',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(77,'admin','view_recent_conversations',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(78,'admin','manage_users_table',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(79,'admin','manage_projects_table',1,'2025-10-02 11:13:52','2025-10-02 11:13:52'),(80,'admin','use_quick_actions',1,'2025-10-02 11:13:52','2025-10-02 11:13:52');
/*!40000 ALTER TABLE `role_dashboard_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_dashboard_preferences`
--

DROP TABLE IF EXISTS `user_dashboard_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_dashboard_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tab_key` varchar(50) NOT NULL,
  `component_key` varchar(100) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT '1',
  `component_order` int DEFAULT '0',
  `custom_settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_tab_component` (`user_id`,`tab_key`,`component_key`),
  KEY `tab_key` (`tab_key`),
  KEY `component_key` (`component_key`),
  KEY `idx_user_dashboard_preferences_user` (`user_id`),
  CONSTRAINT `user_dashboard_preferences_ibfk_1` FOREIGN KEY (`tab_key`) REFERENCES `dashboard_tabs` (`tab_key`),
  CONSTRAINT `user_dashboard_preferences_ibfk_2` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_dashboard_preferences`
--

LOCK TABLES `user_dashboard_preferences` WRITE;
/*!40000 ALTER TABLE `user_dashboard_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_dashboard_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_data_filters`
--

DROP TABLE IF EXISTS `user_data_filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_data_filters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `filter_type` enum('budget_range','progress_status','project_type','date_range','custom') NOT NULL,
  `filter_key` varchar(100) NOT NULL,
  `filter_value` json NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user_filter_user` (`user_id`),
  KEY `idx_filter_type` (`filter_type`),
  CONSTRAINT `fk_user_filter_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_data_filters`
--

LOCK TABLES `user_data_filters` WRITE;
/*!40000 ALTER TABLE `user_data_filters` DISABLE KEYS */;
INSERT INTO `user_data_filters` VALUES (1,1,'budget_range','project_budget','{\"max\": 10000000, \"min\": 0}',1,'2025-10-02 05:47:03','2025-10-02 05:47:03'),(2,1,'progress_status','project_status','[\"active\", \"planning\", \"completed\"]',1,'2025-10-02 05:47:03','2025-10-02 05:47:03'),(3,1,'project_type','project_category','[\"infrastructure\", \"health\", \"education\"]',1,'2025-10-02 05:47:03','2025-10-02 05:47:03'),(4,1,'date_range','project_dates','{\"end\": \"2024-12-31\", \"start\": \"2024-01-01\"}',1,'2025-10-02 05:56:22','2025-10-02 05:56:22'),(5,1,'custom','user_role_specific','{\"role\": \"admin\", \"show_all\": true}',1,'2025-10-02 05:56:22','2025-10-02 05:56:22'),(6,3,'budget_range','project_budget','{\"max\": 100000000, \"min\": 0}',1,'2025-10-02 06:24:20','2025-10-02 06:24:20');
/*!40000 ALTER TABLE `user_data_filters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_department_assignments`
--

DROP TABLE IF EXISTS `user_department_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_department_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department_id` int NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_department` (`user_id`,`department_id`),
  KEY `fk_user_dept_user` (`user_id`),
  KEY `fk_user_dept_department` (`department_id`),
  CONSTRAINT `fk_user_dept_department` FOREIGN KEY (`department_id`) REFERENCES `kemri_departments` (`departmentId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_dept_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_department_assignments`
--

LOCK TABLES `user_department_assignments` WRITE;
/*!40000 ALTER TABLE `user_department_assignments` DISABLE KEYS */;
INSERT INTO `user_department_assignments` VALUES (1,1,1,1,'2025-10-02 05:47:03','2025-10-02 05:55:47'),(2,1,2,0,'2025-10-02 05:47:03','2025-10-02 05:47:03'),(4,1,3,1,'2025-10-02 05:55:47','2025-10-02 05:55:47'),(5,3,1,1,'2025-10-02 06:14:32','2025-10-02 06:14:32'),(6,3,3,1,'2025-10-02 06:14:32','2025-10-02 06:14:32'),(7,3,2,1,'2025-10-02 06:14:32','2025-10-02 06:14:32');
/*!40000 ALTER TABLE `user_department_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_project_assignments`
--

DROP TABLE IF EXISTS `user_project_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_project_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `project_id` int NOT NULL,
  `access_level` enum('view','edit','manage','admin') DEFAULT 'view',
  `assigned_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_project` (`user_id`,`project_id`),
  KEY `fk_user_proj_user` (`user_id`),
  KEY `fk_user_proj_project` (`project_id`),
  KEY `fk_user_proj_assigned_by` (`assigned_by`),
  CONSTRAINT `fk_user_proj_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_proj_project` FOREIGN KEY (`project_id`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_proj_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_project_assignments`
--

LOCK TABLES `user_project_assignments` WRITE;
/*!40000 ALTER TABLE `user_project_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_project_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_ward_assignments`
--

DROP TABLE IF EXISTS `user_ward_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_ward_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ward_id` int NOT NULL,
  `access_level` enum('read','write','admin') DEFAULT 'read',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_ward` (`user_id`,`ward_id`),
  KEY `fk_user_ward_user` (`user_id`),
  KEY `fk_user_ward_ward` (`ward_id`),
  CONSTRAINT `fk_user_ward_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_ward_ward` FOREIGN KEY (`ward_id`) REFERENCES `kemri_wards` (`wardId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_ward_assignments`
--

LOCK TABLES `user_ward_assignments` WRITE;
/*!40000 ALTER TABLE `user_ward_assignments` DISABLE KEYS */;
INSERT INTO `user_ward_assignments` VALUES (4,3,15001,'admin','2025-10-02 06:23:23','2025-10-02 06:23:23'),(5,3,15003,'read','2025-10-02 06:23:23','2025-10-02 06:23:23'),(9,1,15003,'admin','2025-10-02 06:28:38','2025-10-02 06:28:38'),(10,1,15004,'read','2025-10-02 06:28:38','2025-10-02 06:28:38');
/*!40000 ALTER TABLE `user_ward_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'imbesdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `AddUserToRoleRooms` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`impesUser`@`%` PROCEDURE `AddUserToRoleRooms`(IN user_id INT, IN new_role_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE room_id INT;
    DECLARE room_cursor CURSOR FOR 
        SELECT room_id FROM chat_rooms 
        WHERE room_type = 'role' AND role_id = new_role_id AND is_active = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN room_cursor;
    
    read_loop: LOOP
        FETCH room_cursor INTO room_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        
        INSERT IGNORE INTO chat_room_participants (room_id, user_id, is_admin) 
        VALUES (room_id, user_id, 0);
    END LOOP;
    
    CLOSE room_cursor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-15  7:14:08
