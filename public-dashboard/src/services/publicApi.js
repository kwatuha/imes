import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/public`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Statistics
export const getOverviewStats = async (finYearId = null) => {
  const params = finYearId ? { finYearId } : {};
  const response = await publicApi.get('/stats/overview', { params });
  return response.data;
};

export const getDepartmentStats = async (finYearId = null) => {
  const params = finYearId ? { finYearId } : {};
  const response = await publicApi.get('/stats/by-department', { params });
  return response.data;
};

export const getSubCountyStats = async (finYearId = null) => {
  const params = finYearId ? { finYearId } : {};
  const response = await publicApi.get('/stats/by-subcounty', { params });
  return response.data;
};

export const getProjectTypeStats = async (finYearId = null) => {
  const params = finYearId ? { finYearId } : {};
  const response = await publicApi.get('/stats/by-project-type', { params });
  return response.data;
};

// Financial Years
export const getFinancialYears = async () => {
  const response = await publicApi.get('/financial-years');
  return response.data;
};

// Projects
export const getProjects = async (filters = {}) => {
  const response = await publicApi.get('/projects', { params: filters });
  return response.data;
};

export const getProjectDetails = async (projectId) => {
  const response = await publicApi.get(`/projects/${projectId}`);
  return response.data;
};

// Metadata
export const getDepartments = async () => {
  const response = await publicApi.get('/metadata/departments');
  return response.data;
};

export const getSubCounties = async () => {
  const response = await publicApi.get('/metadata/subcounties');
  return response.data;
};

export const getProjectTypes = async () => {
  const response = await publicApi.get('/metadata/project-types');
  return response.data;
};

// Feedback
export const submitFeedback = async (feedbackData) => {
  const response = await publicApi.post('/feedback', feedbackData);
  return response.data;
};

export const getFeedbackList = async (filters = {}) => {
  const response = await publicApi.get('/feedback', { params: filters });
  return response.data;
};

export default publicApi;

