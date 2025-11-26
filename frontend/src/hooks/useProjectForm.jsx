import { useState, useEffect, useCallback } from 'react';
import apiService from '../api';
import { DEFAULT_COUNTY } from '../configs/appConfig';

const useProjectForm = (currentProject, allMetadata, onFormSuccess, setSnackbar) => {
  const [formData, setFormData] = useState({
    projectName: '', projectDescription: '', startDate: '', endDate: '',
    directorate: '', costOfProject: '', paidOut: '',
    objective: '', expectedOutput: '', principalInvestigator: '', expectedOutcome: '',
    status: 'Not Started', statusReason: '', principalInvestigatorStaffId: '',
    departmentId: '', sectionId: '', finYearId: '', programId: '', subProgramId: '',
    categoryId: '', // ADDED: categoryId to the form state
    countyIds: [], subcountyIds: [], wardIds: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formSections, setFormSections] = useState([]);
  const [formSubPrograms, setFormSubPrograms] = useState([]);
  const [formSubcounties, setFormSubcounties] = useState([]);
  const [formWards, setFormWards] = useState([]);
  const [missingFinancialYear, setMissingFinancialYear] = useState(null); // For financial years not in metadata

  const [initialAssociations, setInitialAssociations] = useState({
    countyIds: [],
    subcountyIds: [],
    wardIds: [],
  });

  useEffect(() => {
    if (currentProject) {
      setLoading(true);
      const fetchAssociations = async () => {
        try {
          // Debug: Log the current project data to see what fields are available
          console.log('Current project data for form:', {
            id: currentProject.id,
            finYearId: currentProject.finYearId,
            financialYearName: currentProject.financialYearName,
            departmentId: currentProject.departmentId,
            programId: currentProject.programId,
            subProgramId: currentProject.subProgramId,
            categoryId: currentProject.categoryId,
          });
          
          // If finYearId is missing but financialYearName exists, try to find the matching finYearId
          let finYearId = currentProject.finYearId;
          if ((!finYearId || finYearId === null || finYearId === undefined) && currentProject.financialYearName && allMetadata?.financialYears) {
            const matchingFY = allMetadata.financialYears.find(fy => 
              fy.finYearName === currentProject.financialYearName
            );
            if (matchingFY) {
              finYearId = matchingFY.finYearId;
              console.log('Found matching financial year ID:', finYearId, 'for name:', currentProject.financialYearName);
            }
          }
          
          const [countiesRes, subcountiesRes, wardsRes] = await Promise.all([
            apiService.junctions.getProjectCounties(currentProject.id),
            apiService.junctions.getProjectSubcounties(currentProject.id),
            apiService.junctions.getProjectWards(currentProject.id),
          ]);
          const countyIds = countiesRes.map(c => String(c.countyId));
          const subcountyIds = subcountiesRes.map(sc => String(sc.subcountyId));
          const wardIds = wardsRes.map(w => String(w.wardId));

          // Check if the finYearId exists in the available financial years
          const finYearIdString = (finYearId !== null && finYearId !== undefined) ? String(finYearId) : '';
          const finYearExists = allMetadata?.financialYears?.some(fy => String(fy.finYearId) === finYearIdString);
          
          // If the financial year doesn't exist in the metadata but we have a finYearId, try to fetch it
          if (finYearIdString && !finYearExists) {
            console.warn(`Financial Year ID ${finYearIdString} (${currentProject.financialYearName || 'unknown'}) not found in available financial years. Attempting to fetch it.`);
            try {
              const missingFY = await apiService.metadata.financialYears.getFinancialYearById(parseInt(finYearIdString));
              if (missingFY) {
                // Store the missing financial year in local state so it appears in the dropdown
                setMissingFinancialYear(missingFY);
                console.log('Successfully fetched missing financial year:', missingFY);
              }
            } catch (err) {
              console.error('Error fetching missing financial year:', err);
              // If we can't fetch it, we'll still set the value but it won't show in dropdown
              // The user will need to select a different financial year
              setMissingFinancialYear(null);
            }
          } else {
            // Clear missing financial year if the current one exists in metadata
            setMissingFinancialYear(null);
          }

          const formDataToSet = {
            projectName: currentProject.projectName || '',
            projectDescription: currentProject.projectDescription || '',
            startDate: currentProject.startDate ? new Date(currentProject.startDate).toISOString().split('T')[0] : '',
            endDate: currentProject.endDate ? new Date(currentProject.endDate).toISOString().split('T')[0] : '',
            directorate: currentProject.directorate || '',
            costOfProject: currentProject.costOfProject || '',
            paidOut: currentProject.paidOut || '',
            objective: currentProject.objective || '',
            expectedOutput: currentProject.expectedOutput || '',
            principalInvestigator: currentProject.principalInvestigator || '',
            expectedOutcome: currentProject.expectedOutcome || '',
            status: currentProject.status || 'Not Started',
            statusReason: currentProject.statusReason || '',
            principalInvestigatorStaffId: currentProject.principalInvestigatorStaffId || '',
            departmentId: currentProject.departmentId ? String(currentProject.departmentId) : '',
            sectionId: currentProject.sectionId ? String(currentProject.sectionId) : '',
            finYearId: finYearIdString,
            programId: currentProject.programId ? String(currentProject.programId) : '',
            subProgramId: currentProject.subProgramId ? String(currentProject.subProgramId) : '',
            categoryId: currentProject.categoryId ? String(currentProject.categoryId) : '', // FIXED: Populating categoryId from the project object
            countyIds,
            subcountyIds,
            wardIds,
          };
          
          console.log('Setting formData with finYearId:', formDataToSet.finYearId, 'type:', typeof formDataToSet.finYearId);
          console.log('Available financial years:', allMetadata?.financialYears?.map(fy => ({ id: fy.finYearId, name: fy.finYearName })));
          console.log('FinYearId exists in metadata:', finYearExists);
          
          setFormData(formDataToSet);

          setInitialAssociations({ countyIds, subcountyIds, wardIds });

        } catch (err) {
          setSnackbar({ open: true, message: 'Failed to load project associations for editing.', severity: 'error' });
          console.error("Error fetching project associations:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAssociations();
    } else {
      // For new projects, default to the configured default county (Kisumu)
      let defaultCountyIds = [];
      if (allMetadata?.counties) {
        // First try to find by countyId if specified in DEFAULT_COUNTY
        if (DEFAULT_COUNTY.countyId) {
          const countyById = allMetadata.counties.find(c => c.countyId === DEFAULT_COUNTY.countyId);
          if (countyById) {
            defaultCountyIds = [String(countyById.countyId)];
          }
        }
        // If not found by ID, find by name (case-insensitive, partial match)
        if (defaultCountyIds.length === 0 && DEFAULT_COUNTY.name) {
          const countyByName = allMetadata.counties.find(c => 
            c.name?.toLowerCase().includes(DEFAULT_COUNTY.name.toLowerCase())
          );
          if (countyByName) {
            defaultCountyIds = [String(countyByName.countyId)];
          }
        }
      }
      
      setFormData({
        projectName: '', projectDescription: '', startDate: '', endDate: '',
        directorate: '', costOfProject: '', paidOut: '',
        objective: '', expectedOutput: '', principalInvestigator: '', expectedOutcome: '',
        status: 'Not Started', statusReason: '', principalInvestigatorStaffId: '',
        departmentId: '', sectionId: '', finYearId: '', programId: '', subProgramId: '',
        categoryId: '', // ADDED: Reset categoryId for new projects
        countyIds: defaultCountyIds, // Default to configured default county (Kisumu)
        subcountyIds: [], wardIds: [],
      });
      setInitialAssociations({ countyIds: defaultCountyIds, subcountyIds: [], wardIds: [] });
      setLoading(false);
    }
  }, [currentProject, setSnackbar, allMetadata]);


  useEffect(() => {
    const fetchFormDropdowns = async () => {
        if (formData.departmentId) {
            try { setFormSections(await apiService.metadata.departments.getSectionsByDepartment(formData.departmentId)); } catch (err) { console.error("Error fetching form sections:", err); setFormSections([]); }
        } else { setFormSections([]); }

        if (formData.programId) {
            try { setFormSubPrograms(await apiService.metadata.programs.getSubProgramsByProgram(formData.programId)); } catch (err) { console.error("Error fetching form sub-programs:", err); setFormSubPrograms([]); }
        } else { setFormSubPrograms([]); }

        // Always load sub-counties for the default county (even if countyIds is empty, use default)
        let countyIdToUse = null;
        if (formData.countyIds && formData.countyIds.length > 0) {
            countyIdToUse = formData.countyIds[0];
        } else if (allMetadata?.counties) {
            // Find default county if not set
            if (DEFAULT_COUNTY.countyId) {
                const countyById = allMetadata.counties.find(c => c.countyId === DEFAULT_COUNTY.countyId);
                if (countyById) {
                    countyIdToUse = String(countyById.countyId);
                }
            }
            if (!countyIdToUse && DEFAULT_COUNTY.name) {
                const countyByName = allMetadata.counties.find(c => 
                    c.name?.toLowerCase().includes(DEFAULT_COUNTY.name.toLowerCase())
                );
                if (countyByName) {
                    countyIdToUse = String(countyByName.countyId);
                }
            }
        }
        
        if (countyIdToUse) {
            try { 
                setFormSubcounties(await apiService.metadata.counties.getSubcountiesByCounty(countyIdToUse)); 
            } catch (err) { 
                console.error("Error fetching form sub-counties:", err); 
                setFormSubcounties([]); 
            }
        } else { 
            setFormSubcounties([]); 
        }
        
        if (formData.subcountyIds && formData.subcountyIds.length > 0) {
            const firstSubcountyId = formData.subcountyIds[0];
            try { setFormWards(await apiService.metadata.subcounties.getWardsBySubcounty(firstSubcountyId)); } catch (err) { console.error("Error fetching form wards:", err); setFormWards([]); }
        } else { setFormWards([]); }
    };

    fetchFormDropdowns();
  }, [formData.departmentId, formData.programId, formData.countyIds, formData.subcountyIds, allMetadata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev, [name]: value };

        if (name === 'departmentId' && prev.departmentId !== value) { newState.sectionId = ''; }
        if (name === 'programId' && prev.programId !== value) { newState.subProgramId = ''; }
        if (name === 'countyIds' && prev.countyIds[0] !== value[0]) { newState.subcountyIds = []; newState.wardIds = []; }
        if (name === 'subcountyIds' && prev.subcountyIds[0] !== value[0]) { newState.wardIds = []; }

        return newState;
    });
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newArrayValue = typeof value === 'string' ? value.split(',') : value;
        const newState = { ...prev, [name]: newArrayValue };
        
        if (name === 'countyIds' && newArrayValue[0] !== prev.countyIds[0]) { newState.subcountyIds = []; newState.wardIds = []; }
        if (name === 'subcountyIds' && newArrayValue[0] !== prev.subcountyIds[0]) { newState.wardIds = []; }
        
        return newState;
    });
  };

  const validateForm = () => {
    let errors = {};
    // Only projectName is required
    if (!formData.projectName || !formData.projectName.trim()) {
      errors.projectName = 'Project Name is required.';
    }
    // Validate date range only if both dates are provided
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.date_range = 'End Date cannot be before Start Date.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const synchronizeAssociations = useCallback(async (projectId, currentIds, newIds, addFn, removeFn) => {
    const idsToAdd = newIds.filter(id => !currentIds.includes(id));
    const idsToRemove = currentIds.filter(id => !newIds.includes(id));
    const addPromises = idsToAdd.map(id => addFn(projectId, id));
    const removePromises = idsToRemove.map(id => removeFn(projectId, id));
    await Promise.allSettled([...addPromises, ...removePromises]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    const dataToSubmit = { ...formData };
    
    // Note: Geographical coverage (counties) is optional and will default to Kisumu if not provided
    for (const key of ['costOfProject', 'paidOut', 'principalInvestigatorStaffId']) {
      if (dataToSubmit[key] === '' || dataToSubmit[key] === null) { dataToSubmit[key] = null; } else if (typeof dataToSubmit[key] === 'string') { const parsed = parseFloat(dataToSubmit[key]); dataToSubmit[key] = isNaN(parsed) ? null : parsed; }
    }
    for (const key of ['departmentId', 'sectionId', 'finYearId', 'programId', 'subProgramId', 'categoryId']) { // FIXED: Add categoryId here
      if (dataToSubmit[key] === '' || dataToSubmit[key] === null) { dataToSubmit[key] = null; } else if (typeof dataToSubmit[key] === 'string') { const parsed = parseInt(dataToSubmit[key], 10); dataToSubmit[key] = isNaN(parsed) ? null : parsed; }
    }

    // Handle geographical coverage - if empty, default to Kisumu county
    let countyIdsToSave = dataToSubmit.countyIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const subcountyIdsToSave = dataToSubmit.subcountyIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const wardIdsToSave = dataToSubmit.wardIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    
    // If no counties selected, default to the configured default county (Kisumu)
    if (countyIdsToSave.length === 0 && allMetadata?.counties) {
      let defaultCounty = null;
      // First try to find by countyId if specified in DEFAULT_COUNTY
      if (DEFAULT_COUNTY.countyId) {
        defaultCounty = allMetadata.counties.find(c => c.countyId === DEFAULT_COUNTY.countyId);
      }
      // If not found by ID, find by name (case-insensitive, partial match)
      if (!defaultCounty && DEFAULT_COUNTY.name) {
        defaultCounty = allMetadata.counties.find(c => 
          c.name?.toLowerCase().includes(DEFAULT_COUNTY.name.toLowerCase())
        );
      }
      if (defaultCounty) {
        countyIdsToSave = [defaultCounty.countyId];
        console.log(`No counties selected, defaulting to ${DEFAULT_COUNTY.name} county:`, defaultCounty);
      }
    }
    
    delete dataToSubmit.countyIds; delete dataToSubmit.subcountyIds; delete dataToSubmit.wardIds;

    let projectId = currentProject ? currentProject.id : null;

    try {
      if (currentProject) {
        await apiService.projects.updateProject(projectId, dataToSubmit);
        setSnackbar({ open: true, message: 'Project updated successfully!', severity: 'success' });
      } else {
        const createdProject = await apiService.projects.createProject(dataToSubmit);
        projectId = createdProject.id;
        setSnackbar({ open: true, message: 'Project created successfully!', severity: 'success' });
      }

      if (projectId) {
        await Promise.all([
          synchronizeAssociations(projectId, initialAssociations.countyIds.map(id => parseInt(id, 10)), countyIdsToSave, apiService.junctions.addProjectCounty, apiService.junctions.removeProjectCounty),
          synchronizeAssociations(projectId, initialAssociations.subcountyIds.map(id => parseInt(id, 10)), subcountyIdsToSave, apiService.junctions.addProjectSubcounty, apiService.junctions.removeProjectSubcounty),
          synchronizeAssociations(projectId, initialAssociations.wardIds.map(id => parseInt(id, 10)), wardIdsToSave, apiService.junctions.addProjectWard, apiService.junctions.removeProjectWard),
        ]);
      }
      onFormSuccess();
    } catch (err) {
      console.error("Submit project error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to save project.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [formData, currentProject, initialAssociations, onFormSuccess, setSnackbar, synchronizeAssociations, validateForm, allMetadata]);

  return {
    formData, formErrors, loading, handleChange, handleMultiSelectChange, handleSubmit,
    formSections, formSubPrograms, formSubcounties, formWards, missingFinancialYear,
  };
};

export default useProjectForm;
