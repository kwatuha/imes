import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../pages/dashboard/theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenThemeMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseThemeMenu = () => setAnchorEl(null);
  const handleSetMode = (mode) => {
    if (colorMode.setMode) {
      colorMode.setMode(mode);
    }
    setAnchorEl(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={theme.palette.mode === "light" ? theme.palette.background.paper : colors.primary[400]}
        borderRadius="8px"
        border={`1px solid ${theme.palette.mode === "light" ? theme.palette.divider : colors.primary[600]}`}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton 
          onClick={colorMode.toggleColorMode} 
          sx={{ color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900] }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpenThemeMenu} sx={{ color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900] }}>
          <PaletteOutlinedIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseThemeMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={() => handleSetMode('professional')}>Professional</MenuItem>
          <MenuItem onClick={() => handleSetMode('light')}>Light</MenuItem>
          <MenuItem onClick={() => handleSetMode('dark')}>Dark</MenuItem>
        </Menu>
        <IconButton sx={{ color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900] }}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900] }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900] }}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;