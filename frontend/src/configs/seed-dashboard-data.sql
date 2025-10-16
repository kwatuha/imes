-- Seed data for dashboard configuration
-- This populates the database with the same configuration as the JSON file

-- 1. Insert Dashboard Components
INSERT INTO dashboard_components (component_key, component_name, component_type, component_file, description) VALUES
-- Overview Tab Components
('metrics', 'Key Performance Indicators', 'card', 'components/MetricCard', 'Display key performance metrics and statistics'),
('quickStats', 'Quick Stats', 'card', 'components/QuickStatsCard', 'Show quick statistics with progress bars'),
('recentActivity', 'Recent Activity', 'list', 'components/RecentActivityCard', 'Display recent system activities'),
('contractorMetrics', 'Contractor Metrics', 'card', 'components/contractor/ContractorMetricsCard', 'Contractor-specific performance metrics'),

-- Projects Tab Components
('tasks', 'Project Tasks', 'list', 'components/ProjectTasksCard', 'List of project tasks and assignments'),
('activity', 'Project Activity', 'list', 'components/ProjectActivityFeed', 'Project activity feed and updates'),
('alerts', 'Project Alerts', 'list', 'components/ProjectAlertsCard', 'Critical project alerts and notifications'),
('assignedTasks', 'My Assigned Tasks', 'list', 'components/contractor/AssignedTasksCard', 'Tasks specifically assigned to the user'),
('projectComments', 'Project Comments', 'list', 'components/contractor/ProjectCommentsCard', 'Comments and feedback on projects'),
('projectActivity', 'Project Activity', 'list', 'components/ProjectActivityFeed', 'Activity feed for assigned projects'),

-- Collaboration Tab Components
('teamDirectory', 'Team Directory', 'list', 'components/TeamDirectoryCard', 'Searchable team member directory'),
('announcements', 'Team Announcements', 'list', 'components/TeamAnnouncementsCard', 'Team-wide announcements and updates'),
('conversations', 'Recent Conversations', 'list', 'components/RecentConversationsCard', 'Recent chat conversations'),

-- Analytics Tab Components
('charts', 'Analytics Charts', 'chart', 'components/charts/ChartsDashboard', 'Interactive analytics charts and graphs'),
('reports', 'Reports', 'list', 'components/ReportsCard', 'Generated reports and documents'),

-- Payments Tab Components (Contractor-specific)
('paymentRequests', 'Payment Requests', 'list', 'components/contractor/PaymentRequestsCard', 'Submit and track payment requests'),
('paymentHistory', 'Payment History', 'list', 'components/contractor/PaymentHistoryCard', 'View payment history and receipts'),
('financialSummary', 'Financial Summary', 'card', 'components/contractor/FinancialSummaryCard', 'Financial overview and earnings analytics');

-- 2. Insert Dashboard Tabs
INSERT INTO dashboard_tabs (tab_key, tab_name, tab_icon, tab_order, description) VALUES
('overview', 'Overview', 'Dashboard', 1, 'Main dashboard overview with key metrics'),
('projects', 'Projects', 'Assignment', 2, 'Project management and task tracking'),
('collaboration', 'Collaboration', 'People', 3, 'Team collaboration and communication'),
('analytics', 'Analytics', 'Analytics', 4, 'Data analytics and reporting'),
('payments', 'Payments', 'AttachMoney', 5, 'Payment management and financial tracking');

-- 3. Insert Dashboard Permissions
INSERT INTO dashboard_permissions (permission_key, permission_name, description) VALUES
('view_metrics', 'View Metrics', 'Can view key performance metrics'),
('view_quick_stats', 'View Quick Stats', 'Can view quick statistics'),
('view_activity', 'View Activity', 'Can view recent activity feeds'),
('view_tasks', 'View Tasks', 'Can view project tasks'),
('manage_tasks', 'Manage Tasks', 'Can create, edit, and assign tasks'),
('view_alerts', 'View Alerts', 'Can view project alerts'),
('manage_alerts', 'Manage Alerts', 'Can create and manage alerts'),
('view_team_directory', 'View Team Directory', 'Can view team member directory'),
('view_announcements', 'View Announcements', 'Can view team announcements'),
('view_conversations', 'View Conversations', 'Can view chat conversations'),
('view_analytics', 'View Analytics', 'Can view analytics and charts'),
('view_reports', 'View Reports', 'Can view generated reports'),
('generate_reports', 'Generate Reports', 'Can generate new reports'),
('view_payment_requests', 'View Payment Requests', 'Can view payment requests'),
('submit_payment_requests', 'Submit Payment Requests', 'Can submit new payment requests'),
('view_payment_history', 'View Payment History', 'Can view payment history'),
('view_financial_summary', 'View Financial Summary', 'Can view financial analytics'),
('manage_users', 'Manage Users', 'Can manage user accounts'),
('manage_roles', 'Manage Roles', 'Can manage user roles'),
('system_admin', 'System Administration', 'Full system administration access');

