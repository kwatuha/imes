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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kemri_users`
--

LOCK TABLES `kemri_users` WRITE;
/*!40000 ALTER TABLE `kemri_users` DISABLE KEYS */;
INSERT INTO `kemri_users` VALUES (1,'testuser','$2b$10$NnXB0EdxugGjczGSVL9n4uGdwRg7YmyRvYswALG4b7UUhZLWcmuOW','test@example.com','Test','User',1,1,'2025-07-15 18:21:53','2025-10-02 07:20:59',0),(2,'akwatuha','$2b$10$QtfPgO.TsMeK/hkWEvY6vOOcKtbYxqG7kBM.cEKned64YTWi2Us6.','kwatuha@gmail.com','Alfayo','Kwatuha',1,1,'2025-07-15 18:36:23','2025-10-02 07:34:25',0),(3,'emaru','$2b$10$rw1otXRYFaSSL2p7xOE3SOV3NJ3oqx0eebF6eNQe02GuYLz3GkrJ.','maru@gmail.com','Ezekiel','Maru',1,1,'2025-07-18 20:09:54','2025-07-18 20:09:54',0),(4,'testal','$2b$10$7IzckbsdsdV7CzLzMW2y0.0WqLfNdHwxrtnqqwT35uyhWLXdmAMtu','test@gmail.com','Testing','Teser',1,1,'2025-07-18 20:20:27','2025-07-18 20:20:27',0),(5,'testuser','$2b$10$AK.zhA7okyFJtXgyF12NhezYzKENXqMeHZ2c3l8z7Q.u0y9Zd1mCa','test@example.com','Test','User',1,1,'2025-07-15 21:21:53','2025-07-18 23:17:20',0),(6,'akwatuha','$2b$10$QtfPgO.TsMeK/hkWEvY6vOOcKtbYxqG7kBM.cEKned64YTWi2Us6.','kwatuha@gmail.com','Alfayo','Kwatuha',1,1,'2025-07-15 21:36:23','2025-07-18 21:34:44',0),(7,'emaru','$2b$10$rw1otXRYFaSSL2p7xOE3SOV3NJ3oqx0eebF6eNQe02GuYLz3GkrJ.','maru@gmail.com','Ezekiel','Maru',1,1,'2025-07-18 23:09:54','2025-07-18 23:09:54',0),(8,'testal','$2b$10$7IzckbsdsdV7CzLzMW2y0.0WqLfNdHwxrtnqqwT35uyhWLXdmAMtu','test@gmail.com','Testing','Teser',1,1,'2025-07-18 23:20:27','2025-07-18 23:20:27',0),(9,'ekwat','$2b$10$tCRDO7m2sFekGA6uUZ9PJ.nS.S4odkXvrb4cJIK/sjQkAYlNNhmku','alpha@yahoo.com','Alphone','Makaja',21,1,'2025-07-30 14:34:42','2025-10-02 07:36:36',0),(10,'contractor','$2b$10$lVk9/fJPmCTEQv.IvobTg.wa6lPSlUe5Vq7ml9HhRNCXjGf6SoWVG','contractor@gmail.com','John ','Doe',21,1,'2025-08-09 23:47:10','2025-08-09 23:47:10',0),(11,'george11','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','george11@kisumu.co.ke','George','Taylor',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(12,'edward12','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward12@kisumu.co.ke','Edward','Miller',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(13,'george13','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','george13@kisumu.co.ke','George','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(14,'alice14','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice14@kisumu.co.ke','Alice','Davis',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(15,'bob15','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','bob15@kisumu.co.ke','Bob','Jones',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(16,'diana16','$2b$10$XAjMehMxLb5DzKCLP2DH6.dQ71AxjXAC7a9mp.dX67pd66Alr2aie','diana16@kisumu.co.ke','Diana','Evans',6,1,'2025-08-29 06:21:13','2025-10-04 12:27:19',0),(17,'charlie17','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','charlie17@kisumu.co.ke','Charlie','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(18,'edward18','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward18@kisumu.co.ke','Edward','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(19,'hannah19','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','hannah19@kisumu.co.ke','Hannah','Taylor',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(20,'alice20','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice20@kisumu.co.ke','Alice','Evans',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(21,'bob21','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','bob21@kisumu.co.ke','Bob','Davis',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(22,'fiona22','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','fiona22@kisumu.co.ke','Fiona','Smith',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(23,'edward23','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward23@kisumu.co.ke','Edward','Davis',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(24,'edward24','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward24@kisumu.co.ke','Edward','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(25,'alice25','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice25@kisumu.co.ke','Alice','Brown',2,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(26,'edward26','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','edward26@kisumu.co.ke','Edward','Wilson',3,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(27,'diana27','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','diana27@kisumu.co.ke','Diana','Jones',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(28,'alice28','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','alice28@kisumu.co.ke','Alice','Jones',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(29,'fiona29','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','fiona29@kisumu.co.ke','Fiona','Wilson',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(30,'charlie30','2eebf679d102737c877e389ddb099f0abb05514e2a481b2edccb7a50f3845819','charlie30@kisumu.co.ke','Charlie','Brown',1,1,'2025-08-29 06:21:13','2025-08-29 06:21:13',0),(31,'fmulama','$2b$10$L1MfyylehMAyorTCNiEhNuWbfu404tiDkL5km5vEhbl8gD5785aYi','alfam1989@gmail.com','Alpha','Mulama',6,1,'2025-10-02 07:41:05','2025-10-02 07:41:05',0),(32,'fmudola','$2b$10$uBJ8BCfDyJu71uUR8z0IW.LqgrDkh/A9.AhrTNKWY/MQjCZeBMoxe','fmula@gmailc.com','Farice','Mudol',20,1,'2025-10-02 15:13:03','2025-10-02 15:13:03',0),(33,'mawuor','$2b$10$AyNZnESAmexib21vOUleBudimhBatfRGgNzQYYLRebmjjE9ZZsc3q','Maurine266@gmail.com','Maurine','Onyango',1,1,'2025-10-15 07:55:16','2025-10-15 07:55:16',0),(34,'danmach','$2b$10$vTl82yutEOhkwLGY01MKr.xGprlYt6cj6rEhMChOhj6zIk59SVdVG','danreech83@gmail.com','Daniel','Reech',1,1,'2025-10-18 11:21:14','2025-10-18 11:21:14',0);
/*!40000 ALTER TABLE `kemri_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `public_feedback`
--

