-- Dashboard Configuration Tables
-- These tables are required for the dashboard configuration system

-- Dashboard Tabs Table
CREATE TABLE IF NOT EXISTS `dashboard_tabs` (
  `tab_key` varchar(100) NOT NULL,
  `tab_name` varchar(255) NOT NULL,
  `tab_icon` varchar(100) DEFAULT NULL,
  `tab_order` int DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tab_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dashboard Components Table
CREATE TABLE IF NOT EXISTS `dashboard_components` (
  `component_key` varchar(100) NOT NULL,
  `component_name` varchar(255) NOT NULL,
  `component_type` varchar(50) NOT NULL,
  `component_file` varchar(255) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`component_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Role Dashboard Configuration Table
CREATE TABLE IF NOT EXISTS `role_dashboard_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `tab_key` varchar(100) NOT NULL,
  `component_key` varchar(100) NOT NULL,
  `component_order` int DEFAULT 1,
  `is_required` tinyint(1) DEFAULT 0,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_tab_component` (`role_name`, `tab_key`, `component_key`),
  KEY `fk_role_dashboard_tab` (`tab_key`),
  KEY `fk_role_dashboard_component` (`component_key`),
  CONSTRAINT `fk_role_dashboard_tab` FOREIGN KEY (`tab_key`) REFERENCES `dashboard_tabs` (`tab_key`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_dashboard_component` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dashboard Permissions Table
CREATE TABLE IF NOT EXISTS `dashboard_permissions` (
  `permission_key` varchar(100) NOT NULL,
  `permission_name` varchar(255) NOT NULL,
  `description` text,
  `component_key` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_key`),
  KEY `fk_dashboard_permission_component` (`component_key`),
  CONSTRAINT `fk_dashboard_permission_component` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Role Dashboard Permissions Table
CREATE TABLE IF NOT EXISTS `role_dashboard_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `permission_key` varchar(100) NOT NULL,
  `granted` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_name`, `permission_key`),
  KEY `fk_role_dashboard_permission` (`permission_key`),
  CONSTRAINT `fk_role_dashboard_permission` FOREIGN KEY (`permission_key`) REFERENCES `dashboard_permissions` (`permission_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User Dashboard Preferences Table
CREATE TABLE IF NOT EXISTS `user_dashboard_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tab_key` varchar(100) NOT NULL,
  `component_key` varchar(100) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 1,
  `component_order` int DEFAULT 1,
  `custom_settings` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_tab_component` (`user_id`, `tab_key`, `component_key`),
  KEY `fk_user_dashboard_tab` (`tab_key`),
  KEY `fk_user_dashboard_component` (`component_key`),
  CONSTRAINT `fk_user_dashboard_tab` FOREIGN KEY (`tab_key`) REFERENCES `dashboard_tabs` (`tab_key`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_dashboard_component` FOREIGN KEY (`component_key`) REFERENCES `dashboard_components` (`component_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default dashboard tabs
INSERT IGNORE INTO `dashboard_tabs` (`tab_key`, `tab_name`, `tab_icon`, `tab_order`, `is_active`) VALUES
('overview', 'Overview', 'Dashboard', 1, 1),
('projects', 'Projects', 'Assignment', 2, 1),
('reports', 'Reports', 'Analytics', 3, 1),
('settings', 'Settings', 'Settings', 4, 1);

-- Insert default dashboard components
INSERT IGNORE INTO `dashboard_components` (`component_key`, `component_name`, `component_type`, `component_file`, `description`, `is_active`) VALUES
('project_summary', 'Project Summary', 'card', 'ProjectSummaryCard', 'Overview of all projects', 1),
('recent_activities', 'Recent Activities', 'list', 'RecentActivitiesList', 'List of recent system activities', 1),
('project_stats', 'Project Statistics', 'chart', 'ProjectStatsChart', 'Statistical charts for projects', 1),
('user_management', 'User Management', 'table', 'UserManagementTable', 'Manage system users', 1),
('project_list', 'Project List', 'table', 'ProjectListTable', 'List of all projects', 1),
('reports_overview', 'Reports Overview', 'card', 'ReportsOverviewCard', 'Overview of available reports', 1);

-- Insert default dashboard permissions
INSERT IGNORE INTO `dashboard_permissions` (`permission_key`, `permission_name`, `description`, `component_key`, `is_active`) VALUES
('view_project_summary', 'View Project Summary', 'Permission to view project summary component', 'project_summary', 1),
('view_recent_activities', 'View Recent Activities', 'Permission to view recent activities component', 'recent_activities', 1),
('view_project_stats', 'View Project Statistics', 'Permission to view project statistics', 'project_stats', 1),
('manage_users', 'Manage Users', 'Permission to manage system users', 'user_management', 1),
('view_projects', 'View Projects', 'Permission to view project list', 'project_list', 1),
('view_reports', 'View Reports', 'Permission to view reports', 'reports_overview', 1);

-- Insert default role dashboard configurations for admin role
INSERT IGNORE INTO `role_dashboard_config` (`role_name`, `tab_key`, `component_key`, `component_order`, `is_required`, `permissions`) VALUES
('admin', 'overview', 'project_summary', 1, 1, '{"view": true, "edit": true}'),
('admin', 'overview', 'recent_activities', 2, 1, '{"view": true}'),
('admin', 'overview', 'project_stats', 3, 0, '{"view": true}'),
('admin', 'projects', 'project_list', 1, 1, '{"view": true, "edit": true, "delete": true}'),
('admin', 'projects', 'user_management', 2, 1, '{"view": true, "edit": true, "delete": true}'),
('admin', 'reports', 'reports_overview', 1, 1, '{"view": true}'),
('admin', 'settings', 'user_management', 1, 1, '{"view": true, "edit": true, "delete": true}');

-- Insert default role dashboard permissions for admin role
INSERT IGNORE INTO `role_dashboard_permissions` (`role_name`, `permission_key`, `granted`) VALUES
('admin', 'view_project_summary', 1),
('admin', 'view_recent_activities', 1),
('admin', 'view_project_stats', 1),
('admin', 'manage_users', 1),
('admin', 'view_projects', 1),
('admin', 'view_reports', 1);
