-- Public Dashboard Schema
-- This file contains database tables needed for the public dashboard functionality

-- Table for storing public feedback
CREATE TABLE IF NOT EXISTS public_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    project_id INT,
    status ENUM('pending', 'reviewed', 'responded', 'archived') DEFAULT 'pending',
    admin_response TEXT,
    responded_by INT,
    responded_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES kemri_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (responded_by) REFERENCES kemri_users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_project_id (project_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for tracking public dashboard analytics (optional)
CREATE TABLE IF NOT EXISTS public_dashboard_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_view VARCHAR(255) NOT NULL,
    project_id INT,
    financial_year_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    visited_at DATETIME NOT NULL,
    INDEX idx_page_view (page_view),
    INDEX idx_project_id (project_id),
    INDEX idx_visited_at (visited_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View for quick public stats (optional, for performance)
CREATE OR REPLACE VIEW public_quick_stats AS
SELECT 
    COUNT(*) as total_projects,
    COALESCE(SUM(budget), 0) as total_budget,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects,
    COALESCE(SUM(CASE WHEN status = 'Completed' THEN budget END), 0) as completed_budget,
    COUNT(CASE WHEN status = 'Ongoing' THEN 1 END) as ongoing_projects,
    COALESCE(SUM(CASE WHEN status = 'Ongoing' THEN budget END), 0) as ongoing_budget,
    COUNT(CASE WHEN status = 'Not Started' THEN 1 END) as not_started_projects,
    COALESCE(SUM(CASE WHEN status = 'Not Started' THEN budget END), 0) as not_started_budget,
    COUNT(CASE WHEN status = 'Under Procurement' THEN 1 END) as under_procurement_projects,
    COALESCE(SUM(CASE WHEN status = 'Under Procurement' THEN budget END), 0) as under_procurement_budget,
    COUNT(CASE WHEN status = 'Stalled' THEN 1 END) as stalled_projects,
    COALESCE(SUM(CASE WHEN status = 'Stalled' THEN budget END), 0) as stalled_budget
FROM kemri_projects
WHERE voided = 0;


