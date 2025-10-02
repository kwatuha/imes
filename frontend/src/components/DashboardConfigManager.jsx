import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  Edit as EditIcon2,
} from '@mui/icons-material';
import { tokens } from '../pages/dashboard/theme';
import dashboardConfigService from '../services/dashboardConfigService';

const DashboardConfigManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Configuration data
  const [roles, setRoles] = useState([]);
  const [components, setComponents] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  
  // Role configurations
  const [roleConfigs, setRoleConfigs] = useState({});
  const [selectedRole, setSelectedRole] = useState('admin');
  
  // Dialog states
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [openTabDialog, setOpenTabDialog] = useState(false);
  
  // Form data
  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    description: '',
    tabs: [],
    components: {}
  });
  
  const [componentFormData, setComponentFormData] = useState({
    component_key: '',
    component_name: '',
    component_type: '',
    component_file: '',
    description: '',
    is_active: true
  });
  
  const [tabFormData, setTabFormData] = useState({
    tab_key: '',
    tab_name: '',
    tab_icon: '',
    tab_order: 1,
    is_active: true
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load roles, components, tabs, and permissions
      const [rolesData, componentsData, tabsData, permissionsData] = await Promise.all([
        dashboardConfigService.getRoles(),
        dashboardConfigService.getAvailableComponents(),
        dashboardConfigService.getAvailableTabs(),
        dashboardConfigService.getAvailablePermissions()
      ]);
      
      setRoles(rolesData);
      setComponents(componentsData);
      setTabs(tabsData);
      setPermissions(permissionsData);
      
      // Load role configurations
      const configs = {};
      for (const role of rolesData) {
        try {
          console.log(`Loading config for role: ${role.roleName}`);
          const config = await dashboardConfigService.getRoleDashboardConfig(role.roleName);
          console.log(`Config loaded for ${role.roleName}:`, config);
          configs[role.roleName] = config;
        } catch (err) {
          console.error(`Error loading config for role ${role.roleName}:`, err);
          // Provide a default configuration structure
          configs[role.roleName] = { 
            role: role.roleName, 
            tabs: [],
            error: `Failed to load configuration for ${role.roleName}: ${err.message}`
          };
        }
      }
      setRoleConfigs(configs);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(`Failed to load dashboard configuration data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleName) => {
    setSelectedRole(roleName);
  };

  const handleSaveRoleConfig = async () => {
    try {
      setLoading(true);
      
      // Prepare the configuration data from the current state
      const configData = {
        tabs: roleConfigs[selectedRole]?.tabs || [],
        components: roleConfigs[selectedRole]?.tabs?.reduce((acc, tab) => {
          if (tab.components) {
            tab.components.forEach(comp => {
              acc[comp.component_key] = comp;
            });
          }
          return acc;
        }, {}) || {}
      };
      
      console.log('Saving role configuration:', selectedRole, configData);
      
      // Call the backend API to save the configuration
      await dashboardConfigService.updateRoleDashboardConfig(selectedRole, configData);
      
      setSuccessMessage(`Configuration saved for ${selectedRole} role! Changes have been applied to the dashboard.`);
      
      setOpenRoleDialog(false);
      // Reload data to show current state
      await loadDashboardData();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error saving role config:', err);
      setError(`Failed to save role configuration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComponent = (tabKey, componentKey, isRequired) => {
    // Update the role configuration state
    setRoleConfigs(prevConfigs => {
      const updatedConfigs = { ...prevConfigs };
      if (updatedConfigs[selectedRole] && updatedConfigs[selectedRole].tabs) {
        updatedConfigs[selectedRole].tabs = updatedConfigs[selectedRole].tabs.map(tab => {
          if (tab.tab_key === tabKey) {
            return {
              ...tab,
              components: tab.components.map(comp => 
                comp.component_key === componentKey 
                  ? { ...comp, is_required: isRequired }
                  : comp
              )
            };
          }
          return tab;
        });
      }
      return updatedConfigs;
    });
  };

  const handleRemoveComponent = (tabKey, componentKey) => {
    if (window.confirm(`Are you sure you want to remove this component from the ${tabKey} tab?`)) {
      setRoleConfigs(prevConfigs => {
        const updatedConfigs = { ...prevConfigs };
        if (updatedConfigs[selectedRole] && updatedConfigs[selectedRole].tabs) {
          updatedConfigs[selectedRole].tabs = updatedConfigs[selectedRole].tabs.map(tab => {
            if (tab.tab_key === tabKey) {
              return {
                ...tab,
                components: tab.components.filter(comp => comp.component_key !== componentKey)
              };
            }
            return tab;
          });
        }
        return updatedConfigs;
      });
    }
  };

  const handleAddComponentToTab = (tabKey) => {
    // This would open a dialog to select from available components
    console.log(`Add component to tab: ${tabKey}`);
    // For now, just show an alert
    alert(`Add component to ${tabKey} tab - This feature can be implemented to show available components`);
  };

  const handleCreateComponent = async () => {
    try {
      setLoading(true);
      await dashboardConfigService.createComponent(componentFormData);
      setOpenComponentDialog(false);
      setComponentFormData({
        component_key: '',
        component_name: '',
        component_type: '',
        component_file: '',
        description: '',
        is_active: true
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Error creating component:', err);
      setError('Failed to create component');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTab = async () => {
    try {
      setLoading(true);
      await dashboardConfigService.createTab(tabFormData);
      setOpenTabDialog(false);
      setTabFormData({
        tab_key: '',
        tab_name: '',
        tab_icon: '',
        tab_order: 1,
        is_active: true
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Error creating tab:', err);
      setError('Failed to create tab');
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = (iconName) => {
    const iconMap = {
      'Dashboard': <DashboardIcon />,
      'People': <PeopleIcon />,
      'Assignment': <AssignmentIcon />,
      'Analytics': <AnalyticsIcon />,
      'AttachMoney': <MoneyIcon />,
      'Settings': <SettingsIcon />
    };
    return iconMap[iconName] || <DashboardIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Dashboard Configuration...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={3}>
        Dashboard Configuration Manager
      </Typography>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Role Selection */}
      <Card sx={{ 
        mb: 3,
        borderRadius: 3, 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Select Role to Configure
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            {roles.map((role) => (
              <Button
                key={role.roleName}
                variant={selectedRole === role.roleName ? 'contained' : 'outlined'}
                onClick={() => handleRoleChange(role.roleName)}
                sx={{ 
                  bgcolor: selectedRole === role.roleName ? colors.blueAccent?.[500] : 'transparent',
                  borderColor: colors.blueAccent?.[500],
                  color: selectedRole === role.roleName ? 'white' : colors.blueAccent?.[500],
                  '&:hover': {
                    bgcolor: selectedRole === role.roleName ? colors.blueAccent?.[600] : colors.blueAccent?.[100],
                    color: selectedRole === role.roleName ? 'white' : colors.blueAccent?.[700]
                  }
                }}
              >
                {role.roleName}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Role Configuration Display */}
      {roleConfigs[selectedRole] && (
        <Card sx={{ 
          mb: 3,
          borderRadius: 3, 
          bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
          boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
          border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]}>
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard Configuration
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setOpenRoleDialog(true)}
                sx={{ 
                  bgcolor: colors.greenAccent?.[500] || '#4caf50',
                  '&:hover': { bgcolor: colors.greenAccent?.[600] || '#388e3c' }
                }}
              >
                Edit Configuration
              </Button>
            </Box>

            {/* Error Display */}
            {roleConfigs[selectedRole].error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {roleConfigs[selectedRole].error}
              </Alert>
            )}

            {/* Tabs Configuration */}
            {roleConfigs[selectedRole].tabs && roleConfigs[selectedRole].tabs.length > 0 ? (
              <Box>
                <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
                  Dashboard Tabs
                </Typography>
                <Grid container spacing={2}>
                  {roleConfigs[selectedRole].tabs.map((tab, index) => (
                    <Grid item xs={12} md={6} lg={4} key={tab.tab_key}>
                      <Card sx={{ 
                        p: 2,
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
                        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[200]}`,
                        borderRadius: 2
                      }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          {getTabIcon(tab.tab_icon)}
                          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
                            {tab.tab_name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]} mb={2}>
                          {tab.components?.length || 0} components
                        </Typography>
                        
                        {/* Components in this tab */}
                        {tab.components && tab.components.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                              Components:
                            </Typography>
                            {tab.components.map((component, compIndex) => (
                              <Chip
                                key={compIndex}
                                label={component.component_name}
                                size="small"
                                sx={{ 
                                  mr: 1, 
                                  mb: 1,
                                  bgcolor: theme.palette.mode === 'dark' ? colors.blueAccent?.[600] : colors.blueAccent?.[100],
                                  color: theme.palette.mode === 'dark' ? 'white' : colors.blueAccent?.[700]
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Alert severity="info">
                No dashboard configuration found for {selectedRole} role.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Management Actions */}
      <Card sx={{ 
        borderRadius: 3, 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={3}>
            Management Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenComponentDialog(true)}
                fullWidth
                sx={{ 
                  borderColor: colors.greenAccent?.[500],
                  color: colors.greenAccent?.[500],
                  '&:hover': { 
                    bgcolor: colors.greenAccent?.[100],
                    borderColor: colors.greenAccent?.[700]
                  }
                }}
              >
                Add Component
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenTabDialog(true)}
                fullWidth
                sx={{ 
                  borderColor: colors.blueAccent?.[500],
                  color: colors.blueAccent?.[500],
                  '&:hover': { 
                    bgcolor: colors.blueAccent?.[100],
                    borderColor: colors.blueAccent?.[700]
                  }
                }}
              >
                Add Tab
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={loadDashboardData}
                fullWidth
                sx={{ 
                  borderColor: colors.redAccent?.[500],
                  color: colors.redAccent?.[500],
                  '&:hover': { 
                    bgcolor: colors.redAccent?.[100],
                    borderColor: colors.redAccent?.[700]
                  }
                }}
              >
                Refresh Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Create Component Dialog */}
      <Dialog open={openComponentDialog} onClose={() => setOpenComponentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          Create New Component
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Component Key"
                value={componentFormData.component_key}
                onChange={(e) => setComponentFormData({...componentFormData, component_key: e.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Component Name"
                value={componentFormData.component_name}
                onChange={(e) => setComponentFormData({...componentFormData, component_name: e.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Component Type</InputLabel>
                <Select
                  value={componentFormData.component_type}
                  onChange={(e) => setComponentFormData({...componentFormData, component_type: e.target.value})}
                  label="Component Type"
                >
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="list">List</MenuItem>
                  <MenuItem value="chart">Chart</MenuItem>
                  <MenuItem value="table">Table</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Component File"
                value={componentFormData.component_file}
                onChange={(e) => setComponentFormData({...componentFormData, component_file: e.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={componentFormData.description}
                onChange={(e) => setComponentFormData({...componentFormData, description: e.target.value})}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={componentFormData.is_active}
                    onChange={(e) => setComponentFormData({...componentFormData, is_active: e.target.checked})}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setOpenComponentDialog(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateComponent} color="primary" variant="contained" startIcon={<SaveIcon />}>
            Create Component
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Tab Dialog */}
      <Dialog open={openTabDialog} onClose={() => setOpenTabDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          Create New Tab
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tab Key"
                value={tabFormData.tab_key}
                onChange={(e) => setTabFormData({...tabFormData, tab_key: e.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tab Name"
                value={tabFormData.tab_name}
                onChange={(e) => setTabFormData({...tabFormData, tab_name: e.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tab Icon"
                value={tabFormData.tab_icon}
                onChange={(e) => setTabFormData({...tabFormData, tab_icon: e.target.value})}
                variant="outlined"
                placeholder="e.g., Dashboard, People, Assignment"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tab Order"
                type="number"
                value={tabFormData.tab_order}
                onChange={(e) => setTabFormData({...tabFormData, tab_order: parseInt(e.target.value)})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tabFormData.is_active}
                    onChange={(e) => setTabFormData({...tabFormData, is_active: e.target.checked})}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setOpenTabDialog(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateTab} color="primary" variant="contained" startIcon={<SaveIcon />}>
            Create Tab
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Configuration Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          Edit {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard Configuration
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Configure Dashboard Tabs and Components
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Available Actions:</strong>
              <br />• <strong>Toggle Required/Optional:</strong> Use the switches to mark components as required or optional
              <br />• <strong>Remove Components:</strong> Click the delete icon to remove components from tabs
              <br />• <strong>Add Components:</strong> Click "Add Component" to add new components to tabs
              <br />• <strong>Save Changes:</strong> Click "Save Configuration" to apply all changes
              <br />
              <br /><strong>Note:</strong> Changes are applied immediately in the UI. The save function will persist your configuration changes.
            </Typography>
          </Alert>
          
          {roleConfigs[selectedRole] && roleConfigs[selectedRole].tabs && roleConfigs[selectedRole].tabs.length > 0 ? (
            <Box>
              {roleConfigs[selectedRole].tabs.map((tab, index) => (
                <Accordion key={tab.tab_key} sx={{ mb: 2, bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100] }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <Box display="flex" alignItems="center">
                        {getTabIcon(tab.tab_icon)}
                        <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
                          {tab.tab_name}
                        </Typography>
                        <Chip 
                          label={`${tab.components?.length || 0} components`} 
                          size="small" 
                          sx={{ ml: 2 }}
                          color="primary"
                        />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddComponentToTab(tab.tab_key);
                        }}
                        sx={{ mr: 2 }}
                      >
                        Add Component
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {tab.components && tab.components.map((component, compIndex) => (
                        <Grid item xs={12} md={6} key={compIndex}>
                          <Card sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[200] }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {component.component_name}
                                </Typography>
                                <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]} mb={1}>
                                  {component.component_type} • {component.component_file}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveComponent(tab.tab_key, component.component_key)}
                                sx={{ 
                                  color: colors.redAccent?.[500] || '#f44336',
                                  '&:hover': { bgcolor: colors.redAccent?.[100] || '#ffebee' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={component.is_required}
                                    onChange={(e) => {
                                      handleToggleComponent(tab.tab_key, component.component_key, e.target.checked);
                                    }}
                                    color="primary"
                                  />
                                }
                                label="Required"
                              />
                              <Chip
                                label={component.is_required ? "Required" : "Optional"}
                                size="small"
                                color={component.is_required ? "error" : "default"}
                                variant={component.is_required ? "filled" : "outlined"}
                              />
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              No configuration found for {selectedRole} role. You can add components and tabs using the management actions below.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setOpenRoleDialog(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveRoleConfig} color="primary" variant="contained" startIcon={<SaveIcon />}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardConfigManager;
