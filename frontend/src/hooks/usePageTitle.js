import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext';

// Route to title mapping
const routeTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & Analytics' },
  '/raw-data': { title: 'Raw Data', subtitle: 'Data Management' },
  '/projects': { title: 'Project Management', subtitle: 'Projects & Tasks' },
  '/contractor-dashboard': { title: 'Contractor Dashboard', subtitle: 'My Projects' },
  '/reports': { title: 'Reports', subtitle: 'Analytics & Insights' },
  '/reporting': { title: 'Comprehensive Reporting', subtitle: 'Advanced Analytics' },
  '/reporting-overview': { title: 'Project Dashboards', subtitle: 'Project Analytics' },
  '/regional-dashboard': { title: 'Regional Reports', subtitle: 'Regional Analytics' },
  '/regional-reporting': { title: 'Regional Dashboards', subtitle: 'Regional Overview' },
  '/gis-mapping': { title: 'GIS Mapping', subtitle: 'Geographic Information' },
  '/map-data-import': { title: 'Import Map Data', subtitle: 'Data Import' },
  '/strategic-planning': { title: 'Strategic Planning', subtitle: 'Planning & Strategy' },
  '/strategic-data-import': { title: 'Import Strategic Data', subtitle: 'Strategic Data' },
  '/hr': { title: 'HR Module', subtitle: 'Human Resources' },
  '/admin': { title: 'Admin Dashboard', subtitle: 'Administration' },
  '/user-management': { title: 'User Management', subtitle: 'Users & Roles' },
  '/workflow-management': { title: 'Workflow Management', subtitle: 'Process Management' },
  '/approval-levels-management': { title: 'Approval Levels', subtitle: 'Approval Configuration' },
  '/feedback-management': { title: 'Feedback Management', subtitle: 'Citizen Feedback' },
  '/metadata-management': { title: 'Metadata Management', subtitle: 'Data Configuration' },
  '/contractor-management': { title: 'Contractor Management', subtitle: 'Contractor Administration' },
};

export const usePageTitleEffect = () => {
  const location = useLocation();
  const { updatePageTitle } = usePageTitle();

  useEffect(() => {
    const path = location.pathname;
    
    // Find exact match first
    let titleInfo = routeTitles[path];
    
    // If no exact match, try to find partial matches
    if (!titleInfo) {
      const matchingRoute = Object.keys(routeTitles).find(route => 
        path.startsWith(route) && route !== '/'
      );
      if (matchingRoute) {
        titleInfo = routeTitles[matchingRoute];
      }
    }
    
    // Default fallback
    if (!titleInfo) {
      titleInfo = { 
        title: 'Dashboard', 
        subtitle: 'Overview & Analytics' 
      };
    }
    
    updatePageTitle(titleInfo.title, titleInfo.subtitle);
  }, [location.pathname, updatePageTitle]);
};









