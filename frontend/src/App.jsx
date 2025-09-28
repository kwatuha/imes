import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RawDataPage from './pages/RawDataPage.jsx';
import ProjectManagementPage from './pages/ProjectManagementPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import ProjectGanttChartPage from './pages/ProjectGanttChartPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import MapsPage from './pages/MapsPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import Login from './components/Login.jsx';

// Import the StrategicPlanningPage
import StrategicPlanningPage from './pages/StrategicPlanningPage.jsx';
// Import the StrategicPlanDetailsPage
import StrategicPlanDetailsPage from './pages/StrategicPlanDetailsPage.jsx';
// Import the DataImportPage
import DataImportPage from './pages/DataImportPage.jsx';
// NEW: Import the KdspProjectDetailsPage
import KdspProjectDetailsPage from './pages/KdspProjectDetailsPage.jsx';
// NEW: Import the GISMapPage for the new mapping component
import GISMapPage from './pages/GISMapPage.jsx';
// NEW: Import the MapDataImportPage for the map data import form
import MapDataImportPage from './pages/MapDataImportPage.jsx';
// NEW: Import the SettingsPage
import SettingsPage from './pages/SettingsPage.jsx';
// CORRECTED: Import the ProjectCategoryPage component
import ProjectCategoryPage from './pages/ProjectCategoryPage.jsx';
// NEW: Import the ProjectPhotoManager component
import ProjectPhotoManager from './pages/ProjectPhotoManager.jsx';
// NEW: Import the ContractorDashboard component
import ContractorDashboard from './pages/ContractorDashboard.jsx';
// NEW: Import the ContractorManagementPage component
import ContractorManagementPage from './pages/ContractorManagementPage.jsx';
// NEW: Import the HrModulePage component
import HrModulePage from './pages/HrModulePage.jsx';
// ✨ NEW: Import the WorkflowManagementPage component
import WorkflowManagementPage from './pages/WorkflowManagementPage.jsx';
// ✨ NEW: Import the ApprovalLevelsManagementPage component
import ApprovalLevelsManagementPage from './pages/ApprovalLevelsManagementPage.jsx';
 
import ReportingPage from './pages/ReportingPage.jsx';
import ReportingView from './components/ReportingView';

import ProjectDashboardPage from './pages/ProjectsDashboardPage.jsx';
import { ColorModeContext, useMode} from "./pages/dashboard/theme";

// Define your routes with basename for /impes path
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'contractor-dashboard',
        element: <ContractorDashboard />,
      },
      {
        path: 'contractor-management',
        element: <ContractorManagementPage />,
      },
      {
        path: 'raw-data',
        element: <RawDataPage />,
      },
      {
        path: 'projects',
        element: <ProjectManagementPage />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDetailsPage />,
      },
      {
        path: 'projects/:projectId/gantt-chart',
        element: <ProjectGanttChartPage />,
      },
      {
        path: 'projects/:projectId/photos',
        element: <ProjectPhotoManager />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'reporting',
        element: <ReportingPage />,
      },
      {
        path: 'view-reports',
        element: <ReportingView />,
      },
      {
        path: 'maps',
        element: <GISMapPage />,
      },
      {
        path: 'maps/import-data',
        element: <MapDataImportPage />,
      },
      {
        path: 'user-management',
        element: <UserManagementPage />,
      },
      {
        path: 'workflow-management',
        element: <WorkflowManagementPage />,
      },
      {
        path: 'approval-levels-management',
        element: <ApprovalLevelsManagementPage />,
      },
      {
        path: 'strategic-planning',
        element: <StrategicPlanningPage />,
      },
      {
        path: 'strategic-planning/:planId',
        element: <StrategicPlanDetailsPage />,
      },
      {
        path: 'strategic-planning/import',
        element: <DataImportPage />,
      },
      {
        path: 'projects/:projectId/kdsp-details',
        element: <KdspProjectDetailsPage />,
      },
      {
        path: 'metadata-management',
        element: <SettingsPage />,
      },
      {
        path: 'settings/project-categories',
        element: <ProjectCategoryPage />,
      },
      {
        path: 'hr-module',
        element: <HrModulePage />,
      },
      {
        path: 'projects-dashboard/view',
        element: <ProjectDashboardPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
], {
  basename: '/impes'  // Add this basename configuration
});

function App() {
   const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;