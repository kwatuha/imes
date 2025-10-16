import axios from 'axios';

// Use relative path in production so nginx proxy handles it
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/public`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Statistics
export const getOverviewStats = async (finYearId = null, filters = {}) => {
  const params = finYearId ? { finYearId } : {};
  
  // Add filter parameters
  if (filters.department) params.departmentId = filters.department;
  if (filters.subcounty) params.subcountyId = filters.subcounty;
  if (filters.ward) params.wardId = filters.ward;
  if (filters.projectSearch) params.search = filters.projectSearch;
  
  const response = await publicApi.get('/stats/overview', { params });
  return response.data;
};

export const getDepartmentStats = async (finYearId = null, filters = {}) => {
  const params = finYearId ? { finYearId } : {};
  
  // Add filter parameters
  if (filters.department) params.departmentId = filters.department;
  if (filters.subcounty) params.subcountyId = filters.subcounty;
  if (filters.ward) params.wardId = filters.ward;
  if (filters.projectSearch) params.search = filters.projectSearch;
  
  const response = await publicApi.get('/stats/by-department', { params });
  return response.data;
};

export const getSubCountyStats = async (finYearId = null, filters = {}) => {
  const params = finYearId ? { finYearId } : {};
  
  // Add filter parameters
  if (filters.department) params.departmentId = filters.department;
  if (filters.subcounty) params.subcountyId = filters.subcounty;
  if (filters.ward) params.wardId = filters.ward;
  if (filters.projectSearch) params.search = filters.projectSearch;
  
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

export const getProjectsByDepartment = async (departmentId, finYearId = null) => {
  const params = { departmentId };
  if (finYearId) params.finYearId = finYearId;
  const response = await publicApi.get('/projects', { params });
  return response.data.projects || [];
};

export const getProjectsBySubCounty = async (subCountyId, finYearId = null) => {
  const params = { subCountyId };
  if (finYearId) params.finYearId = finYearId;
  const response = await publicApi.get('/projects', { params });
  return response.data.projects || [];
};

export const getProjectsByWard = async (wardId, finYearId = null) => {
  const params = { wardId };
  if (finYearId) params.finYearId = finYearId;
  const response = await publicApi.get('/projects', { params });
  return response.data.projects || [];
};

export const getProjectsByFinancialYear = async (finYearId) => {
  const params = { finYearId };
  const response = await publicApi.get('/projects', { params });
  return response.data.projects || [];
};

export const getWardStats = async (finYearId = null, filters = {}) => {
  const params = finYearId ? { finYearId } : {};
  
  // Add filter parameters
  if (filters.department) params.departmentId = filters.department;
  if (filters.subcounty) params.subcountyId = filters.subcounty;
  if (filters.ward) params.wardId = filters.ward;
  if (filters.projectSearch) params.search = filters.projectSearch;
  
  const response = await publicApi.get('/stats/by-ward', { params });
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

export const getFeedbackStats = async () => {
  const response = await publicApi.get('/feedback/stats');
  return response.data;
};

export default publicApi;

