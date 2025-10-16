-- Fix Kitui County Data: Add County-Wide Entries and Update Ward Names
-- This script adds county-wide entries and updates ward names with proper Kitui County names

-- Add county-wide sub-county entry (Kitui County Headquarters)
INSERT INTO kemri_subcounties (subcountyId, countyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(1599, 15, 'County-Wide', '90200', 'countywide@kitui.go.ke', '+254 20 1234999', 'Kitui County Headquarters', 'POINT(38.0106 -1.3670)', 'CW', '-1.3670', '38.0106', 0, 1, NOW(), NOW());

-- Add county-wide ward entry
INSERT INTO kemri_wards (wardId, subcountyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(15999, 1599, 'County-Wide', '90200', 'countywide@kitui.go.ke', '+254 20 1234999', 'Kitui County Headquarters', 'POINT(38.0106 -1.3670)', 'CW01', '-1.3670', '38.0106', 0, 1, NOW(), NOW());

-- Update ward names with proper Kitui County ward names
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

-- Verify the updates
SELECT 'County-wide sub-county added:' as status, COUNT(*) as count FROM kemri_subcounties WHERE countyId = 15 AND name = 'County-Wide'
UNION ALL
SELECT 'County-wide ward added:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId = 1599 AND name = 'County-Wide'
UNION ALL
SELECT 'Total sub-counties:' as status, COUNT(*) as count FROM kemri_subcounties WHERE countyId = 15
UNION ALL
SELECT 'Total wards:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15);

















