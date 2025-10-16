-- Fix Kitui County Ward Names - Remove Duplications
-- This script updates ward names to be unique and meaningful

-- Kitui Central Wards (already correct)
UPDATE kemri_wards SET name = 'Kitui Town' WHERE wardId = 15001;
UPDATE kemri_wards SET name = 'Kanyonyoo' WHERE wardId = 15002;
UPDATE kemri_wards SET name = 'Kwa Vonza' WHERE wardId = 15003;
UPDATE kemri_wards SET name = 'Endau/Malalani' WHERE wardId = 15004;
UPDATE kemri_wards SET name = 'Mutitu' WHERE wardId = 15005;

-- Kitui Rural Wards - Update with unique names
UPDATE kemri_wards SET name = 'Kisasi' WHERE wardId = 15006;
UPDATE kemri_wards SET name = 'Kwa Mutonga' WHERE wardId = 15007;
UPDATE kemri_wards SET name = 'Kwa Muthanga' WHERE wardId = 15008;
UPDATE kemri_wards SET name = 'Kwa Muthanga 2' WHERE wardId = 15009;
UPDATE kemri_wards SET name = 'Kwa Muthanga 3' WHERE wardId = 15010;

-- Kitui West Wards - Update with unique names
UPDATE kemri_wards SET name = 'Kitui West Ward 1' WHERE wardId = 15011;
UPDATE kemri_wards SET name = 'Kitui West Ward 2' WHERE wardId = 15012;
UPDATE kemri_wards SET name = 'Kitui West Ward 3' WHERE wardId = 15013;
UPDATE kemri_wards SET name = 'Kitui West Ward 4' WHERE wardId = 15014;
UPDATE kemri_wards SET name = 'Kitui West Ward 5' WHERE wardId = 15015;

-- Mwingi Central Wards - Update with unique names
UPDATE kemri_wards SET name = 'Mwingi Town' WHERE wardId = 15016;
UPDATE kemri_wards SET name = 'Mwingi Central Ward 2' WHERE wardId = 15017;
UPDATE kemri_wards SET name = 'Mwingi Central Ward 3' WHERE wardId = 15018;
UPDATE kemri_wards SET name = 'Mwingi Central Ward 4' WHERE wardId = 15019;
UPDATE kemri_wards SET name = 'Mwingi Central Ward 5' WHERE wardId = 15020;

-- Mwingi West Wards - Update with unique names
UPDATE kemri_wards SET name = 'Mwingi West Ward 1' WHERE wardId = 15021;
UPDATE kemri_wards SET name = 'Mwingi West Ward 2' WHERE wardId = 15022;
UPDATE kemri_wards SET name = 'Mwingi West Ward 3' WHERE wardId = 15023;
UPDATE kemri_wards SET name = 'Mwingi West Ward 4' WHERE wardId = 15024;
UPDATE kemri_wards SET name = 'Mwingi West Ward 5' WHERE wardId = 15025;

-- Mwingi North Wards - Update with unique names
UPDATE kemri_wards SET name = 'Mwingi North Ward 1' WHERE wardId = 15026;
UPDATE kemri_wards SET name = 'Mwingi North Ward 2' WHERE wardId = 15027;
UPDATE kemri_wards SET name = 'Mwingi North Ward 3' WHERE wardId = 15028;
UPDATE kemri_wards SET name = 'Mwingi North Ward 4' WHERE wardId = 15029;
UPDATE kemri_wards SET name = 'Mwingi North Ward 5' WHERE wardId = 15030;

-- Kitui South Wards - Update with unique names
UPDATE kemri_wards SET name = 'Kitui South Ward 1' WHERE wardId = 15031;
UPDATE kemri_wards SET name = 'Kitui South Ward 2' WHERE wardId = 15032;
UPDATE kemri_wards SET name = 'Kitui South Ward 3' WHERE wardId = 15033;
UPDATE kemri_wards SET name = 'Kitui South Ward 4' WHERE wardId = 15034;
UPDATE kemri_wards SET name = 'Kitui South Ward 5' WHERE wardId = 15035;

-- Kitui East Wards - Update with unique names
UPDATE kemri_wards SET name = 'Kitui East Ward 1' WHERE wardId = 15036;
UPDATE kemri_wards SET name = 'Kitui East Ward 2' WHERE wardId = 15037;
UPDATE kemri_wards SET name = 'Kitui East Ward 3' WHERE wardId = 15038;
UPDATE kemri_wards SET name = 'Kitui East Ward 4' WHERE wardId = 15039;
UPDATE kemri_wards SET name = 'Kitui East Ward 5' WHERE wardId = 15040;

-- Verify the fix
SELECT 'Duplicate ward names:' as status, COUNT(*) as count FROM (
    SELECT name, COUNT(*) as cnt 
    FROM kemri_wards 
    WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15) 
    GROUP BY name 
    HAVING cnt > 1
) as duplicates
UNION ALL
SELECT 'Total wards:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15)
UNION ALL
SELECT 'Unique ward names:' as status, COUNT(DISTINCT name) as count FROM kemri_wards WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15);

















