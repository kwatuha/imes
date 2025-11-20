import { useState, useMemo, useCallback, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { 
  Box, 
  IconButton, 
  Typography, 
  useTheme, 
  Divider, 
  Tooltip, 
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Fade,
  Zoom,
  Avatar,
  Badge,
  Chip,
  LinearProgress
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
// ✨ Removed old theme system - using modern theme directly!
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PaidIcon from '@mui/icons-material/Paid';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Comment from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../configs/appConfig.js';
import logo from '../assets/logo.png';
import userProfilePicture from '../assets/user.png';

const Item = ({ title, to, icon, selected, setSelected, privilegeCheck, theme }) => {
  const navigate = useNavigate();
  
  if (privilegeCheck && !privilegeCheck()) {
    return null;
  }

  const handleClick = () => {
    console.log('Menu item clicked:', title, 'navigating to:', to);
    setSelected(to);
    navigate(to);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        margin: '2px 8px',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: selected === to ? theme.palette.action.selected : 'transparent',
        color: selected === to ? theme.palette.primary.main : theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          transform: 'translateX(2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
        {icon}
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '0.9rem', 
          fontWeight: selected === to ? '600' : '500',
          overflow: 'visible', 
          whiteSpace: 'nowrap', 
          textOverflow: 'unset' 
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const MenuGroup = ({ title, icon, children, isOpen, onToggle, theme, colors }) => {

  return (
    <Box>
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          margin: '4px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.selected,
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
            {icon}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              overflow: 'visible', 
              whiteSpace: 'nowrap', 
              textOverflow: 'unset' 
            }}
          >
            {title}
          </Typography>
        </Box>
        {isOpen ? <ExpandLessIcon sx={{ fontSize: '18px' }} /> : <ExpandMoreIcon sx={{ fontSize: '18px' }} />}
      </Box>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 0.5 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const SearchableMenu = ({ items, selected, setSelected, theme }) => {
  return (
    <Fade in={true} timeout={300}>
      <Box>
        {items.map((item, index) => (
          <Zoom in={true} timeout={300 + index * 50} key={index}>
            <Box>
              <Item
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                privilegeCheck={item.privilege}
                theme={theme}
              />
            </Box>
          </Zoom>
        ))}
      </Box>
    </Fade>
  );
};

const Sidebar = ({ isPinnedOpen = false, onTogglePinned }) => {
  const theme = useTheme();
  
  // ✨ Compatibility layer for theme colors (simplified from old token system)
  const colors = {
    grey: theme.palette.grey,
    primary: {
      50: theme.palette.background.default,
      100: theme.palette.background.paper,
      300: theme.palette.action.selected,
      400: theme.palette.background.paper,
      500: theme.palette.primary.dark,
      600: theme.palette.primary.main,
    },
    blueAccent: {
      200: theme.palette.primary.light,
      300: theme.palette.primary.light,
      400: theme.palette.primary.main,
      500: theme.palette.primary.main,
      600: theme.palette.primary.dark,
    },
    greenAccent: {
      400: theme.palette.success.light,
      600: theme.palette.success.main,
    }
  };
  
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selected, setSelected] = useState(location.pathname);
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    reporting: true,
    management: true,
    admin: false
  });

  const { user, hasPrivilege } = useAuth();
  
  // Update selected state when route changes
  useEffect(() => {
    setSelected(location.pathname);
  }, [location]);

  // Handle group toggle with useCallback for performance
  const toggleGroup = useCallback((groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  }, []);

  // Organized menu groups
  const dashboardItems = [
    { title: "Dashboard", to: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { title: "Contractor Dashboard", to: ROUTES.CONTRACTOR_DASHBOARD, icon: <PaidIcon /> },
  ];

  const reportingItems = [
    { title: "Projects", to: ROUTES.PROJECTS, icon: <FolderOpenIcon /> },
    { title: "Reports", to: ROUTES.REPORTS, icon: <AssessmentIcon /> },
    { title: "Project Dashboards", to: ROUTES.REPORTING_OVERVIEW, icon: <AssessmentIcon /> },
    { title: "Regional Rpts", to: ROUTES.REGIONAL_DASHBOARD, icon: <AssessmentIcon />, hidden: true },
    { title: "Regional Dashboards", to: ROUTES.REGIONAL_REPORTING, icon: <AssessmentIcon />, hidden: true },
    { title: "Absorption Report", to: ROUTES.ABSORPTION_REPORT, icon: <AssessmentIcon /> },
    { title: "Performance Management Report", to: ROUTES.PERFORMANCE_MANAGEMENT_REPORT, icon: <AssessmentIcon /> },
    { title: "CAPR Report", to: ROUTES.CAPR_REPORT, icon: <AssessmentIcon /> },
    { title: "Quarterly Implementation Report", to: ROUTES.QUARTERLY_IMPLEMENTATION_REPORT, icon: <AssessmentIcon />, hidden: true },
  ].filter(item => !item.hidden);

  const managementItems = [
    { title: "Central Data Import", to: ROUTES.CENTRAL_IMPORT, icon: <CloudUploadIcon /> },
    { title: "GIS Mapping", to: ROUTES.GIS_MAPPING, icon: <MapIcon /> },
    { title: "Import Map Data", to: ROUTES.MAP_DATA_IMPORT, icon: <CloudUploadIcon /> },
    { title: "Strategic Planning", to: ROUTES.STRATEGIC_PLANNING, icon: <AssignmentIcon /> },
    { title: "Import Strategic Data", to: ROUTES.STRATEGIC_DATA_IMPORT, icon: <CloudUploadIcon /> },
    { title: "HR Module", to: ROUTES.HR, icon: <PeopleIcon />, privilege: () => hasPrivilege('hr.access') },
  ];

  const adminItems = [
    { title: "Admin Dashboard", to: ROUTES.ADMIN, icon: <SettingsIcon /> },
    { title: "User Management", to: ROUTES.USER_MANAGEMENT, icon: <GroupIcon /> },
    { title: "Workflow Management", to: ROUTES.WORKFLOW_MANAGEMENT, icon: <AccountTreeIcon />, privilege: () => hasPrivilege('project_workflow.read') },
    { title: "Approval Levels", to: ROUTES.APPROVAL_LEVELS_MANAGEMENT, icon: <SettingsIcon />, privilege: () => hasPrivilege('approval_levels.read') },
    { title: "Feedback Management", to: ROUTES.FEEDBACK_MANAGEMENT, icon: <Comment />, privilege: () => hasPrivilege('feedback.respond') || user?.roleName === 'admin' },
    { title: "Metadata Management", to: ROUTES.METADATA_MANAGEMENT, icon: <SettingsIcon /> },
    { title: "Contractor Management", to: ROUTES.CONTRACTOR_MANAGEMENT, icon: <BusinessIcon /> },
  ];

  const contractorItems = [
    { title: "My Projects", to: ROUTES.CONTRACTOR_DASHBOARD, icon: <FolderOpenIcon /> },
    { title: "Payment Requests", to: `${ROUTES.CONTRACTOR_DASHBOARD}/payments`, icon: <PaidIcon /> },
    { title: "Progress Photos", to: `${ROUTES.CONTRACTOR_DASHBOARD}/photos`, icon: <PhotoCameraIcon /> },
  ];

  // Get all items for search
  const allItems = useMemo(() => {
    if (user?.roleName === 'contractor') {
      return contractorItems;
    }
    if (user?.roleName === 'admin') {
      return [...dashboardItems, ...reportingItems, ...managementItems, ...adminItems];
    }
    return [...dashboardItems, ...reportingItems, ...managementItems];
  }, [user?.roleName]);

  const [collapsed, setCollapsed] = useState(!isPinnedOpen);
  const expandedWidth = 240;
  const collapsedWidth = 64;

  useEffect(() => {
    setCollapsed(!isPinnedOpen);
  }, [isPinnedOpen]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' 
          ? colors.primary[600] 
          : '#f0f9ff',
        borderRight: `none`,
        boxShadow: theme.palette.mode === 'dark' 
          ? '6px 0 20px rgba(0, 0, 0, 0.5), inset -3px 0 6px rgba(255, 255, 255, 0.1)'
          : '6px 0 20px rgba(0, 0, 0, 0.2), inset -3px 0 6px rgba(0, 0, 0, 0.08)',
        position: 'fixed',
        top: '64px',
        left: 0,
        height: 'calc(100vh - 64px)',
        width: collapsed ? `${collapsedWidth}px` : `${expandedWidth}px`,
        zIndex: 999,
        display: 'block',
        visibility: 'visible',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '12px',
          height: '12px',
          background: theme.palette.mode === 'dark' 
            ? colors.primary[600] 
            : colors.primary[100],
          clipPath: 'polygon(100% 0, 0 0, 0 100%)',
          zIndex: 2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '12px',
          height: '12px',
          background: theme.palette.mode === 'dark' 
            ? colors.primary[600] 
            : colors.primary[100],
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          zIndex: 2,
        },
        "& .pro-sidebar-inner": {
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%) !important` 
            : `linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%) !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[400]} !important` 
            : `#e0f2fe !important`,
          borderRight: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.08)'} !important`,
          boxShadow: theme.palette.mode === 'dark' 
            ? 'inset -1px 0 0 rgba(255, 255, 255, 0.05) !important'
            : 'inset -1px 0 0 rgba(0, 0, 0, 0.04) !important',
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          marginRight: "6px !important",
          minWidth: "16px !important",
          display: "flex !important",
          alignItems: "center !important",
          justifyContent: "center !important",
        },
        "& .pro-item-content": {
          paddingLeft: "4px !important",
          overflow: "visible !important",
          textOverflow: "unset !important",
          whiteSpace: "nowrap !important",
          flex: "1 !important",
          display: "flex !important",
          alignItems: "center !important",
          minWidth: "0 !important",
        },
        "& .pro-item-content span": {
          overflow: "visible !important",
          textOverflow: "unset !important",
          whiteSpace: "nowrap !important",
          display: "block !important",
        },
        "& .pro-inner-item": {
          padding: "6px 10px 6px 6px !important",
          color: theme.palette.mode === 'dark' 
            ? `${colors.grey[100]} !important` 
            : `#1e3a8a !important`,
          overflow: "visible !important",
          minWidth: "auto !important",
          display: "flex !important",
          alignItems: "center !important",
        },
        "& .pro-menu-item": {
          overflow: "visible !important",
          minWidth: "auto !important",
          display: "block !important",
          padding: "3px 6px 3px 3px !important",
        },
        "& .pro-menu-item.pro-menu-item-header": {
          padding: "6px 8px 6px 4px !important",
        },
        "& .pro-menu-item.pro-menu-item-header .pro-inner-item": {
          padding: "6px 8px 6px 4px !important",
        },
        "& .pro-inner-item:hover": {
          color: theme.palette.mode === 'dark' 
            ? `${colors.blueAccent[400]} !important` 
            : `#0284c7 !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[500]} !important` 
            : `#e1f5fe !important`,
          borderRadius: '6px !important',
          transform: 'translateX(2px) !important',
          transition: 'all 0.2s ease-in-out !important',
        },
        "& .pro-menu-item.active": {
          color: theme.palette.mode === 'dark' 
            ? `${colors.blueAccent[400]} !important` 
            : `#ffffff !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[500]} !important` 
            : `#0284c7 !important`,
          borderRadius: '6px !important',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 2px 8px rgba(0, 0, 0, 0.3) !important'
            : '0 2px 8px rgba(2, 132, 199, 0.3) !important',
        },
        // Mobile optimizations
        ...(isMobile && {
          "& .pro-sidebar": {
            position: "fixed !important",
            zIndex: 1000,
          },
        }),
        // Ensure collapse button stays above top menu
        "& .pro-sidebar-header": {
          zIndex: 1001,
          position: "relative",
        },
        // Ensure sidebar stays above other content
        "& .pro-sidebar": {
          zIndex: 999,
          position: "fixed !important",
          top: "64px !important", // Start below the AppBar
          left: "0 !important",
          height: "calc(100vh - 64px) !important", // Adjust height to account for AppBar
          width: `${collapsedWidth}px !important`,
          display: "block !important",
          visibility: "visible !important",
        },
      }}
    >
      <ProSidebar 
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          height: 'calc(100vh - 64px)',
          width: `${collapsedWidth}px`, // Always collapsed - just show colored strip
          zIndex: 999,
          display: 'block',
          visibility: 'visible',
          backgroundColor: theme.palette.mode === 'dark' 
            ? colors.primary[600] 
            : '#81d4fa',
          borderRight: `1px solid ${theme.palette.mode === 'dark' 
            ? colors.primary[400] 
            : '#4fc3f7'}`,
        }}
      >
        {/* Empty sidebar - just the colored strip */}
        <Box sx={{ height: '100%', width: '100%' }} />

      </ProSidebar>
    </Box>
  );
};

export default Sidebar;