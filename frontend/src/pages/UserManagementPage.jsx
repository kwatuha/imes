import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, CircularProgress, IconButton,
  Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, Stack, useTheme,
  OutlinedInput, Chip, ListSubheader, Checkbox, ListItemText, Avatar,
  DialogContentText,
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon, Settings as SettingsIcon, Lock as LockIcon, Dashboard as DashboardIcon, LockReset as LockResetIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import apiService from '../api/userService';
import { useAuth } from '../context/AuthContext.jsx';
import { tokens } from "./dashboard/theme";


// --- Utility function for case conversion (Copied from ProjectDetailsPage for consistency) ---
const snakeToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamelCase(v));
  }
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[camelKey] = snakeToCamelCase(obj[key]);
    }
  }
  return newObj;
};


function UserManagementPage() {
  const { user, logout, hasPrivilege } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // User Management States
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '',
  });
  const [userFormErrors, setUserFormErrors] = useState({});

  // Delete Confirmation Dialog States
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [userToDeleteName, setUserToDeleteName] = useState('');

  // Reset Password Confirmation Dialog States
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [userToResetId, setUserToResetId] = useState(null);
  const [userToResetName, setUserToResetName] = useState('');

  // Toggle User Status Confirmation Dialog States
  const [openToggleStatusDialog, setOpenToggleStatusDialog] = useState(false);
  const [userToToggleId, setUserToToggleId] = useState(null);
  const [userToToggleName, setUserToToggleName] = useState('');
  const [userToToggleCurrentStatus, setUserToToggleCurrentStatus] = useState(true);

  // Role Management States
  const [openRoleManagementDialog, setOpenRoleManagementDialog] = useState(false);
  const [roles, setRoles] = useState([]);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [currentRoleToEdit, setCurrentRoleToEdit] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    description: '',
    privilegeIds: []
  });
  const [roleFormErrors, setRoleFormErrors] = useState({});
  const [initialRolePrivilegeIds, setInitialRolePrivilegeIds] = useState([]);

  // Privilege Management States
  const [openPrivilegeManagementDialog, setOpenPrivilegeManagementDialog] = useState(false);
  const [privileges, setPrivileges] = useState([]);
  const [openPrivilegeDialog, setOpenPrivilegeDialog] = useState(false);
  const [currentPrivilegeToEdit, setCurrentPrivilegeToEdit] = useState(null);
  const [privilegeFormData, setPrivilegeFormData] = useState({
    privilegeName: '',
    description: ''
  });
  const [privilegeFormErrors, setPrivilegeFormErrors] = useState({});

  // New state for grouped privileges for the multi-select dropdown
  const [groupedPrivileges, setGroupedPrivileges] = useState({});


  // --- Fetching Data ---

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasPrivilege('user.read_all')) {
        const data = await apiService.getUsers();
        const camelCaseData = data.map(u => snakeToCamelCase(u));
        setUsers(camelCaseData);
      } else {
        setError("You do not have permission to view user management.");
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        logout();
      }
      setError(err.response?.data?.message || err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [hasPrivilege, logout]);

  const fetchRoles = useCallback(async () => {
    try {
      if (hasPrivilege('role.read_all')) {
        const data = await apiService.getRoles();
        setRoles(data);
      } else {
        setRoles([]);
        console.warn("User does not have 'role.read_all' privilege.");
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setSnackbar({ open: true, message: `Failed to load roles: ${err.message}`, severity: 'error' });
    }
  }, [hasPrivilege]);

  const fetchPrivileges = useCallback(async () => {
    try {
      if (hasPrivilege('privilege.read_all')) {
        const data = await apiService.getPrivileges();

        const uniquePrivileges = Array.from(new Map(data.map(p => [p.privilegeId, p])).values());
        
        setPrivileges(uniquePrivileges);

        const grouped = uniquePrivileges.reduce((acc, privilege) => {
            const type = privilege.privilegeName.split('.')[0];
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(privilege);
            return acc;
        }, {});
        const sortedGrouped = Object.keys(grouped).sort().reduce((acc, key) => {
            acc[key] = grouped[key].sort((a, b) => a.privilegeName.localeCompare(b.privilegeName));
            return acc;
        }, {});
        setGroupedPrivileges(sortedGrouped);

      } else {
        setPrivileges([]);
        setGroupedPrivileges({});
        console.warn("User does not have 'privilege.read_all' privilege.");
      }
    } catch (err) {
      console.error('Error fetching privileges:', err);
      setSnackbar({ open: true, message: `Failed to load privileges: ${err.message}`, severity: 'error' });
    }
  }, [hasPrivilege]);


  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPrivileges();
  }, [fetchUsers, fetchRoles, fetchPrivileges]);


  // --- User Management Handlers ---
  const handleOpenCreateUserDialog = () => {
    if (!hasPrivilege('user.create')) {
        setSnackbar({ open: true, message: 'Permission denied to create users.', severity: 'error' });
        return;
    }
    setCurrentUserToEdit(null);
    setUserFormData({
      username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '',
      role: roles.length > 0 ? roles[0].roleName : '',
    });
    setUserFormErrors({});
    setOpenUserDialog(true);
  };

  const handleOpenEditUserDialog = (userItem) => {
    if (!hasPrivilege('user.update')) {
        setSnackbar({ open: true, message: 'Permission denied to edit users.', severity: 'error' });
        return;
    }
    setCurrentUserToEdit(userItem);
    setUserFormData({
      username: userItem.username || '',
      email: userItem.email || '',
      password: '',
      confirmPassword: '',
      firstName: userItem.firstName || '',
      lastName: userItem.lastName || '',
      role: userItem.role || '',
    });
    setUserFormErrors({});
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUserToEdit(null);
    setUserFormErrors({});
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateUserForm = () => {
    let errors = {};
    if (!userFormData.username.trim()) errors.username = 'Username is required.';
    if (!userFormData.email.trim()) errors.email = 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(userFormData.email)) errors.email = 'Email is invalid.';

    if (!currentUserToEdit) {
        // For new users, password is required
        if (!userFormData.password.trim()) errors.password = 'Password is required for new users.';
        else if (userFormData.password.trim().length < 6) errors.password = 'Password must be at least 6 characters.';

        if (!userFormData.confirmPassword.trim()) errors.confirmPassword = 'Please confirm your password.';
        else if (userFormData.password !== userFormData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

        if (!userFormData.firstName.trim()) errors.firstName = 'First Name is required.';
        if (!userFormData.lastName.trim()) errors.lastName = 'Last Name is required.';
    } else {
        // For existing users, only validate password if it's being changed
        if (userFormData.password.trim()) {
            if (userFormData.password.trim().length < 6) errors.password = 'Password must be at least 6 characters.';
            if (!userFormData.confirmPassword.trim()) errors.confirmPassword = 'Please confirm your password.';
            else if (userFormData.password !== userFormData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
        }
    }

    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserSubmit = async () => {
    if (!validateUserForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Convert role name to roleId for backend
      const selectedRole = roles.find(role => role.roleName === userFormData.role);
      const dataToSend = {
        ...userFormData,
        roleId: selectedRole ? selectedRole.roleId : null
      };
      
      // Remove fields that backend doesn't expect
      delete dataToSend.role;
      delete dataToSend.confirmPassword;

      if (currentUserToEdit) {
        if (!hasPrivilege('user.update')) {
            setSnackbar({ open: true, message: 'Permission denied to update user.', severity: 'error' });
            setLoading(false);
            return;
        }
        await apiService.updateUser(currentUserToEdit.userId, dataToSend);
        setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
      } else {
        if (!hasPrivilege('user.create')) {
            setSnackbar({ open: true, message: 'Permission denied to create user.', severity: 'error' });
            setLoading(false);
            return;
        }
        console.log('Creating user with data:', dataToSend); // Debug log
        await apiService.createUser(dataToSend);
        setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
      }
      handleCloseUserDialog();
      fetchUsers();
    } catch (err) {
      console.error("Submit user error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to save user.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteConfirmDialog = (userId, username) => {
    if (!hasPrivilege('user.delete')) {
        setSnackbar({ open: true, message: 'Permission denied to delete users.', severity: 'error' });
        return;
    }
    setUserToDeleteId(userId);
    setUserToDeleteName(username);
    setOpenDeleteConfirmDialog(true);
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
    setUserToDeleteId(null);
    setUserToDeleteName('');
  };

  const handleConfirmDeleteUser = async () => {
    setLoading(true);
    handleCloseDeleteConfirmDialog();
    try {
      if (!hasPrivilege('user.delete')) {
          setSnackbar({ open: true, message: 'Permission denied to delete user.', severity: 'error' });
          setLoading(false);
          return;
      }
      await apiService.deleteUser(userToDeleteId);
      setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to delete user.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Reset Password Handler
  const handleOpenResetPasswordDialog = (userId, username) => {
    if (!hasPrivilege('user.update')) {
      setSnackbar({ open: true, message: 'Permission denied to reset passwords.', severity: 'error' });
      return;
    }
    setUserToResetId(userId);
    setUserToResetName(username);
    setOpenResetPasswordDialog(true);
  };

  const handleCloseResetPasswordDialog = () => {
    setOpenResetPasswordDialog(false);
    setUserToResetId(null);
    setUserToResetName('');
  };

  const handleConfirmResetPassword = async () => {
    setLoading(true);
    try {
      // Update user with new password
      await apiService.updateUser(userToResetId, { password: 'reset123' });
      setSnackbar({ 
        open: true, 
        message: `Password reset successfully for ${userToResetName}. New password: reset123`, 
        severity: 'success' 
      });
      handleCloseResetPasswordDialog();
    } catch (err) {
      console.error("Reset password error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to reset password.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Disable/Enable User Handler
  const handleToggleUserStatus = (userId, username, currentStatus) => {
    if (!hasPrivilege('user.update')) {
      setSnackbar({ open: true, message: 'Permission denied to change user status.', severity: 'error' });
      return;
    }

    setUserToToggleId(userId);
    setUserToToggleName(username);
    setUserToToggleCurrentStatus(currentStatus);
    setOpenToggleStatusDialog(true);
  };

  const handleCloseToggleStatusDialog = () => {
    setOpenToggleStatusDialog(false);
    setUserToToggleId(null);
    setUserToToggleName('');
    setUserToToggleCurrentStatus(true);
  };

  const handleConfirmToggleUserStatus = async () => {
    const action = userToToggleCurrentStatus ? 'disable' : 'enable';
    const newStatus = !userToToggleCurrentStatus;

    setLoading(true);
    try {
      await apiService.updateUser(userToToggleId, { isActive: newStatus });
      setSnackbar({ 
        open: true, 
        message: `User ${userToToggleName} ${action}d successfully!`, 
        severity: 'success' 
      });
      fetchUsers(); // Refresh the user list
      handleCloseToggleStatusDialog();
    } catch (err) {
      console.error(`${action} user error:`, err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || `Failed to ${action} user.`, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Role Management Handlers ---
  const handleOpenRoleManagementDialog = () => {
    if (!hasPrivilege('role.read_all')) {
      setSnackbar({ open: true, message: 'Permission denied to view roles.', severity: 'error' });
      return;
    }
    fetchRoles();
    setOpenRoleManagementDialog(true);
  };

  const handleCloseRoleManagementDialog = () => {
    setOpenRoleManagementDialog(false);
  };

  const handleOpenCreateRoleDialog = () => {
    if (!hasPrivilege('role.create')) {
      setSnackbar({ open: true, message: 'Permission denied to create roles.', severity: 'error' });
      return;
    }
    setCurrentRoleToEdit(null);
    setRoleFormData({ roleName: '', description: '', privilegeIds: [] });
    setRoleFormErrors({});
    setOpenRoleDialog(true);
  };

  const handleOpenEditRoleDialog = async (role) => {
    if (!hasPrivilege('role.update')) {
      setSnackbar({ open: true, message: 'Permission denied to edit roles.', severity: 'error' });
      return;
    }
    setCurrentRoleToEdit(role);
    setRoleFormData({
      roleName: role.roleName || '',
      description: role.description || '',
      privilegeIds: []
    });
    setRoleFormErrors({});

    try {
      const rolePrivileges = await apiService.getRolePrivileges(role.roleId);
      const currentPrivilegeIds = rolePrivileges.map(rp => String(rp.privilegeId));
      setRoleFormData(prev => ({ ...prev, privilegeIds: currentPrivilegeIds }));
      setInitialRolePrivilegeIds(currentPrivilegeIds);
    } catch (err) {
      console.error('Error fetching role privileges for edit:', err);
      setSnackbar({ open: true, message: 'Failed to load role privileges.', severity: 'error' });
    }
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setCurrentRoleToEdit(null);
    setRoleFormErrors({});
    setInitialRolePrivilegeIds([]);
  };

  const handleRoleFormChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRolePrivilegeMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
  };

  const validateRoleForm = () => {
    let errors = {};
    if (!roleFormData.roleName.trim()) errors.roleName = 'Role Name is required.';
    setRoleFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const synchronizeAssociations = async (parentId, currentIds, newIds, addFn, removeFn, type = 'item') => {
    const idsToAdd = newIds.filter(id => !currentIds.includes(id));
    const idsToRemove = currentIds.filter(id => !newIds.includes(id));

    const results = await Promise.allSettled([
        ...idsToAdd.map(async (id) => {
            try {
                await addFn(parentId, id);
                return { status: 'fulfilled', value: `Added ${type} ID ${id}` };
            } catch (error) {
                console.error(`Failed to add ${type} ID ${id}:`, error);
                return { status: 'rejected', reason: `Failed to add ${type} ID ${id}: ${error.message}` };
            }
        }),
        ...idsToRemove.map(async (id) => {
            try {
                await removeFn(parentId, id);
                return { status: 'fulfilled', value: `Removed ${type} ID ${id}` };
            } catch (error) {
                console.error(`Failed to remove ${type} ID ${id}:`, error);
                return { status: 'rejected', reason: `Failed to remove ${type} ID ${id}: ${error.message}` };
            }
        })
    ]);

    const failedOperations = results.filter(result => result.status === 'rejected');
    if (failedOperations.length > 0) {
        const messages = failedOperations.map(f => f.reason).join('; ');
        throw new Error(`Some ${type} associations failed: ${messages}`);
    }
  };

  const handleRoleSubmit = async () => {
    if (!validateRoleForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    let roleId = currentRoleToEdit ? currentRoleToEdit.roleId : null;
    const roleDataToSubmit = { ...roleFormData };
    const privilegeIdsToAssign = roleDataToSubmit.privilegeIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    delete roleDataToSubmit.privilegeIds;

    try {
      if (currentRoleToEdit) {
        if (!hasPrivilege('role.update')) {
          setSnackbar({ open: true, message: 'Permission denied to update role.', severity: 'error' });
          setLoading(false);
          return;
        }
        await apiService.updateRole(roleId, roleDataToSubmit);
        setSnackbar({ open: true, message: 'Role updated successfully!', severity: 'success' });
      } else {
        if (!hasPrivilege('role.create')) {
          setSnackbar({ open: true, message: 'Permission denied to create role.', severity: 'error' });
          setLoading(false);
          return;
        }
        const createdRole = await apiService.createRole(roleDataToSubmit);
        roleId = createdRole.roleId;
        setSnackbar({ open: true, message: 'Role created successfully!', severity: 'success' });
      }

      if (roleId) {
        await synchronizeAssociations(
          roleId,
          initialRolePrivilegeIds.map(id => parseInt(id, 10)),
          privilegeIdsToAssign,
          apiService.createRolePrivilege,
          apiService.deleteRolePrivilege,
          'privilege'
        );
      }

      handleCloseRoleDialog();
      fetchRoles();
      fetchUsers();
    } catch (err) {
      console.error("Submit role error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to save role.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!hasPrivilege('role.delete')) {
      setSnackbar({ open: true, message: 'Permission denied to delete roles.', severity: 'error' });
      return;
    }
    if (window.confirm(`Are you sure you want to delete role "${roleName}"? This will also remove its associated privileges.`)) {
      setLoading(true);
      try {
        await apiService.deleteRole(roleId);
        setSnackbar({ open: true, message: 'Role deleted successfully!', severity: 'success' });
        fetchRoles();
        fetchUsers();
      } catch (err) {
        console.error("Delete role error:", err);
        setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to delete role.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };


  // --- Privilege Management Handlers ---
  const handleOpenPrivilegeManagementDialog = () => {
    if (!hasPrivilege('privilege.read_all')) {
      setSnackbar({ open: true, message: 'Permission denied to view privileges.', severity: 'error' });
      return;
    }
    fetchPrivileges();
    setOpenPrivilegeManagementDialog(true);
  };

  const handleClosePrivilegeManagementDialog = () => {
    setOpenPrivilegeManagementDialog(false);
  };

  const handleOpenCreatePrivilegeDialog = () => {
    if (!hasPrivilege('privilege.create')) {
      setSnackbar({ open: true, message: 'Permission denied to create privileges.', severity: 'error' });
      return;
    }
    setCurrentPrivilegeToEdit(null);
    setPrivilegeFormData({ privilegeName: '', description: '' });
    setPrivilegeFormErrors({});
    setOpenPrivilegeDialog(true);
  };

  const handleOpenEditPrivilegeDialog = (privilege) => {
    if (!hasPrivilege('privilege.update')) {
      setSnackbar({ open: true, message: 'Permission denied to edit privileges.', severity: 'error' });
      return;
    }
    setCurrentPrivilegeToEdit(privilege);
    setPrivilegeFormData({
      privilegeName: privilege.privilegeName || '',
      description: privilege.description || ''
    });
    setPrivilegeFormErrors({});
    setOpenPrivilegeDialog(true);
  };

  const handleClosePrivilegeDialog = () => {
    setOpenPrivilegeDialog(false);
    setCurrentPrivilegeToEdit(null);
    setPrivilegeFormErrors({});
  };

  const handlePrivilegeFormChange = (e) => {
    const { name, value } = e.target;
    setPrivilegeFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePrivilegeForm = () => {
    let errors = {};
    if (!privilegeFormData.privilegeName.trim()) errors.privilegeName = 'Privilege Name is required.';
    setPrivilegeFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePrivilegeSubmit = async () => {
    if (!validatePrivilegeForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (currentPrivilegeToEdit) {
        if (!hasPrivilege('privilege.update')) {
          setSnackbar({ open: true, message: 'Permission denied to update privilege.', severity: 'error' });
          setLoading(false);
          return;
        }
        const { privilegeId, ...updatedFields } = privilegeFormData;
        await apiService.updatePrivilege(currentPrivilegeToEdit.privilegeId, updatedFields);
        setSnackbar({ open: true, message: 'Privilege updated successfully!', severity: 'success' });
      } else {
        if (!hasPrivilege('privilege.create')) {
          setSnackbar({ open: true, message: 'Permission denied to create privilege.', severity: 'error' });
          setLoading(false);
          return;
        }
        const newPrivilegeData = {
          privilegeName: privilegeFormData.privilegeName,
          description: privilegeFormData.description
        };
        await apiService.createPrivilege(newPrivilegeData);
        setSnackbar({ open: true, message: 'Privilege created successfully!', severity: 'success' });
      }
      handleClosePrivilegeDialog();
      fetchPrivileges();
      fetchRoles();
    } catch (err) {
      console.error("Submit privilege error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to save privilege.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrivilege = async (privilegeId, privilegeName) => {
    if (!hasPrivilege('privilege.delete')) {
      setSnackbar({ open: true, message: 'Permission denied to delete privileges.', severity: 'error' });
      return;
    }
    if (window.confirm(`Are you sure you want to delete privilege "${privilegeName}"? This will also remove it from any roles.`)) {
      setLoading(true);
      try {
        await apiService.deletePrivilege(privilegeId);
        setSnackbar({ open: true, message: 'Privilege deleted successfully!', severity: 'success' });
        fetchPrivileges();
        fetchRoles();
      } catch (err) {
        console.error("Delete privilege error:", err);
        setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to delete privilege.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const userColumns = [
    { field: "userId", headerName: "ID" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "username-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => {
        const { isActive, userId, username } = row;
        return (
          <Box
            width="70%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={
              isActive
                ? colors.greenAccent[600]
                : colors.redAccent[600]
            }
            borderRadius="4px"
            sx={{
              cursor: hasPrivilege('user.update') && userId !== user.id ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              '&:hover': hasPrivilege('user.update') && userId !== user.id ? {
                transform: 'scale(1.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                backgroundColor: isActive ? colors.redAccent[500] : colors.greenAccent[500]
              } : {}
            }}
            onClick={() => {
              if (hasPrivilege('user.update') && userId !== user.id) {
                handleToggleUserStatus(userId, username, isActive);
              }
            }}
            title={
              hasPrivilege('user.update') && userId !== user.id 
                ? `Click to ${isActive ? 'disable' : 'enable'} user`
                : isActive ? 'Active' : 'Disabled'
            }
          >
            {isActive ? (
              <CheckCircleIcon sx={{ color: colors.grey[100], mr: 1, fontSize: '16px' }} />
            ) : (
              <BlockIcon sx={{ color: colors.grey[100], mr: 1, fontSize: '16px' }} />
            )}
            <Typography color={colors.grey[100]} sx={{ fontSize: '0.875rem' }}>
              {isActive ? 'Active' : 'Disabled'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {hasPrivilege('user.update') && (
            <IconButton sx={{ color: colors.grey[100] }} onClick={() => handleOpenEditUserDialog(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          {hasPrivilege('user.update') && params.row.userId !== user.id && (
            <IconButton 
              sx={{ color: colors.blueAccent[500] }} 
              onClick={() => handleOpenResetPasswordDialog(params.row.userId, params.row.username)}
              title="Reset Password to reset123"
            >
              <LockResetIcon />
            </IconButton>
          )}
          {hasPrivilege('user.delete') && params.row.userId !== user.id && (
            <IconButton sx={{ color: colors.redAccent[500] }} onClick={() => handleOpenDeleteConfirmDialog(params.row.userId, params.row.username)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

  const roleColumns = [
    { field: "roleId", headerName: "ID", width: 90 },
    { field: "roleName", headerName: "Role Name", flex: 1, cellClassName: "username-column--cell" },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {hasPrivilege('role.update') && (
            <IconButton sx={{ color: colors.grey[100] }} onClick={() => handleOpenEditRoleDialog(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          {hasPrivilege('role.delete') && (
            <IconButton sx={{ color: colors.redAccent[500] }} onClick={() => handleDeleteRole(params.row.roleId, params.row.roleName)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

  const privilegeColumns = [
    { field: "privilegeId", headerName: "ID", width: 90 },
    { field: "privilegeName", headerName: "Privilege Name", flex: 1, cellClassName: "username-column--cell" },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {hasPrivilege('privilege.update') && (
            <IconButton sx={{ color: colors.grey[100] }} onClick={() => handleOpenEditPrivilegeDialog(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          {hasPrivilege('privilege.delete') && (
            <IconButton sx={{ color: colors.redAccent[500] }} onClick={() => handleDeletePrivilege(params.row.privilegeId, params.row.privilegeName)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

  if (loading && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading data...</Typography>
      </Box>
    );
  }

  if (error && !hasPrivilege('user.read_all')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "You do not have sufficient privileges to view this page."}</Alert>
        <Alert severity="warning" sx={{ mt: 2 }}>
            You need 'user.read_all' privilege to access this page.
        </Alert>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Stack direction="row" spacing={2}>
          {hasPrivilege('user.create') && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenCreateUserDialog}
              sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] }, color: 'white', fontWeight: 'semibold', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Add New User
            </Button>
          )}
          {hasPrivilege('role.read_all') && (
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={handleOpenRoleManagementDialog}
              sx={{ borderColor: colors.blueAccent[500], color: colors.blueAccent[500], '&:hover': { backgroundColor: colors.blueAccent[700], color: 'white' }, fontWeight: 'semibold', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Manage Roles
            </Button>
          )}
          {hasPrivilege('privilege.read_all') && (
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={handleOpenPrivilegeManagementDialog}
              sx={{ borderColor: colors.blueAccent[500], color: colors.blueAccent[500], '&:hover': { backgroundColor: colors.blueAccent[700], color: 'white' }, fontWeight: 'semibold', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Manage Privileges
            </Button>
          )}
          {hasPrivilege('user.read_all') && (
            <Button
              variant="outlined"
              startIcon={<DashboardIcon />}
              onClick={() => window.open('/impes/dashboard-config', '_blank')}
              sx={{ borderColor: colors.greenAccent[500], color: colors.greenAccent[500], '&:hover': { backgroundColor: colors.greenAccent[700], color: 'white' }, fontWeight: 'semibold', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Configure Dashboard
            </Button>
          )}
        </Stack>
      </Box>

      {users.length === 0 && hasPrivilege('user.read_all') ? (
        <Alert severity="info">No users found. Add a new user to get started.</Alert>
      ) : (
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .username-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.blueAccent[700]} !important`,
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: `${colors.blueAccent[700]} !important`,
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={users}
            columns={userColumns}
            getRowId={(row) => row.userId}
          />
        </Box>
      )}

      {/* Create/Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          {currentUserToEdit ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <TextField autoFocus margin="dense" name="username" label="Username" type="text" fullWidth variant="outlined" value={userFormData.username} onChange={handleUserFormChange} error={!!userFormErrors.username} helperText={userFormErrors.username} disabled={!!currentUserToEdit} sx={{ mb: 2 }} />
          <TextField margin="dense" name="email" label="Email" type="email" fullWidth variant="outlined" value={userFormData.email} onChange={handleUserFormChange} error={!!userFormErrors.email} helperText={userFormErrors.email} disabled={!!currentUserToEdit} sx={{ mb: 2 }} />
          <TextField margin="dense" name="firstName" label="First Name" type="text" fullWidth variant="outlined" value={userFormData.firstName} onChange={handleUserFormChange} error={!!userFormErrors.firstName} helperText={userFormErrors.firstName} disabled={!!currentUserToEdit} sx={{ mb: 2 }} />
          <TextField margin="dense" name="lastName" label="Last Name" type="text" fullWidth variant="outlined" value={userFormData.lastName} onChange={handleUserFormChange} error={!!userFormErrors.lastName} helperText={userFormErrors.lastName} disabled={!!currentUserToEdit} sx={{ mb: 2 }} />
          {!currentUserToEdit ? (
            <>
              <TextField margin="dense" name="password" label="Password" type="password" fullWidth variant="outlined" value={userFormData.password} onChange={handleUserFormChange} error={!!userFormErrors.password} helperText={userFormErrors.password} sx={{ mb: 2 }} />
              <TextField margin="dense" name="confirmPassword" label="Confirm Password" type="password" fullWidth variant="outlined" value={userFormData.confirmPassword} onChange={handleUserFormChange} error={!!userFormErrors.confirmPassword} helperText={userFormErrors.confirmPassword} sx={{ mb: 2 }} />
            </>
          ) : (
            <>
              <TextField margin="dense" name="password" label="New Password (leave blank to keep current)" type="password" fullWidth variant="outlined" value={userFormData.password} onChange={handleUserFormChange} error={!!userFormErrors.password} helperText={userFormErrors.password} sx={{ mb: 2 }} />
              {userFormData.password && (
                <TextField margin="dense" name="confirmPassword" label="Confirm New Password" type="password" fullWidth variant="outlined" value={userFormData.confirmPassword} onChange={handleUserFormChange} error={!!userFormErrors.confirmPassword} helperText={userFormErrors.confirmPassword} sx={{ mb: 2 }} />
              )}
            </>
          )}
          <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2, minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              label="Role"
              value={userFormData.role}
              onChange={handleUserFormChange}
            >
              {roles.map(role => (
                <MenuItem key={role.roleId} value={role.roleName}>{role.roleName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: colors.primary[400] }}>
          <Button onClick={handleCloseUserDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleUserSubmit} color="primary" variant="contained">{currentUserToEdit ? 'Update User' : 'Create User'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteConfirmDialog} 
        onClose={handleCloseDeleteConfirmDialog} 
        aria-labelledby="delete-dialog-title" 
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.grey[50],
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle 
          id="delete-dialog-title"
          sx={{ 
            backgroundColor: colors.redAccent[600],
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3
          }}
        >
          <Avatar sx={{ bgcolor: colors.redAccent[700] }}>
            <DeleteIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Confirm User Deletion
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This action cannot be undone
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <DialogContentText 
            id="delete-dialog-description"
            sx={{ 
              color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Are you sure you want to permanently delete the user{' '}
            <Box component="span" sx={{ fontWeight: 'bold', color: colors.redAccent[500] }}>
              "{userToDeleteName}"
            </Box>
            ?
          </DialogContentText>
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2,
              bgcolor: theme.palette.mode === 'dark' ? colors.redAccent[900] : colors.redAccent[50],
              color: theme.palette.mode === 'dark' ? colors.redAccent[100] : colors.redAccent[800],
              '& .MuiAlert-icon': {
                color: colors.redAccent[500]
              }
            }}
          >
            This will permanently remove all user data and cannot be reversed.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDeleteConfirmDialog} 
            variant="outlined"
            sx={{ 
              borderColor: colors.grey[500],
              color: colors.grey[100],
              '&:hover': {
                borderColor: colors.grey[400],
                backgroundColor: colors.grey[700]
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDeleteUser} 
            variant="contained"
            sx={{
              backgroundColor: colors.redAccent[600],
              '&:hover': {
                backgroundColor: colors.redAccent[700]
              },
              fontWeight: 'bold'
            }}
            startIcon={<DeleteIcon />}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog 
        open={openResetPasswordDialog} 
        onClose={handleCloseResetPasswordDialog} 
        aria-labelledby="reset-dialog-title" 
        aria-describedby="reset-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.grey[50],
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle 
          id="reset-dialog-title"
          sx={{ 
            backgroundColor: colors.blueAccent[600],
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3
          }}
        >
          <Avatar sx={{ bgcolor: colors.blueAccent[700] }}>
            <LockResetIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Reset User Password
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Security action required
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <DialogContentText 
            id="reset-dialog-description"
            sx={{ 
              color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Are you sure you want to reset the password for user{' '}
            <Box component="span" sx={{ fontWeight: 'bold', color: colors.blueAccent[500] }}>
              "{userToResetName}"
            </Box>
            ?
          </DialogContentText>
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2,
              bgcolor: theme.palette.mode === 'dark' ? colors.blueAccent[900] : colors.blueAccent[50],
              color: theme.palette.mode === 'dark' ? colors.blueAccent[100] : colors.blueAccent[800],
              '& .MuiAlert-icon': {
                color: colors.blueAccent[500]
              }
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              New Password: reset123
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The user will need to change this password on their next login.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseResetPasswordDialog} 
            variant="outlined"
            sx={{ 
              borderColor: colors.grey[500],
              color: colors.grey[100],
              '&:hover': {
                borderColor: colors.grey[400],
                backgroundColor: colors.grey[700]
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmResetPassword} 
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[600],
              '&:hover': {
                backgroundColor: colors.blueAccent[700]
              },
              fontWeight: 'bold'
            }}
            startIcon={<LockResetIcon />}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toggle User Status Confirmation Dialog */}
      <Dialog 
        open={openToggleStatusDialog} 
        onClose={handleCloseToggleStatusDialog} 
        aria-labelledby="toggle-status-dialog-title" 
        aria-describedby="toggle-status-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.grey[50],
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle 
          id="toggle-status-dialog-title"
          sx={{ 
            backgroundColor: userToToggleCurrentStatus ? colors.redAccent[600] : colors.greenAccent[600],
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3
          }}
        >
          <Avatar sx={{ bgcolor: userToToggleCurrentStatus ? colors.redAccent[700] : colors.greenAccent[700] }}>
            {userToToggleCurrentStatus ? <BlockIcon /> : <CheckCircleIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {userToToggleCurrentStatus ? 'Disable User Account' : 'Enable User Account'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {userToToggleCurrentStatus ? 'Restrict user access' : 'Restore user access'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <DialogContentText 
            id="toggle-status-dialog-description"
            sx={{ 
              color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Are you sure you want to {userToToggleCurrentStatus ? 'disable' : 'enable'} the user{' '}
            <Box component="span" sx={{ fontWeight: 'bold', color: userToToggleCurrentStatus ? colors.redAccent[500] : colors.greenAccent[500] }}>
              "{userToToggleName}"
            </Box>
            ?
          </DialogContentText>
          
          {userToToggleCurrentStatus ? (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2,
                bgcolor: theme.palette.mode === 'dark' ? colors.redAccent[900] : colors.redAccent[50],
                color: theme.palette.mode === 'dark' ? colors.redAccent[100] : colors.redAccent[800],
                '& .MuiAlert-icon': {
                  color: colors.redAccent[500]
                }
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                This will prevent the user from logging in
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • User will be immediately logged out from all sessions<br/>
                • User cannot access the system until re-enabled<br/>
                • User data and permissions are preserved
              </Typography>
            </Alert>
          ) : (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2,
                bgcolor: theme.palette.mode === 'dark' ? colors.greenAccent[900] : colors.greenAccent[50],
                color: theme.palette.mode === 'dark' ? colors.greenAccent[100] : colors.greenAccent[800],
                '& .MuiAlert-icon': {
                  color: colors.greenAccent[500]
                }
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                This will restore user access to the system
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • User can log in immediately<br/>
                • All previous permissions and data are restored<br/>
                • User will have full access to assigned features
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseToggleStatusDialog} 
            variant="outlined"
            sx={{ 
              borderColor: colors.grey[500],
              color: colors.grey[100],
              '&:hover': {
                borderColor: colors.grey[400],
                backgroundColor: colors.grey[700]
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmToggleUserStatus} 
            variant="contained"
            sx={{
              backgroundColor: userToToggleCurrentStatus ? colors.redAccent[600] : colors.greenAccent[600],
              '&:hover': {
                backgroundColor: userToToggleCurrentStatus ? colors.redAccent[700] : colors.greenAccent[700]
              },
              fontWeight: 'bold'
            }}
            startIcon={userToToggleCurrentStatus ? <BlockIcon /> : <CheckCircleIcon />}
          >
            {userToToggleCurrentStatus ? 'Disable User' : 'Enable User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={openRoleManagementDialog} onClose={handleCloseRoleManagementDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          Role Management
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          {hasPrivilege('role.create') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateRoleDialog} sx={{ mb: 2, backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] }, color: 'white' }}>
              Add New Role
            </Button>
          )}
          {roles.length === 0 ? (
            <Alert severity="info">No roles found. Add a new role to get started.</Alert>
          ) : (
            <Box
              height="400px"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .username-column--cell": {
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: `${colors.blueAccent[700]} !important`,
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: `${colors.blueAccent[700]} !important`,
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid
                rows={roles}
                columns={roleColumns}
                getRowId={(row) => row.roleId}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: colors.primary[400] }}>
          <Button onClick={handleCloseRoleManagementDialog} color="primary" variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Create/Edit Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          {currentRoleToEdit ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <TextField autoFocus margin="dense" name="roleName" label="Role Name" type="text" fullWidth variant="outlined" value={roleFormData.roleName} onChange={handleRoleFormChange} error={!!roleFormErrors.roleName} helperText={roleFormErrors.roleName} disabled={!!currentRoleToEdit} sx={{ mb: 2 }} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth variant="outlined" value={roleFormData.description} onChange={handleRoleFormChange} sx={{ mb: 2 }} />
          <FormControl fullWidth margin="dense" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="privileges-label">Privileges</InputLabel>
            <Select
              labelId="privileges-label"
              id="privileges-select"
              name="privilegeIds"
              multiple
              value={roleFormData.privilegeIds}
              onChange={handleRolePrivilegeMultiSelectChange}
              input={<OutlinedInput id="select-multiple-chip" label="Privileges" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const privilege = privileges.find(p => String(p.privilegeId) === value);
                    return <Chip key={value} label={privilege ? privilege.privilegeName : value} />;
                  })}
                </Box>
              )}
            >
              {Object.keys(groupedPrivileges).map((groupName) => [
                <ListSubheader key={groupName}>{groupName}</ListSubheader>,
                groupedPrivileges[groupName].map((privilege) => (
                  <MenuItem key={privilege.privilegeId} value={String(privilege.privilegeId)}>
                    <Checkbox checked={roleFormData.privilegeIds.indexOf(String(privilege.privilegeId)) > -1} />
                    <ListItemText primary={privilege.privilegeName} />
                  </MenuItem>
                ))
              ])}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: colors.primary[400] }}>
          <Button onClick={handleCloseRoleDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleRoleSubmit} color="primary" variant="contained">{currentRoleToEdit ? 'Update Role' : 'Create Role'}</Button>
        </DialogActions>
      </Dialog>

      {/* Privilege Management Dialog */}
      <Dialog open={openPrivilegeManagementDialog} onClose={handleClosePrivilegeManagementDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          Privilege Management
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          {hasPrivilege('privilege.create') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreatePrivilegeDialog} sx={{ mb: 2, backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] }, color: 'white' }}>
              Add New Privilege
            </Button>
          )}
          {privileges.length === 0 ? (
            <Alert severity="info">No privileges found. Add a new privilege to get started.</Alert>
          ) : (
            <Box
              height="400px"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .username-column--cell": {
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: `${colors.blueAccent[700]} !important`,
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: `${colors.blueAccent[700]} !important`,
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid
                rows={privileges}
                columns={privilegeColumns}
                getRowId={(row) => row.privilegeId}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: colors.primary[400] }}>
          <Button onClick={handleClosePrivilegeManagementDialog} color="primary" variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Privilege Dialog */}
      <Dialog open={openPrivilegeDialog} onClose={handleClosePrivilegeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.blueAccent[700], color: 'white' }}>
          {currentPrivilegeToEdit ? 'Edit Privilege' : 'Add New Privilege'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.primary[400] }}>
          <TextField autoFocus margin="dense" name="privilegeName" label="Privilege Name" type="text" fullWidth variant="outlined" value={privilegeFormData.privilegeName} onChange={handlePrivilegeFormChange} error={!!privilegeFormErrors.privilegeName} helperText={privilegeFormErrors.privilegeName} disabled={!!currentPrivilegeToEdit} sx={{ mb: 2 }} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth variant="outlined" value={privilegeFormData.description} onChange={handlePrivilegeFormChange} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: colors.primary[400] }}>
          <Button onClick={handleClosePrivilegeDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handlePrivilegeSubmit} color="primary" variant="contained">{currentPrivilegeToEdit ? 'Update Privilege' : 'Create Privilege'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserManagementPage;