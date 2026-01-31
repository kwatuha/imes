import axiosInstance from './axiosInstance';

/**
 * Budget Service
 * Handles all API calls related to approved budgets
 */
class BudgetService {
  /**
   * Get all budgets with optional filters
   */
  async getBudgets(filters = {}) {
    try {
      const response = await axiosInstance.get('/budgets', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  /**
   * Get a single budget by ID
   */
  async getBudgetById(budgetId) {
    try {
      const response = await axiosInstance.get(`/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw error;
    }
  }

  /**
   * Create a new budget
   */
  async createBudget(budgetData) {
    try {
      const response = await axiosInstance.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Update an existing budget
   */
  async updateBudget(budgetId, budgetData) {
    try {
      const response = await axiosInstance.put(`/budgets/${budgetId}`, budgetData);
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Delete a budget (soft delete)
   */
  async deleteBudget(budgetId) {
    try {
      const response = await axiosInstance.delete(`/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Get budget summary statistics
   */
  async getBudgetStats(filters = {}) {
    try {
      const response = await axiosInstance.get('/budgets/stats/summary', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget stats:', error);
      throw error;
    }
  }
}

export default new BudgetService();






