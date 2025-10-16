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

const drawerWidth = 240;

function MainLayoutContent() {
  const theme = useTheme();
  // ✨ Using MUI theme directly - simpler and clearer!

  const [mobileOpen, setMobileOpen] = useState(false);
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
        <Toolbar sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
              <img src={logo} alt="IPMES Logo" style={{ height: '40px', marginRight: '10px' }} />
              <Typography variant="h6" noWrap component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                IPMES
              </Typography>
            </Box>
            
            <Topbar />
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                ml: 2, 
                backgroundColor: '#dc2626',
                '&:hover': { backgroundColor: '#b91c1c' },
                color: 'white', 
                fontWeight: 'semibold', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s ease-in-out',
                minWidth: '80px'
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
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 }, 
            mt: '64px',
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.default
              : '#ffffff',
            borderLeft: { sm: `none` },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Outlet />
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