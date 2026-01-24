import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PageTitleProvider } from '../context/PageTitleContext.jsx';
import { ProfileModalProvider } from '../context/ProfileModalContext.jsx';
import { usePageTitleEffect } from '../hooks/usePageTitle.js';
import { ROUTES } from '../configs/appConfig.js';
import logo from '../assets/logo.png';
import { useTheme } from "@mui/material";
// ✨ Removed old theme system imports
import Topbar from "./Topbar.jsx";
import Sidebar from "./Sidebar.jsx";
import FloatingChatButton from "../components/chat/FloatingChatButton.jsx";
import RibbonMenu from "./RibbonMenu.jsx";

const expandedSidebarWidth = 240;
const collapsedSidebarWidth = 64;

function MainLayoutContent() {
  const theme = useTheme();
  // ✨ Using MUI theme directly - simpler and clearer!

  const [mobileOpen, setMobileOpen] = useState(false);
  // Sidebar pin (expanded) state for desktop
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-update page title based on route
  usePageTitleEffect();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  useEffect(() => {
    if (user && user.roleName === 'contractor' && location.pathname !== ROUTES.CONTRACTOR_DASHBOARD) {
        navigate(ROUTES.CONTRACTOR_DASHBOARD, { replace: true });
    }
  }, [location.pathname, user, navigate]);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };
  
  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ p: 0, minHeight: '48px !important', height: '48px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1.5, display: { sm: 'none' }, p: 1 }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '180px' }}>
              <img src={logo} alt="E-CIMES Logo" style={{ height: '32px', marginRight: '8px' }} />
              <Typography variant="h6" noWrap component="div" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                E-CIMES
              </Typography>
            </Box>
            
            <Topbar />
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              size="small"
              sx={{
                ml: 1.5, 
                backgroundColor: '#dc2626',
                '&:hover': { backgroundColor: '#b91c1c' },
                color: 'white', 
                fontWeight: 'semibold', 
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s ease-in-out',
                minWidth: '70px',
                py: 0.5,
                px: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Sidebar 
          mobileOpen={mobileOpen}
          onMobileClose={handleDrawerToggle}
          isPinnedOpen={isSidebarPinnedOpen}
          onTogglePinned={() => setIsSidebarPinnedOpen((v) => !v)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1, 
            p: 0,
            mt: '48px',
            // Do not shift on hover; only shift when pinned open
            width: { sm: `calc(100% - ${isSidebarPinnedOpen ? expandedSidebarWidth : collapsedSidebarWidth}px)` },
            ml: { sm: `${isSidebarPinnedOpen ? expandedSidebarWidth : collapsedSidebarWidth}px` },
            minHeight: 'calc(100vh - 48px)',
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.default
              : '#ffffff',
            borderLeft: { sm: `none` },
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Ribbon-style top menu (experimental) */}
          <RibbonMenu isAdmin={user?.roleName === 'admin'} />
          <Box sx={{ 
            flex: 1,
            p: { xs: 0.75, sm: 1, md: 1.25 },
            overflow: 'auto'
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      
      {/* Floating Chat Button */}
      <FloatingChatButton />
    </>
  );
}

function MainLayout() {
  return (
    <PageTitleProvider>
      <ProfileModalProvider>
        <MainLayoutContent />
      </ProfileModalProvider>
    </PageTitleProvider>
  );
}

export default MainLayout;