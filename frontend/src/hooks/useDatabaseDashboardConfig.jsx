import { useState, useEffect, useCallback } from 'react';
import dashboardConfigService from '../services/dashboardConfigService';

// Hook for database-driven dashboard configuration
export const useDatabaseDashboardConfig = (user) => {
  const [dashboardConfig, setDashboardConfig] = useState({
    loading: true,
    error: null,
    tabs: [],
    components: {},
    permissions: {},
    layout: null
  });

  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard configuration for the user
  const fetchDashboardConfig = useCallback(async () => {
    if (!user?.id) return;

    try {
      setDashboardConfig(prev => ({ ...prev, loading: true, error: null }));

      // Fetch user's dashboard layout
      const layout = await dashboardConfigService.getDashboardLayout(user.id);
      
      // Fetch user's permissions
      const permissions = await dashboardConfigService.getUserDashboardPermissions(user.id);

      setDashboardConfig({
        loading: false,
        error: null,
        tabs: layout.tabs || [],
        components: layout.components || {},
        permissions: permissions || {},
        layout: layout
      });
    } catch (error) {
      console.error('Error fetching dashboard config:', error);
      setDashboardConfig(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard configuration'
      }));
    }
  }, [user?.id]);

  // Refresh dashboard configuration
  const refreshDashboardConfig = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDashboardConfig();
    } finally {
      setRefreshing(false);
    }
  }, [fetchDashboardConfig]);

  // Check if user can access a specific tab
  const canAccessTab = useCallback(async (tabKey) => {
    if (!user?.id) return false;
    
    try {
      return await dashboardConfigService.canAccessTab(user.id, tabKey);
    } catch (error) {
      console.error('Error checking tab access:', error);
      return false;
    }
  }, [user?.id]);

  // Check if user can access a specific component
  const canAccessComponent = useCallback(async (componentKey) => {
    if (!user?.id) return false;
    
    try {
      return await dashboardConfigService.canAccessComponent(user.id, componentKey);
    } catch (error) {
      console.error('Error checking component access:', error);
      return false;
    }
  }, [user?.id]);

  // Get components for a specific tab
  const getTabComponents = useCallback((tabKey) => {
    if (!dashboardConfig.components[tabKey]) return [];
    // Extract component keys from the component objects
    return dashboardConfig.components[tabKey].map(comp => comp.component_key) || [];
  }, [dashboardConfig.components]);

  // Get available tabs for the user
  const getAvailableTabs = useCallback(() => {
    return dashboardConfig.tabs || [];
  }, [dashboardConfig.tabs]);

  // Update user dashboard preferences
  const updateUserPreferences = useCallback(async (preferences) => {
    if (!user?.id) return false;
    
    try {
      await dashboardConfigService.updateUserDashboardPreferences(user.id, preferences);
      // Refresh the configuration after updating preferences
      await fetchDashboardConfig();
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }, [user?.id, fetchDashboardConfig]);

  // Load configuration when user changes
  useEffect(() => {
    if (user?.id) {
      fetchDashboardConfig();
    }
  }, [user?.id, fetchDashboardConfig]);

  return {
    // State
    dashboardConfig,
    refreshing,
    
    // Actions
    refreshDashboardConfig,
    updateUserPreferences,
    
    // Permission checks
    canAccessTab,
    canAccessComponent,
    
    // Data accessors
    getTabComponents,
    getAvailableTabs,
    
    // Computed properties
    isLoading: dashboardConfig.loading,
    hasError: !!dashboardConfig.error,
    error: dashboardConfig.error,
    tabs: dashboardConfig.tabs,
    components: dashboardConfig.components,
    permissions: dashboardConfig.permissions
  };
};

// Hook for managing dashboard components (admin only)
export const useDashboardComponentManagement = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all available components
  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardConfigService.getAvailableComponents();
      setComponents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new component
  const createComponent = useCallback(async (componentData) => {
    try {
      const newComponent = await dashboardConfigService.createDashboardComponent(componentData);
      setComponents(prev => [...prev, newComponent]);
      return newComponent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update component
  const updateComponent = useCallback(async (componentKey, componentData) => {
    try {
      const updatedComponent = await dashboardConfigService.updateDashboardComponent(componentKey, componentData);
      setComponents(prev => prev.map(comp => 
        comp.component_key === componentKey ? updatedComponent : comp
      ));
      return updatedComponent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete component
  const deleteComponent = useCallback(async (componentKey) => {
    try {
      await dashboardConfigService.deleteDashboardComponent(componentKey);
      setComponents(prev => prev.filter(comp => comp.component_key !== componentKey));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent
  };
};

// Hook for managing role dashboard configuration (admin only)
export const useRoleDashboardManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update role dashboard configuration
  const updateRoleConfig = useCallback(async (roleName, configData) => {
    try {
      const updatedConfig = await dashboardConfigService.updateRoleDashboardConfig(roleName, configData);
      return updatedConfig;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update role permissions
  const updateRolePermissions = useCallback(async (roleName, permissions) => {
    try {
      const updatedPermissions = await dashboardConfigService.updateRolePermissions(roleName, permissions);
      return updatedPermissions;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    roles,
    loading,
    error,
    updateRoleConfig,
    updateRolePermissions
  };
};


