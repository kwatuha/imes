import React, { useEffect, useState, useMemo, useRef } from 'react';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PublicIcon from '@mui/icons-material/Public';
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
  AssignmentIcon,
  AnnouncementIcon,
  PublicIcon,
};

// Simple ribbon-like top menu with grouped actions
export default function RibbonMenu({ isAdmin = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPrivilege, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const timeoutRefs = useRef({});
  
  // Get filtered menu categories based on user permissions (memoized to prevent unnecessary recalculations)
  const menuCategories = useMemo(() => {
    return getFilteredMenuCategories(isAdmin, hasPrivilege, user);
  }, [isAdmin, hasPrivilege, user]);
  
  const [tab, setTab] = useState(isAdmin ? 3 : 0); // Default to Admin tab if admin, otherwise Dashboard
  
  // Ensure tab is always valid
  const validTab = tab >= 0 && tab < menuCategories.length ? tab : 0;

  const go = (to) => () => navigate(to);

  // Only collapse the primary menu bar height on scroll, but keep submenu visible when tab is active or hovered
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Collapse primary menu height when scrolled, but don't hide submenu if tab is active
          // The submenu visibility is controlled separately by validTab and hoveredTab
          // Only update if hoveredTab is null to prevent conflicts
          if (hoveredTab === null) {
            setCollapsed(window.scrollY > 80);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hoveredTab]);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      timeoutRefs.current = {};
    };
  }, []);

  const Btn = ({ title, icon, to, route, onClick }) => {
    const IconComponent = ICON_MAP[icon] || DashboardIcon;
    const targetRoute = route && ROUTES[route] ? ROUTES[route] : to;
    const isActive = targetRoute && location.pathname.includes(String(targetRoute).split('?')[0]);
    
    return (
      <Tooltip title={title} arrow>
        <Button size="small" variant="contained" onClick={onClick || go(targetRoute)}
          sx={{
            px: 0.75,
            minWidth: 50,
            lineHeight: 1.2,
            fontSize: 10,
            height: 38,
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            textTransform: 'none',
            letterSpacing: 0.3,
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
            },
            '&:active': {
              transform: 'translateY(0px)',
            }
          }}>
          <Box sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.35)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ lineHeight: 0, fontSize: 18, color: isActive ? '#00FFFF' : '#FFD700' }}>
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
      top: '48px',
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
      marginTop: 0,
      marginBottom: 0,
    }}
    onMouseEnter={() => {
      // Prevent collapse when hovering over the ribbon
      setCollapsed(false);
    }}
    onMouseLeave={() => { 
      // Only collapse if scrolled and no tab is hovered
      if (window.scrollY > 80 && hoveredTab === null) {
        // Clear any existing timeout
        if (timeoutRefs.current.ribbonLeave) {
          clearTimeout(timeoutRefs.current.ribbonLeave);
        }
        // Use setTimeout to prevent rapid state changes
        timeoutRefs.current.ribbonLeave = setTimeout(() => {
          if (hoveredTab === null) {
            setCollapsed(true);
          }
          delete timeoutRefs.current.ribbonLeave;
        }, 100);
      }
    }}
    >
      {/* Segmented ribbon bar */}
      <Box sx={{
        display: 'flex',
        gap: 0,
        px: 0.75,
        py: 0.25,
        height: collapsed ? 22 : 26,
        transition: 'height 0.2s ease-in-out',
        overflow: 'hidden',
      }}>
        {menuCategories.map((category, idx, arr) => {
          const IconComponent = ICON_MAP[category.icon] || DashboardIcon;
          const isActiveOrHovered = idx === validTab || idx === hoveredTab;
          return (
            <Button
            key={category.label}
            onClick={() => setTab(idx)}
            onMouseEnter={() => {
              setHoveredTab(idx);
              setCollapsed(false); // Show submenu when hovering
            }}
            onMouseLeave={() => {
              // Clear any existing timeout for this tab
              if (timeoutRefs.current[`tab-${idx}`]) {
                clearTimeout(timeoutRefs.current[`tab-${idx}`]);
              }
              // Delay clearing hover to allow moving to submenu
              timeoutRefs.current[`tab-${idx}`] = setTimeout(() => {
                if (window.scrollY > 80 && idx !== validTab) {
                  setHoveredTab(null);
                }
                delete timeoutRefs.current[`tab-${idx}`];
              }, 200);
            }}
            startIcon={<IconComponent fontSize="small" />}
            disableElevation
            sx={{
              flex: 1,
              textTransform: 'none',
              color: '#fff',
              fontWeight: 600,
              letterSpacing: 0.25,
              fontSize: 11,
              height: collapsed ? 22 : 26,
              transition: 'height 0.2s ease-in-out, background 0.15s ease-in-out',
              borderRadius: 0,
              borderTopLeftRadius: idx === 0 ? 8 : 0,
              borderBottomLeftRadius: idx === 0 ? 8 : 0,
              borderTopRightRadius: idx === arr.length - 1 ? 8 : 0,
              borderBottomRightRadius: idx === arr.length - 1 ? 8 : 0,
              background: idx === validTab
                ? 'linear-gradient(180deg, #1099b6, #0e8ea9)'
                : 'linear-gradient(180deg, #28b9d4, #18a8c4)',
              boxShadow: idx === validTab ? 'inset 0 0 0 1px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.15)' : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
              '&:hover': {
                background: idx === validTab
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

      {/* Ribbon group row - Always show when tab is active or hovered, regardless of scroll */}
      {(() => {
        const activeTabIndex = hoveredTab !== null ? hoveredTab : validTab;
        const activeCategory = menuCategories[activeTabIndex];
        const shouldShowSubmenu = activeCategory && activeCategory.submenus && activeCategory.submenus.length > 0;
        
        // Always show submenu when a tab is active or hovered, regardless of scroll position
        return shouldShowSubmenu && (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 0, 
              px: 0.75, 
              py: 0.25, 
              flexWrap: 'wrap', 
              borderTop: `1px solid ${theme.palette.divider}`, 
              minHeight: 42,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(20,25,30,0.95)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={() => {
              if (hoveredTab === null) {
                setHoveredTab(activeTabIndex);
              }
            }}
            onMouseLeave={() => {
              // Clear any existing timeout for submenu
              if (timeoutRefs.current.submenu) {
                clearTimeout(timeoutRefs.current.submenu);
              }
              // Only clear hover if we're not leaving to another tab
              timeoutRefs.current.submenu = setTimeout(() => {
                if (hoveredTab === activeTabIndex) {
                  setHoveredTab(null);
                }
                delete timeoutRefs.current.submenu;
              }, 100);
            }}
          >
            {activeCategory.submenus.map((submenu, subIdx) => (
              <Btn 
                key={subIdx}
                title={submenu.title} 
                icon={submenu.icon} 
                route={submenu.route}
                to={submenu.to}
              />
            ))}
          </Box>
        );
      })()}
    </Box>
  );
}


