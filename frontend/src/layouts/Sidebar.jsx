import { useState, useMemo, useCallback, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { 
  Box, 
  IconButton, 
  Typography, 
  useTheme, 
  Divider, 
  Tooltip, 
  TextField, 
  InputAdornment,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Fade,
  Zoom
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../pages/dashboard/theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchIcon from '@mui/icons-material/Search';
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

import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../configs/appConfig.js';
import logo from '../assets/logo.png';
import userProfilePicture from '../assets/user.png';

const Item = ({ title, to, icon, selected, setSelected, isCollapsed, privilegeCheck }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (privilegeCheck && !privilegeCheck()) {
    return null;
  }

  return (
    <Tooltip title={title} placement="right" disableHoverListener={!isCollapsed}>
      <MenuItem
        active={selected === title}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    </Tooltip>
  );
};

const MenuGroup = ({ title, icon, children, isCollapsed, isOpen, onToggle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <MenuItem
        onClick={onToggle}
        style={{ 
          color: colors.grey[100],
          fontWeight: 'bold',
          backgroundColor: colors.primary[500]
        }}
        icon={icon}
      >
        <Typography variant="h6">{title}</Typography>
        {!isCollapsed && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </MenuItem>
      <Collapse in={isOpen && !isCollapsed} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const SearchableMenu = ({ items, selected, setSelected, isCollapsed, searchTerm }) => {
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <Fade in={true} timeout={300}>
      <Box>
        {filteredItems.map((item, index) => (
          <Zoom in={true} timeout={300 + index * 50} key={index}>
            <Box>
              <Item
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
                privilegeCheck={item.privilege}
              />
            </Box>
          </Zoom>
        ))}
      </Box>
    </Fade>
  );
};

const Sidebar = ({ collapsed, onCollapseChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isCollapsed, setIsCollapsed] = useState(collapsed !== undefined ? collapsed : false);
  const [selected, setSelected] = useState(location.pathname);
  const [searchTerm, setSearchTerm] = useState('');
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    reporting: true,
    management: true,
    admin: false
  });

  const { user, hasPrivilege } = useAuth();
  
  // Update selected state when route changes
  useState(() => {
    setSelected(location.pathname);
  }, [location]);

  // Sync internal state with prop
  useEffect(() => {
    if (collapsed !== undefined) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  // Handle group toggle with useCallback for performance
  const toggleGroup = useCallback((groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  }, []);

  // Handle search with debouncing
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Auto-collapse on mobile
  const handleCollapseToggle = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  // Organized menu groups
  const dashboardItems = [
    { title: "Dashboard", to: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { title: "Raw Data", to: ROUTES.RAW_DATA, icon: <TableChartIcon /> },
    { title: "Project Management", to: ROUTES.PROJECTS, icon: <FolderOpenIcon /> },
    { title: "Contractor Dashboard", to: ROUTES.CONTRACTOR_DASHBOARD, icon: <PaidIcon /> },
  ];

  const reportingItems = [
    { title: "Reports", to: ROUTES.REPORTS, icon: <AssessmentIcon /> },
    { title: "Comprehensive Reporting", to: ROUTES.REPORTING, icon: <AssessmentIcon /> },
    { title: "Project Dashboards", to: ROUTES.REPORTING_OVERVIEW, icon: <AssessmentIcon /> },
    { title: "Regional Rpts", to: ROUTES.REGIONAL_DASHBOARD, icon: <AssessmentIcon /> },
    { title: "Regional Dashboards", to: ROUTES.REGIONAL_REPORTING, icon: <AssessmentIcon /> },
  ];

  const managementItems = [
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

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: theme.palette.mode === 'dark' 
            ? `${colors.primary[400]} !important` 
            : `${colors.primary[50]} !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[400]} !important` 
            : `${colors.primary[50]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: theme.palette.mode === 'dark' 
            ? `${colors.grey[100]} !important` 
            : `${colors.grey[900]} !important`,
        },
        "& .pro-inner-item:hover": {
          color: theme.palette.mode === 'dark' 
            ? `${colors.blueAccent[400]} !important` 
            : `${colors.blueAccent[600]} !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[500]} !important` 
            : `${colors.primary[100]} !important`,
        },
        "& .pro-menu-item.active": {
          color: theme.palette.mode === 'dark' 
            ? `${colors.blueAccent[400]} !important` 
            : `${colors.blueAccent[600]} !important`,
          backgroundColor: theme.palette.mode === 'dark' 
            ? `${colors.primary[500]} !important` 
            : `${colors.primary[100]} !important`,
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
        "& .pro-menu-item": {
          zIndex: 1000,
        },
        // Ensure sidebar stays above other content
        "& .pro-sidebar": {
          zIndex: 999,
          position: "fixed",
          top: "64px", // Start below the AppBar
          left: 0,
          height: "calc(100vh - 64px)", // Adjust height to account for AppBar
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        {/* Collapse button for collapsed state */}
        {isCollapsed && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "15px 10px",
              position: "relative",
              zIndex: 1002,
            }}
          >
            <Tooltip title="Expand Sidebar" placement="right">
              <IconButton 
                onClick={handleCollapseToggle}
                sx={{
                  backgroundColor: colors.blueAccent[500],
                  color: colors.grey[100],
                  border: `2px solid ${colors.blueAccent[300]}`,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: colors.blueAccent[400],
                    color: colors.grey[100],
                    transform: 'scale(1.15)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  },
                  '&:focus': {
                    outline: `3px solid ${colors.blueAccent[200]}`,
                    outlineOffset: '3px',
                  },
                  transition: 'all 0.3s ease-in-out',
                  minWidth: '48px',
                  minHeight: '48px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.8rem',
                  }
                }}
              >
                <MenuOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Menu iconShape="square">
          {/* Clean Header - Logo and Collapse Button Only */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              margin: "10px 15px",
              backgroundColor: theme.palette.mode === 'dark' 
                ? colors.primary[600] 
                : colors.primary[50],
              // Force light theme override
              ...(theme.palette.mode !== 'dark' && {
                backgroundColor: `${colors.primary[50]} !important`,
              }),
              borderRadius: "12px",
              position: "relative",
              zIndex: 1005,
              marginTop: "10px",
              border: `2px solid ${theme.palette.mode === 'dark' 
                ? colors.primary[400] 
                : colors.primary[100]}`,
              boxShadow: theme.palette.mode === 'dark' 
                ? "0 4px 12px rgba(0,0,0,0.15)" 
                : "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Clean Title Only */}
            <Box display="flex" alignItems="center">
              <Typography 
                variant="h4" 
                color={theme.palette.mode === 'dark' 
                  ? colors.grey[100] 
                  : colors.grey[900]}
                sx={{ fontWeight: 'bold' }}
              >
                Menu
                </Typography>
            </Box>
            
            {/* Collapse Button */}
            <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="left">
              <IconButton 
                onClick={handleCollapseToggle}
                sx={{
                  position: "relative",
                  zIndex: 1006,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? colors.blueAccent[600] 
                    : colors.blueAccent[500],
                  color: theme.palette.mode === 'dark' 
                    ? colors.grey[100] 
                    : colors.grey[100],
                  border: `2px solid ${theme.palette.mode === 'dark' 
                    ? colors.blueAccent[400] 
                    : colors.blueAccent[600]}`,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? colors.blueAccent[500] 
                      : colors.blueAccent[600],
                    color: colors.grey[100],
                    transform: 'scale(1.1)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 6px 16px rgba(0,0,0,0.3)' 
                      : '0 6px 16px rgba(0,0,0,0.2)',
                  },
                  '&:focus': {
                    outline: `3px solid ${theme.palette.mode === 'dark' 
                      ? colors.blueAccent[300] 
                      : colors.blueAccent[400]}`,
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.2s ease-in-out',
                  minWidth: '40px',
                  minHeight: '40px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.4rem',
                  }
                }}
              >
                  <MenuOutlinedIcon />
                </IconButton>
            </Tooltip>
              </Box>

          {/* User Profile Section - Cleaner Design */}
          {!isCollapsed && (
            <Box 
              sx={{ 
                margin: "20px 15px",
                padding: "20px",
                backgroundColor: theme.palette.mode === 'dark' 
                  ? colors.primary[500] 
                  : colors.primary[50],
                borderRadius: "12px",
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? colors.primary[300] 
                  : colors.primary[100]}`,
                textAlign: "center"
              }}
            >
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <img
                  alt="Profile Picture"
                  width="80px"
                  height="80px"
                  src={userProfilePicture}
                  style={{ 
                    cursor: "pointer", 
                    borderRadius: "50%",
                    border: `3px solid ${colors.blueAccent[500]}`
                  }}
                />
              </Box>
                <Typography
                variant="h5"
                color={theme.palette.mode === 'dark' 
                  ? colors.grey[100] 
                  : colors.grey[900]}
                  fontWeight="bold"
                sx={{ mb: 0.5 }}
                >
                  {user?.username}
                </Typography>
              <Typography 
                variant="body2" 
                color={theme.palette.mode === 'dark' 
                  ? colors.greenAccent[400] 
                  : colors.greenAccent[600]}
                sx={{ 
                  fontWeight: 'medium',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                  {user?.roleName}
                </Typography>
              </Box>
          )}

          {/* Search functionality */}
          {!isCollapsed && (
            <Box sx={{ margin: "0 15px 15px 15px" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? colors.primary[400] 
                      : colors.grey[50],
                    color: theme.palette.mode === 'dark' 
                      ? colors.grey[100] 
                      : colors.grey[900],
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' 
                        ? colors.grey[300] 
                        : colors.grey[400],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' 
                        ? colors.grey[200] 
                        : colors.grey[500],
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' 
                        ? colors.blueAccent[500] 
                        : colors.blueAccent[600],
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: theme.palette.mode === 'dark' 
                      ? colors.grey[300] 
                      : colors.grey[600],
                  },
                }}
              />
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {searchTerm ? (
              // Show search results
              <SearchableMenu
                items={allItems}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
                searchTerm={searchTerm}
              />
            ) : user?.roleName === 'contractor' ? (
              // Contractor menu (simple list)
              contractorItems.map((item, index) => (
              <Item
                key={index}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
                privilegeCheck={item.privilege}
              />
              ))
            ) : (
              // Organized menu groups for internal staff and admin
              <>
                <MenuGroup
                  title="Dashboard"
                  icon={<DashboardIcon />}
                  isCollapsed={isCollapsed}
                  isOpen={openGroups.dashboard}
                  onToggle={() => toggleGroup('dashboard')}
                >
                  <SearchableMenu
                    items={dashboardItems}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                    searchTerm=""
                  />
                </MenuGroup>

                <MenuGroup
                  title="Reporting"
                  icon={<AssessmentIcon />}
                  isCollapsed={isCollapsed}
                  isOpen={openGroups.reporting}
                  onToggle={() => toggleGroup('reporting')}
                >
                  <SearchableMenu
                    items={reportingItems}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                    searchTerm=""
                  />
                </MenuGroup>

                <MenuGroup
                  title="Management"
                  icon={<SettingsIcon />}
                  isCollapsed={isCollapsed}
                  isOpen={openGroups.management}
                  onToggle={() => toggleGroup('management')}
                >
                  <SearchableMenu
                    items={managementItems}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                    searchTerm=""
                  />
                </MenuGroup>

                {user?.roleName === 'admin' && (
                  <MenuGroup
                    title="Administration"
                    icon={<GroupIcon />}
                    isCollapsed={isCollapsed}
                    isOpen={openGroups.admin}
                    onToggle={() => toggleGroup('admin')}
                  >
                    <SearchableMenu
                      items={adminItems}
                      selected={selected}
                      setSelected={setSelected}
                      isCollapsed={isCollapsed}
                      searchTerm=""
                    />
                  </MenuGroup>
                )}
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;