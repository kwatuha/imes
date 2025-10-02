-- User Data Access Control Schema Extensions
-- These tables will enable dynamic data filtering based on user attributes

-- User Department Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS `user_department_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department_id` int NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_department` (`user_id`, `department_id`),
  KEY `fk_user_dept_user` (`user_id`),
  KEY `fk_user_dept_department` (`department_id`),
  CONSTRAINT `fk_user_dept_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_dept_department` FOREIGN KEY (`department_id`) REFERENCES `kemri_departments` (`departmentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User Ward Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS `user_ward_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ward_id` int NOT NULL,
  `access_level` enum('read','write','admin') DEFAULT 'read',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_ward` (`user_id`, `ward_id`),
  KEY `fk_user_ward_user` (`user_id`),
  KEY `fk_user_ward_ward` (`ward_id`),
  CONSTRAINT `fk_user_ward_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_ward_ward` FOREIGN KEY (`ward_id`) REFERENCES `kemri_wards` (`wardId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User Project Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS `user_project_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `project_id` int NOT NULL,
  `access_level` enum('view','edit','manage','admin') DEFAULT 'view',
  `assigned_by` int DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_project` (`user_id`, `project_id`),
  KEY `fk_user_proj_user` (`user_id`),
  KEY `fk_user_proj_project` (`project_id`),
  KEY `fk_user_proj_assigned_by` (`assigned_by`),
  CONSTRAINT `fk_user_proj_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_proj_project` FOREIGN KEY (`project_id`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_proj_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `kemri_users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User Data Filters (dynamic filtering rules)
CREATE TABLE IF NOT EXISTS `user_data_filters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `filter_type` enum('budget_range','progress_status','project_type','date_range','custom') NOT NULL,
  `filter_key` varchar(100) NOT NULL,
  `filter_value` json NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user_filter_user` (`user_id`),
  KEY `idx_filter_type` (`filter_type`),
  CONSTRAINT `fk_user_filter_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Component Data Access Rules
CREATE TABLE IF NOT EXISTS `component_data_access_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_key` varchar(100) NOT NULL,
  `rule_type` enum('department','ward','project','budget','status','custom') NOT NULL,
  `rule_config` json NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comp_access_component` (`component_key`),
  KEY `idx_rule_type` (`rule_type`),
  CONSTRAINT `fk_comp_access_component` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for testing
INSERT IGNORE INTO `user_department_assignments` (`user_id`, `department_id`, `is_primary`) VALUES
(1, 1, 1), -- Admin user assigned to first department as primary
(1, 2, 0); -- Admin user also has access to second department

INSERT IGNORE INTO `user_data_filters` (`user_id`, `filter_type`, `filter_key`, `filter_value`) VALUES
(1, 'budget_range', 'project_budget', '{"min": 0, "max": 10000000}'),
(1, 'progress_status', 'project_status', '["active", "planning", "completed"]'),
(1, 'project_type', 'project_category', '["infrastructure", "health", "education"]');

INSERT IGNORE INTO `component_data_access_rules` (`component_key`, `rule_type`, `rule_config`) VALUES
('metrics', 'department', '{"apply_department_filter": true, "show_all_if_admin": true}'),
('projectList', 'project', '{"apply_project_assignment": true, "show_assigned_only": false}'),
('budgetSummary', 'budget', '{"apply_budget_filter": true, "respect_user_limits": true}'),
('wardProjects', 'ward', '{"apply_ward_filter": true, "show_ward_assigned_only": true}');
