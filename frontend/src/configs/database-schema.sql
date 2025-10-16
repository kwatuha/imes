-- Database Schema for Role-Based Dashboard Configuration
-- This replaces the JSON configuration with database tables

-- 1. Dashboard Components Registry
-- This table defines all available dashboard components
CREATE TABLE dashboard_components (
    id SERIAL PRIMARY KEY,
    component_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'metrics', 'paymentRequests'
    component_name VARCHAR(200) NOT NULL, -- e.g., 'Key Performance Indicators'
    component_type VARCHAR(50) NOT NULL, -- 'card', 'chart', 'list', 'form'
    component_file VARCHAR(200) NOT NULL, -- e.g., 'components/MetricCard'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dashboard Tabs Registry
-- This table defines all available dashboard tabs
CREATE TABLE dashboard_tabs (
    id SERIAL PRIMARY KEY,
    tab_key VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'overview', 'projects', 'payments'
    tab_name VARCHAR(100) NOT NULL, -- e.g., 'Overview', 'Projects', 'Payments'
    tab_icon VARCHAR(100), -- e.g., 'Dashboard', 'Assignment', 'AttachMoney'
    tab_order INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Role Dashboard Configuration
-- This table defines which tabs and components each role can access
CREATE TABLE role_dashboard_config (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL, -- e.g., 'admin', 'contractor', 'project_manager'
    tab_key VARCHAR(50) NOT NULL, -- References dashboard_tabs.tab_key
    component_key VARCHAR(100) NOT NULL, -- References dashboard_components.component_key
    component_order INTEGER DEFAULT 0, -- Order within the tab
    is_required BOOLEAN DEFAULT false, -- Must be shown if tab is accessible
    permissions JSONB, -- Additional permissions for this component
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tab_key) REFERENCES dashboard_tabs(tab_key),
    FOREIGN KEY (component_key) REFERENCES dashboard_components(component_key),
    UNIQUE(role_name, tab_key, component_key)
);

-- 4. User Dashboard Preferences (Optional)
-- This allows users to customize their dashboard beyond role defaults
CREATE TABLE user_dashboard_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- References your users table
    tab_key VARCHAR(50) NOT NULL,
    component_key VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    component_order INTEGER DEFAULT 0,
    custom_settings JSONB, -- User-specific component settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tab_key) REFERENCES dashboard_tabs(tab_key),
    FOREIGN KEY (component_key) REFERENCES dashboard_components(component_key),
    UNIQUE(user_id, tab_key, component_key)
);

-- 5. Dashboard Permissions
-- This table defines what actions users can perform on dashboard components
CREATE TABLE dashboard_permissions (
    id SERIAL PRIMARY KEY,
    permission_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'view_metrics', 'manage_payments'
    permission_name VARCHAR(200) NOT NULL, -- e.g., 'View Metrics', 'Manage Payments'
    description TEXT,
    component_key VARCHAR(100), -- Optional: specific to a component
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (component_key) REFERENCES dashboard_components(component_key)
);

-- 6. Role Dashboard Permissions
-- This table links roles to dashboard permissions
CREATE TABLE role_dashboard_permissions (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permission_key VARCHAR(100) NOT NULL,
    granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permission_key) REFERENCES dashboard_permissions(permission_key),
    UNIQUE(role_name, permission_key)
);

-- Indexes for better performance
CREATE INDEX idx_role_dashboard_config_role ON role_dashboard_config(role_name);
CREATE INDEX idx_role_dashboard_config_tab ON role_dashboard_config(tab_key);
CREATE INDEX idx_user_dashboard_preferences_user ON user_dashboard_preferences(user_id);
CREATE INDEX idx_role_dashboard_permissions_role ON role_dashboard_permissions(role_name);











