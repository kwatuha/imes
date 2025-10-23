import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MapIcon from '@mui/icons-material/Map';
import PaidIcon from '@mui/icons-material/Paid';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ApprovalIcon from '@mui/icons-material/Approval';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../configs/appConfig.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getFilteredMenuCategories } from '../configs/menuConfigUtils.js';

// Icon mapping for Material-UI icons
const ICON_MAP = {
  DashboardIcon,
  AssessmentIcon,
  SettingsIcon,
  GroupIcon,
  CloudUploadIcon,
  MapIcon,
  PaidIcon,
  AdminPanelSettingsIcon,
  PeopleIcon,
  AccountTreeIcon,
  ApprovalIcon,
  FeedbackIcon,
  StorageIcon,
  BusinessIcon,
};

// Simple ribbon-like top menu with grouped actions
export default function RibbonMenu({ isAdmin = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(3); // Default to Admin tab
  const { hasPrivilege, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get filtered menu categories based on user permissions
  const menuCategories = getFilteredMenuCategories(isAdmin, hasPrivilege, user);

  const go = (to) => () => navigate(to);

  useEffect(() => {
    const onScroll = () => {
      setCollapsed(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-navigate to Citizen feedback when Admin tab is selected
  useEffect(() => {
    if (isAdmin && tab === 3 && (hasPrivilege?.('feedback.respond') || user?.roleName === 'admin')) {
      navigate(ROUTES.FEEDBACK_MANAGEMENT);
    }
  }, [tab, isAdmin, hasPrivilege, user, navigate]);

  // Keyboard shortcuts: Alt+1..4 to switch tabs quickly
  useEffect(() => {
    const onKey = (e) => {
      if (!e.altKey) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num)) {
        if (num >= 1 && num <= (isAdmin ? 4 : 3)) {
          setTab(num - 1);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAdmin]);

  const Btn = ({ title, icon, to, route, onClick }) => {
    const IconComponent = ICON_MAP[icon] || DashboardIcon;
    const targetRoute = route && ROUTES[route] ? ROUTES[route] : to;
    const isActive = targetRoute && location.pathname.includes(String(targetRoute).split('?')[0]);
    
    return (
      <Tooltip title={title} arrow>
        <Button size="small" variant="contained" onClick={onClick || go(targetRoute)}
          sx={{
            px: 1,
            minWidth: 60,
            lineHeight: 1.1,
            fontSize: 9,
            height: 36,
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            textTransform: 'none',
            letterSpacing: 0.4,
            color: '#fff',
            background: isActive
              ? 'linear-gradient(180deg, #1e40af, #1e3a8a)'
              : 'linear-gradient(180deg, #3b82f6, #2563eb)',
            border: isActive 
              ? '2px solid #00FFFF'
              : '1px solid rgba(255,255,255,0.3)',
            boxShadow: isActive
              ? '0 4px 8px rgba(0,0,0,0.15), inset 0 0 8px rgba(0,255,255,0.2), 0 0 12px rgba(0,255,255,0.3)'
              : '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              background: isActive
                ? 'linear-gradient(180deg, #1e40af, #1e3a8a)'
                : 'linear-gradient(180deg, #2563eb, #1d4ed8)'
            }
          }}>
          <Box sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.35)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ lineHeight: 0, fontSize: 16, color: isActive ? '#00FFFF' : '#FFD700' }}>
              <IconComponent fontSize="small" />
            </Box>
          </Box>
          <Box component="span" className="label" sx={{ display: { xs: 'none', sm: 'inline' } }}>{title}</Box>
        </Button>
      </Tooltip>
    );
  };

  return (
    <Box sx={{
      position: 'sticky',
      top: '64px',
      zIndex: 998,
      // Glass / gradient background
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(20,25,30,0.65)' : 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      backgroundImage: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))'
        : 'linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0))',
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.palette.mode === 'dark' ? 'inset 0 -1px 0 rgba(255,255,255,0.06)' : '0 2px 8px rgba(0,0,0,0.06)',
    }}
    onMouseEnter={() => setCollapsed(false)}
    onMouseLeave={() => { if (window.scrollY > 80) setCollapsed(true); }}
    >
      {/* Segmented ribbon bar */}
      <Box sx={{
        display: 'flex',
        gap: 0,
        px: 1,
        py: 0.5,
        minHeight: collapsed ? 26 : 30,
      }}>
        {menuCategories.map((category, idx, arr) => {
          const IconComponent = ICON_MAP[category.icon] || DashboardIcon;
          return (
            <Button
            key={category.label}
            onClick={() => setTab(idx)}
            startIcon={<IconComponent fontSize="small" />}
            disableElevation
            sx={{
              flex: 1,
              textTransform: 'none',
              color: '#fff',
              fontWeight: 600,
              letterSpacing: 0.25,
              fontSize: 12,
              height: collapsed ? 26 : 32,
              borderRadius: 0,
              borderTopLeftRadius: idx === 0 ? 8 : 0,
              borderBottomLeftRadius: idx === 0 ? 8 : 0,
              borderTopRightRadius: idx === arr.length - 1 ? 8 : 0,
              borderBottomRightRadius: idx === arr.length - 1 ? 8 : 0,
              background: idx === tab
                ? 'linear-gradient(180deg, #1099b6, #0e8ea9)'
                : 'linear-gradient(180deg, #28b9d4, #18a8c4)',
              boxShadow: idx === tab ? 'inset 0 0 0 1px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.15)' : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
              '&:hover': {
                background: idx === tab
                  ? 'linear-gradient(180deg, #0f91ae, #0c86a2)'
                  : 'linear-gradient(180deg, #22b2ce, #159fba)'
              },
              borderRight: idx !== arr.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none',
            }}
          >
            {category.label}
          </Button>
          );
        })}
      </Box>

      {/* Ribbon group row (hidden when collapsed to maximize space) */}
      {!collapsed && (
      <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.25, flexWrap: 'wrap', borderTop: `1px solid ${theme.palette.divider}` }}>
        {menuCategories[tab] && menuCategories[tab].submenus.map((submenu, subIdx) => (
          <Btn 
            key={subIdx}
            title={submenu.title} 
            icon={submenu.icon} 
            route={submenu.route}
            to={submenu.to}
          />
        ))}
      </Box>
      )}
    </Box>
  );
}


