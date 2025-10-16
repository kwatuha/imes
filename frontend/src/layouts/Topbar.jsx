import { 
  Box, 
  IconButton, 
  useTheme, 
  Typography, 
  Badge, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Divider
} from "@mui/material";
import { useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../context/PageTitleContext';
import { useProfileModal } from '../context/ProfileModalContext';

const Topbar = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { pageTitle, pageSubtitle } = usePageTitle();
  const { openModal: openProfileModal } = useProfileModal();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    openProfileModal();
    handleClose();
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings modal or navigation
    console.log('Settings clicked');
    handleClose();
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      width="100%"
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        px: 3,
        py: 1,
        minHeight: '64px'
      }}
    >
      {/* PAGE TITLE SECTION */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ 
            color: 'white',
            mr: 2
          }}
        >
          {pageTitle}
        </Typography>
        {pageSubtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              ml: 1
            }}
          >
            {pageSubtitle}
          </Typography>
        )}
      </Box>

      {/* RIGHT SECTION */}
      <Box display="flex" alignItems="center" gap={1}>
        {/* NOTIFICATIONS */}
        <IconButton 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        
        {/* USER AVATAR */}
        <IconButton 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.875rem'
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
        </IconButton>

        {/* THREE-DOT MENU */}
        <IconButton
          onClick={handleClick}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <MoreVertIcon />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* SEARCH */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SearchIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Search</ListItemText>
          </MenuItem>
          
          {/* HELP */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <HelpOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Help & Support</ListItemText>
          </MenuItem>
          
          {/* SETTINGS */}
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          {/* PROFILE */}
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile Settings</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

// Clean topbar with three-dot menu
export default Topbar;
