-- Kitui County Complete Setup: Add County-Wide Entries, Clean Data, and Map Projects
-- This script adds county-wide entries, cleans non-Kitui data, and maps projects to sub-counties/wards

-- Step 1: Add county-wide sub-county entry (Kitui County Headquarters)
INSERT INTO kemri_subcounties (subcountyId, countyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(1599, 15, 'County-Wide', '90200', 'countywide@kitui.go.ke', '+254 20 1234999', 'Kitui County Headquarters', 'POINT(38.0106 -1.3670)', 'CW', '-1.3670', '38.0106', 0, 1, NOW(), NOW());

-- Step 2: Add county-wide ward entry
INSERT INTO kemri_wards (wardId, subcountyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(15999, 1599, 'County-Wide', '90200', 'countywide@kitui.go.ke', '+254 20 1234999', 'Kitui County Headquarters', 'POINT(38.0106 -1.3670)', 'CW01', '-1.3670', '38.0106', 0, 1, NOW(), NOW());

-- Step 3: Clean existing project mappings
DELETE FROM kemri_project_wards;
DELETE FROM kemri_project_subcounties;

-- Step 4: Clean non-Kitui data from sub-counties and wards
DELETE FROM kemri_wards WHERE subcountyId NOT IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15);
DELETE FROM kemri_subcounties WHERE countyId != 15;

-- Step 5: Update ward names with proper Kitui County ward names
-- Kitui Central Wards (already correct)
UPDATE kemri_wards SET name = 'Kitui Town' WHERE wardId = 15001;
UPDATE kemri_wards SET name = 'Kanyonyoo' WHERE wardId = 15002;
UPDATE kemri_wards SET name = 'Kwa Vonza' WHERE wardId = 15003;
UPDATE kemri_wards SET name = 'Endau/Malalani' WHERE wardId = 15004;
UPDATE kemri_wards SET name = 'Mutitu' WHERE wardId = 15005;

-- Kitui Rural Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kisasi' WHERE wardId = 15006;
UPDATE kemri_wards SET name = 'Kwa Mutonga' WHERE wardId = 15007;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15008;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15009;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15010;

-- Kitui West Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15011;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15012;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15013;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15014;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15015;

-- Mwingi Central Wards - Update with proper names
UPDATE kemri_wards SET name = 'Mwingi Town' WHERE wardId = 15016;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15017;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15018;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15019;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15020;

-- Mwingi West Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15021;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15022;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15023;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15024;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15025;

-- Mwingi North Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15026;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15027;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15028;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15029;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15030;

-- Kitui South Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15031;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15032;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15033;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15034;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15035;

-- Kitui East Wards - Update with proper names
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15036;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15037;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15038;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15039;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15040;

-- Step 6: Map projects to sub-counties and wards based on project names
-- Projects with specific location indicators

-- Kwa Vonza projects -> Kitui Central sub-county, Kwa Vonza ward
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1501, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Kwa Vonza%';

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15003, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Kwa Vonza%';

-- Mwingi projects -> Mwingi Central sub-county, Mwingi Town ward
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1504, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND (p.projectName LIKE '%Mwingi%' OR p.projectName LIKE '%Kyuso%');

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15016, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND (p.projectName LIKE '%Mwingi%' OR p.projectName LIKE '%Kyuso%');

-- Kitui Town projects -> Kitui Central sub-county, Kitui Town ward
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1501, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Kitui Town%';

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15001, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Kitui Town%';

-- Athi Ward projects -> Kitui Central sub-county, Athi ward (use Kitui Town as fallback)
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1501, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Athi%';

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15001, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Athi%';

-- Mutomo projects -> Kitui South sub-county, County-Wide ward
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1507, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Mutomo%';

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15999, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND p.projectName LIKE '%Mutomo%';

-- Countywide projects -> County-Wide sub-county and ward
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1599, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND (p.projectName LIKE '%Countywide%' OR p.projectName LIKE '%County-wide%' OR p.projectName LIKE '%County Wide%');

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15999, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 AND (p.projectName LIKE '%Countywide%' OR p.projectName LIKE '%County-wide%' OR p.projectName LIKE '%County Wide%');

-- Step 7: Map remaining projects to County-Wide (fallback)
INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt, voided)
SELECT p.id, 1599, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 
AND p.id NOT IN (SELECT projectId FROM kemri_project_subcounties);

INSERT INTO kemri_project_wards (projectId, wardId, assignedAt, voided)
SELECT p.id, 15999, NOW(), 0
FROM kemri_projects p
WHERE p.voided = 0 
AND p.id NOT IN (SELECT projectId FROM kemri_project_wards);

-- Step 8: Verify the setup
SELECT 'County-wide sub-county added:' as status, COUNT(*) as count FROM kemri_subcounties WHERE countyId = 15 AND name = 'County-Wide'
UNION ALL
SELECT 'County-wide ward added:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId = 1599 AND name = 'County-Wide'
UNION ALL
SELECT 'Total sub-counties:' as status, COUNT(*) as count FROM kemri_subcounties WHERE countyId = 15
UNION ALL
SELECT 'Total wards:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15)
UNION ALL
SELECT 'Project-subcounty mappings:' as status, COUNT(*) as count FROM kemri_project_subcounties
UNION ALL
SELECT 'Project-ward mappings:' as status, COUNT(*) as count FROM kemri_project_wards;

















