import axiosInstance from './axiosInstance';

const dashboardService = {
  // Get dashboard data for a specific user
  getDashboardData: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get notifications for a user
  getNotifications: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return default notifications if API fails
      return [
        { id: 1, type: 'timeline', title: 'New Timeline Notifications', count: 0, priority: 'low', icon: 'schedule' },
        { id: 2, type: 'project', title: 'New Project Updates', count: 0, priority: 'medium', icon: 'assignment' },
        { id: 3, type: 'task', title: "Today's Pending Tasks", count: 0, priority: 'high', icon: 'warning' },
        { id: 4, type: 'message', title: 'New Messages & Chats', count: 0, priority: 'low', icon: 'email' },
      ];
    }
  },

  // Get user profile data
  getUserProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Get metrics and KPIs
  getMetrics: async (userId, role) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/metrics/${userId}?role=${role}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Return default metrics if API fails
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingApprovals: 0,
        budgetUtilization: 0,
        teamMembers: 0
      };
    }
  },

  // Get statistics
  getStatistics: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/statistics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Return default statistics if API fails
      return {
        projects: { totalProjects: 0, activeProjects: 0, completedProjects: 0, pendingProjects: 0 },
        users: { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
        lastUpdated: new Date().toISOString()
      };
    }
  },

  // Get recent activity
  getRecentActivity: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/activity/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Return default activity if API fails
      return [
        { id: 1, action: 'No recent activity', time: new Date().toISOString(), type: 'system' }
      ];
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.put(`/api/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get role-specific dashboard data
  getRoleBasedData: async (userId, role) => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/role-based/${userId}?role=${role}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role-based data:', error);
      throw error;
    }
  },

  // Get project statistics
  getProjectStats: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  },

  // Get budget utilization
  getBudgetUtilization: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/budget/utilization/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget utilization:', error);
      throw error;
    }
  },

  // Get team performance metrics
  getTeamMetrics: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/team/metrics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team metrics:', error);
      throw error;
    }
  },

  // Export dashboard data
  exportDashboardData: async (userId, format = 'pdf') => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/export/${userId}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      throw error;
    }
  }
};

export default dashboardService;