-- 4. Insert Role Dashboard Configuration

-- Admin Role Configuration
INSERT INTO role_dashboard_config (role_name, tab_key, component_key, component_order, is_required) VALUES
-- Overview Tab
('admin', 'overview', 'metrics', 1, true),
('admin', 'overview', 'quickStats', 2, true),
('admin', 'overview', 'recentActivity', 3, true),
-- Projects Tab
('admin', 'projects', 'tasks', 1, true),
('admin', 'projects', 'activity', 2, true),
('admin', 'projects', 'alerts', 3, true),
-- Collaboration Tab
('admin', 'collaboration', 'teamDirectory', 1, true),
('admin', 'collaboration', 'announcements', 2, true),
('admin', 'collaboration', 'conversations', 3, true),
-- Analytics Tab
('admin', 'analytics', 'charts', 1, true),
('admin', 'analytics', 'reports', 2, true);

-- Contractor Role Configuration
INSERT INTO role_dashboard_config (role_name, tab_key, component_key, component_order, is_required) VALUES
-- Overview Tab
('contractor', 'overview', 'contractorMetrics', 1, true),
('contractor', 'overview', 'recentActivity', 2, true),
-- Projects Tab
('contractor', 'projects', 'assignedTasks', 1, true),
('contractor', 'projects', 'projectComments', 2, true),
('contractor', 'projects', 'projectActivity', 3, true),
-- Payments Tab
('contractor', 'payments', 'paymentRequests', 1, true),
('contractor', 'payments', 'paymentHistory', 2, true),
('contractor', 'payments', 'financialSummary', 3, true);

-- Project Manager Role Configuration
INSERT INTO role_dashboard_config (role_name, tab_key, component_key, component_order, is_required) VALUES
-- Overview Tab
('project_manager', 'overview', 'metrics', 1, true),
('project_manager', 'overview', 'quickStats', 2, true),
('project_manager', 'overview', 'recentActivity', 3, true),
-- Projects Tab
('project_manager', 'projects', 'tasks', 1, true),
('project_manager', 'projects', 'activity', 2, true),
('project_manager', 'projects', 'alerts', 3, true),
-- Collaboration Tab
('project_manager', 'collaboration', 'teamDirectory', 1, true),
('project_manager', 'collaboration', 'announcements', 2, true),
('project_manager', 'collaboration', 'conversations', 3, true);

-- 5. Insert Role Dashboard Permissions

-- Admin Permissions (Full Access)
INSERT INTO role_dashboard_permissions (role_name, permission_key, granted) VALUES
('admin', 'view_metrics', true),
('admin', 'view_quick_stats', true),
('admin', 'view_activity', true),
('admin', 'view_tasks', true),
('admin', 'manage_tasks', true),
('admin', 'view_alerts', true),
('admin', 'manage_alerts', true),
('admin', 'view_team_directory', true),
('admin', 'view_announcements', true),
('admin', 'view_conversations', true),
('admin', 'view_analytics', true),
('admin', 'view_reports', true),
('admin', 'generate_reports', true),
('admin', 'manage_users', true),
('admin', 'manage_roles', true),
('admin', 'system_admin', true);

-- Contractor Permissions
INSERT INTO role_dashboard_permissions (role_name, permission_key, granted) VALUES
('contractor', 'view_metrics', false),
('contractor', 'view_quick_stats', false),
('contractor', 'view_activity', true),
('contractor', 'view_tasks', true),
('contractor', 'manage_tasks', false),
('contractor', 'view_alerts', false),
('contractor', 'manage_alerts', false),
('contractor', 'view_team_directory', false),
('contractor', 'view_announcements', false),
('contractor', 'view_conversations', false),
('contractor', 'view_analytics', false),
('contractor', 'view_reports', false),
('contractor', 'generate_reports', false),
('contractor', 'view_payment_requests', true),
('contractor', 'submit_payment_requests', true),
('contractor', 'view_payment_history', true),
('contractor', 'view_financial_summary', true);

-- Project Manager Permissions
INSERT INTO role_dashboard_permissions (role_name, permission_key, granted) VALUES
('project_manager', 'view_metrics', true),
('project_manager', 'view_quick_stats', true),
('project_manager', 'view_activity', true),
('project_manager', 'view_tasks', true),
('project_manager', 'manage_tasks', true),
('project_manager', 'view_alerts', true),
('project_manager', 'manage_alerts', true),
('project_manager', 'view_team_directory', true),
('project_manager', 'view_announcements', true),
('project_manager', 'view_conversations', true),
('project_manager', 'view_analytics', false),
('project_manager', 'view_reports', false),
('project_manager', 'generate_reports', false);











