-- Demo User Access Control Data
-- This script creates sample user assignments for testing the admin interface

-- Create some test ward assignments
INSERT IGNORE INTO user_ward_assignments (user_id, ward_id, access_level) VALUES
(1, 1, 'admin'),
(1, 2, 'read'),
(1, 3, 'write');

-- Create some test project assignments
INSERT IGNORE INTO user_project_assignments (user_id, project_id, access_level) VALUES
(1, 1, 'admin'),
(1, 2, 'manage'),
(1, 3, 'edit'),
(1, 4, 'view');

-- Add more diverse data filters
INSERT IGNORE INTO user_data_filters (user_id, filter_type, filter_key, filter_value, is_active) VALUES
(1, 'date_range', 'project_dates', '{"start": "2024-01-01", "end": "2024-12-31"}', 1),
(1, 'custom', 'user_role_specific', '{"role": "admin", "show_all": true}', 1);

-- Create component access rules for different components
INSERT IGNORE INTO component_data_access_rules (component_key, rule_type, rule_config, is_active) VALUES
('regionalProjects', 'ward', '{"apply_ward_filter": true, "show_assigned_only": true}', 1),
('budgetMetrics', 'budget', '{"apply_budget_filter": true, "respect_user_limits": true}', 1),
('projectList', 'project', '{"apply_project_assignment": true, "show_assigned_only": false}', 1),
('wardProjects', 'ward', '{"apply_ward_filter": true, "show_ward_assigned_only": true}', 1),
('departmentMetrics', 'department', '{"apply_department_filter": true, "show_all_if_admin": true}', 1);

-- Show current assignments for verification
SELECT 'User Department Assignments' as table_name;
SELECT u.username, d.name as department_name, uda.is_primary 
FROM user_department_assignments uda
JOIN kemri_users u ON uda.user_id = u.userId
JOIN kemri_departments d ON uda.department_id = d.departmentId
ORDER BY u.username, uda.is_primary DESC;

SELECT 'User Ward Assignments' as table_name;
SELECT u.username, uwa.ward_id, uwa.access_level
FROM user_ward_assignments uwa
JOIN kemri_users u ON uwa.user_id = u.userId
ORDER BY u.username, uwa.ward_id;

SELECT 'User Project Assignments' as table_name;
SELECT u.username, p.projectName, upa.access_level
FROM user_project_assignments upa
JOIN kemri_users u ON upa.user_id = u.userId
JOIN kemri_projects p ON upa.project_id = p.id
ORDER BY u.username, p.projectName;

SELECT 'User Data Filters' as table_name;
SELECT u.username, udf.filter_type, udf.filter_key, udf.filter_value
FROM user_data_filters udf
JOIN kemri_users u ON udf.user_id = u.userId
WHERE udf.is_active = 1
ORDER BY u.username, udf.filter_type;