DROP TABLE IF EXISTS `public_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `public_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Optional - Respondent name (for follow-up)',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` int DEFAULT NULL,
  `status` enum('pending','reviewed','responded','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Public feedback with 5-point Likert scale ratings for county projects';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `public_feedback`
--

LOCK TABLES `public_feedback` WRITE;
/*!40000 ALTER TABLE `public_feedback` DISABLE KEYS */;
INSERT INTO `public_feedback` VALUES (1,'Test User','test@example.com','+254 700 000 000','Test feedback','This is a test feedback message',NULL,'pending',NULL,NULL,NULL,'2025-10-10 22:08:44','2025-10-10 22:08:44',NULL,NULL,NULL,NULL,NULL),(2,'Alfayo Kwatuha','kwatuha@gmail.com','0718109108','Improvement ','It requires more staff to run this projects',NULL,'responded','Your feedback is highly appreciated, we look forward  to increasing the number of staff for this facilicty',2,'2025-10-10 23:10:48','2025-10-10 22:09:53','2025-10-10 23:10:48',NULL,NULL,NULL,NULL,NULL),(3,'Maina Francis','fmaina@gmail.com','0718109196','Curlvert Blockage','This road has several blocked culverts causing damages to road shoulders',NULL,'pending',NULL,NULL,NULL,'2025-10-11 00:43:11','2025-10-11 00:43:11',NULL,NULL,NULL,NULL,NULL),(4,'Test User with Ratings','test.ratings@example.com','+254 712 345 678','Test Feedback with Ratings','This is a test feedback submission to verify the rating system works correctly.',NULL,'pending',NULL,NULL,NULL,'2025-10-11 22:55:26','2025-10-11 22:55:26',5,4,5,3,4),(5,'Test User without Ratings','test.no.ratings@example.com','+254 712 345 679','Test Feedback without Ratings','This feedback has no ratings - testing that they are optional.',NULL,'pending',NULL,NULL,NULL,'2025-10-11 22:55:27','2025-10-11 22:55:27',NULL,NULL,NULL,NULL,NULL),(6,'test','sdsa','sd','sd','fdfdfdsf',NULL,'pending',NULL,NULL,NULL,'2025-10-11 23:03:52','2025-10-11 23:03:52',1,1,3,5,2),(7,NULL,NULL,NULL,NULL,'This is anonymous feedback - testing that name is now optional',NULL,'pending',NULL,NULL,NULL,'2025-10-11 23:19:52','2025-10-11 23:19:52',4,NULL,NULL,NULL,NULL),(8,'','','','Feedback on: Mwingi East ICT Incubation Hub Setup','The project is taking too long to be completed',NULL,'pending',NULL,NULL,NULL,'2025-10-12 00:01:06','2025-10-12 00:01:06',1,3,2,2,4),(9,'Jane Maina','','','Feedback on: Construction of Kibuye Market phase 9','It is a great project',234,'pending',NULL,NULL,NULL,'2025-10-15 08:53:55','2025-10-15 08:53:55',1,3,2,4,4),(10,'Maurine','','','','\n Projects completion rate is slow',NULL,'responded','Our implementation team will review the status and fast track the process',2,'2025-10-15 09:28:46','2025-10-15 08:56:57','2025-10-15 09:28:46',3,3,4,4,NULL),(11,'Maurine A','','','Feedback on: Construction of Kibuye Market phase 11','The project was poorly done',236,'pending',NULL,NULL,NULL,'2025-10-15 09:34:16','2025-10-15 09:34:16',2,1,2,3,2),(12,'James Oyoo','','','Feedback on: Construction of Kibuye Market phase 11','This will be a lasting game changer in the trading culture of Kibuye Market',236,'responded','Thanks for your kind words, we endeavor to give you the best',2,'2025-10-15 13:13:05','2025-10-15 13:08:56','2025-10-15 13:13:05',4,5,5,3,4),(13,'gggg','','','Feedback on: Construction of Nyamasaria Satelite Buspark within Kisumu City',' not done to standards',221,'pending',NULL,NULL,NULL,'2025-10-15 14:25:46','2025-10-15 14:25:46',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `public_feedback` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-22 16:52:42
