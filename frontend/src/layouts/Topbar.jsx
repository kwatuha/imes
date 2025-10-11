import { Box, IconButton, useTheme } from "@mui/material";
import { useState } from "react";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={theme.palette.background.paper}
        borderRadius="8px"
        border={`1px solid ${theme.palette.divider}`}
        sx={{
          '&:focus-within': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
          }
        }}
      >
        <InputBase 
          sx={{ 
            ml: 2, 
            flex: 1,
            color: theme.palette.text.primary
          }} 
          placeholder="Search projects, users..." 
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" gap={1}>
        <IconButton 
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
