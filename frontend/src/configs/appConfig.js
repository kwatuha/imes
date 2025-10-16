/**
 * @file Configuration settings for the application.
 * This file centralizes default map coordinates, resource types, and all application routes,
 * making them easy to modify for different deployments.
 */

// Default map center coordinates for initial load (e.g., Nairobi, Kenya)
export const INITIAL_MAP_POSITION = [-1.286389, 36.817223];

// Default county configuration for hierarchical filtering
export const DEFAULT_COUNTY = {
    countyId: 1, // Kitui County ID
    name: 'Kitui County',
    code: 'KIT'
};

// Default sub-county configuration for initial chart loading
export const DEFAULT_SUBCOUNTY = {
    subcountyId: 1, // Default sub-county ID (e.g., Kitui Central)
    name: 'Kitui Central',
    code: 'KIT_CENTRAL'
};

// Define the available resource types for the dropdowns
export const RESOURCE_TYPES = [
    { value: 'projects', label: 'Projects' },
    { value: 'participants', label: 'Participants' },
    { value: 'poles', label: 'Poles' },
    // Add other resource types here specific to a county or client
];

// NEW: Project types with default icon URLs.
// You can replace these with custom icon URLs for a better visual representation.
export const PROJECT_TYPES = [
    { value: 'all', label: 'All Projects', icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
    { value: 'hospitals', label: 'Hospitals', icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' },
    { value: 'water_projects', label: 'Water Projects', icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' },
    { value: 'classrooms', label: 'Classrooms', icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' },
    { value: 'offices', label: 'Offices', icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png' },
    { value: 'roads', label: 'Roads', icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
    { value: 'schools', label: 'Schools', icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' },
];

// --- Define application routes in a centralized object ---
export const ROUTES = {
    // Top-level routes
    LOGIN: '/login',
    DASHBOARD: '/',
    
    // NEW: Contractor-specific route
    CONTRACTOR_DASHBOARD: '/contractor-dashboard',
    
    // NEW: Administrative route for managing contractors
    CONTRACTOR_MANAGEMENT: '/contractor-management',
    
    // NEW: Admin dashboard route
    ADMIN: '/admin',

    // Main layout routes
    RAW_DATA: '/raw-data',
    PROJECTS: '/projects',
    REPORTS: '/reports',
    GIS_MAPPING: '/maps',
    REPORTING_OVERVIEW: '/view-reports',
    REGIONAL_REPORTING: '/regional-reports',
    REGIONAL_DASHBOARD: '/regional-dashboard',
    USER_MANAGEMENT: '/user-management',
    STRATEGIC_PLANNING: '/strategic-planning',
    METADATA_MANAGEMENT: '/metadata-management',
    HR: '/hr-module', // New route for the HR module
    WORKFLOW_MANAGEMENT: '/workflow-management',
    APPROVAL_LEVELS_MANAGEMENT: '/approval-levels-management', // ✨ NEW: Add the approval levels management route
    FEEDBACK_MANAGEMENT: '/feedback-management', // ✨ NEW: Public feedback management route

    // Sub-routes with dynamic parameters
    PROJECT_DETAILS: '/projects/:projectId',
    PROJECT_GANTT_CHART: '/projects/:projectId/gantt-chart',
    KDSP_PROJECT_DETAILS: '/projects/:projectId/kdsp-details',
    MAP_DATA_IMPORT: '/maps/import-data',
    STRATEGIC_PLAN_DETAILS: '/strategic-planning/:planId',
    STRATEGIC_DATA_IMPORT: '/strategic-planning/import',
    NEW_DASHBOARD: '/projects-dashboard/view',
};