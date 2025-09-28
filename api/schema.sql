-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: imbesdb
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-02 15:29:38
