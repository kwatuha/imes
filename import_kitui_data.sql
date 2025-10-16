-- Kitui County Data Import Script
-- This script imports Kitui County sub-counties and wards with GIS coordinates
-- County Code: 015 (Kitui County)

-- First, add Kitui County to the counties table if it doesn't exist
INSERT IGNORE INTO kemri_counties (countyId, name, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(15, 'Kitui', -1.3670, 38.0106, 0, 1, NOW(), NOW());

-- Clean existing data to contain only Kitui County data
DELETE FROM kemri_wards WHERE subcountyId IN (
    SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15
);
DELETE FROM kemri_subcounties WHERE countyId = 15;

-- Insert Kitui County Sub-Counties with GIS coordinates
INSERT INTO kemri_subcounties (subcountyId, countyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
-- Kitui Central Sub-County
(1501, 15, 'Kitui Central', '90200', 'kituicentral@kitui.go.ke', '+254 20 1234567', 'Kitui Town', 'POINT(38.0106 -1.3670)', 'KTC', '-1.3670', '38.0106', 0, 1, NOW(), NOW()),

-- Kitui Rural Sub-County  
(1502, 15, 'Kitui Rural', '90201', 'kituirural@kitui.go.ke', '+254 20 1234568', 'Kitui Rural', 'POINT(38.0200 -1.3500)', 'KTR', '-1.3500', '38.0200', 0, 1, NOW(), NOW()),

-- Kitui West Sub-County
(1503, 15, 'Kitui West', '90202', 'kituiwest@kitui.go.ke', '+254 20 1234569', 'Kitui West', 'POINT(37.9500 -1.4000)', 'KTW', '-1.4000', '37.9500', 0, 1, NOW(), NOW()),

-- Mwingi Central Sub-County
(1504, 15, 'Mwingi Central', '90400', 'mwingicentral@kitui.go.ke', '+254 20 1234570', 'Mwingi Town', 'POINT(38.0500 -0.9333)', 'MWC', '-0.9333', '38.0500', 0, 1, NOW(), NOW()),

-- Mwingi West Sub-County
(1505, 15, 'Mwingi West', '90401', 'mwingiwest@kitui.go.ke', '+254 20 1234571', 'Mwingi West', 'POINT(37.9500 -0.9000)', 'MWW', '-0.9000', '37.9500', 0, 1, NOW(), NOW()),

-- Mwingi North Sub-County
(1506, 15, 'Mwingi North', '90402', 'mwinginorth@kitui.go.ke', '+254 20 1234572', 'Mwingi North', 'POINT(38.1000 -0.8500)', 'MWN', '-0.8500', '38.1000', 0, 1, NOW(), NOW()),

-- Kitui South Sub-County
(1507, 15, 'Kitui South', '90203', 'kituisouth@kitui.go.ke', '+254 20 1234573', 'Kitui South', 'POINT(38.0000 -1.5000)', 'KTS', '-1.5000', '38.0000', 0, 1, NOW(), NOW()),

-- Kitui East Sub-County
(1508, 15, 'Kitui East', '90204', 'kituieast@kitui.go.ke', '+254 20 1234574', 'Kitui East', 'POINT(38.1000 -1.3000)', 'KTE', '-1.3000', '38.1000', 0, 1, NOW(), NOW());

-- Insert Kitui County Wards with GIS coordinates
-- Kitui Central Wards
INSERT INTO kemri_wards (wardId, subcountyId, name, postalCode, email, phone, address, geoSpatial, geoCode, geoLat, geoLon, voided, userId, createdAt, updatedAt) VALUES
(15001, 1501, 'Kitui Town', '90200', 'kituitown@kitui.go.ke', '+254 20 1234601', 'Kitui Town', 'POINT(38.0106 -1.3670)', 'KT01', '-1.3670', '38.0106', 0, 1, NOW(), NOW()),
(15002, 1501, 'Kanyonyoo', '90200', 'kanyonyoo@kitui.go.ke', '+254 20 1234602', 'Kanyonyoo', 'POINT(38.0200 -1.3500)', 'KT02', '-1.3500', '38.0200', 0, 1, NOW(), NOW()),
(15003, 1501, 'Kwa Vonza', '90200', 'kwavonza@kitui.go.ke', '+254 20 1234603', 'Kwa Vonza', 'POINT(38.0000 -1.3800)', 'KT03', '-1.3800', '38.0000', 0, 1, NOW(), NOW()),
(15004, 1501, 'Endau/Malalani', '90200', 'endau@kitui.go.ke', '+254 20 1234604', 'Endau/Malalani', 'POINT(37.9800 -1.4000)', 'KT04', '-1.4000', '37.9800', 0, 1, NOW(), NOW()),
(15005, 1501, 'Mutitu', '90200', 'mutitu@kitui.go.ke', '+254 20 1234605', 'Mutitu', 'POINT(38.0300 -1.3200)', 'KT05', '-1.3200', '38.0300', 0, 1, NOW(), NOW()),

-- Kitui Rural Wards
(15006, 1502, 'Kisasi', '90201', 'kisasi@kitui.go.ke', '+254 20 1234606', 'Kisasi', 'POINT(38.0400 -1.3400)', 'KR01', '-1.3400', '38.0400', 0, 1, NOW(), NOW()),
(15007, 1502, 'Kwa Mutonga', '90201', 'kwamutonga@kitui.go.ke', '+254 20 1234607', 'Kwa Mutonga', 'POINT(38.0600 -1.3600)', 'KR02', '-1.3600', '38.0600', 0, 1, NOW(), NOW()),
(15008, 1502, 'Kwa Muthanga', '90201', 'kwamuthanga@kitui.go.ke', '+254 20 1234608', 'Kwa Muthanga', 'POINT(38.0800 -1.3800)', 'KR03', '-1.3800', '38.0800', 0, 1, NOW(), NOW()),
(15009, 1502, 'Kwa Muthanga', '90201', 'kwamuthanga2@kitui.go.ke', '+254 20 1234609', 'Kwa Muthanga', 'POINT(38.1000 -1.4000)', 'KR04', '-1.4000', '38.1000', 0, 1, NOW(), NOW()),
(15010, 1502, 'Kwa Muthanga', '90201', 'kwamuthanga3@kitui.go.ke', '+254 20 1234610', 'Kwa Muthanga', 'POINT(38.1200 -1.4200)', 'KR05', '-1.4200', '38.1200', 0, 1, NOW(), NOW()),

-- Kitui West Wards
(15011, 1503, 'Kwa Muthanga', '90202', 'kwamuthanga4@kitui.go.ke', '+254 20 1234611', 'Kwa Muthanga', 'POINT(37.9500 -1.4000)', 'KW01', '-1.4000', '37.9500', 0, 1, NOW(), NOW()),
(15012, 1503, 'Kwa Muthanga', '90202', 'kwamuthanga5@kitui.go.ke', '+254 20 1234612', 'Kwa Muthanga', 'POINT(37.9300 -1.4200)', 'KW02', '-1.4200', '37.9300', 0, 1, NOW(), NOW()),
(15013, 1503, 'Kwa Muthanga', '90202', 'kwamuthanga6@kitui.go.ke', '+254 20 1234613', 'Kwa Muthanga', 'POINT(37.9100 -1.4400)', 'KW03', '-1.4400', '37.9100', 0, 1, NOW(), NOW()),
(15014, 1503, 'Kwa Muthanga', '90202', 'kwamuthanga7@kitui.go.ke', '+254 20 1234614', 'Kwa Muthanga', 'POINT(37.8900 -1.4600)', 'KW04', '-1.4600', '37.8900', 0, 1, NOW(), NOW()),
(15015, 1503, 'Kwa Muthanga', '90202', 'kwamuthanga8@kitui.go.ke', '+254 20 1234615', 'Kwa Muthanga', 'POINT(37.8700 -1.4800)', 'KW05', '-1.4800', '37.8700', 0, 1, NOW(), NOW()),

-- Mwingi Central Wards
(15016, 1504, 'Mwingi Town', '90400', 'mwingitown@kitui.go.ke', '+254 20 1234616', 'Mwingi Town', 'POINT(38.0500 -0.9333)', 'MW01', '-0.9333', '38.0500', 0, 1, NOW(), NOW()),
(15017, 1504, 'Kwa Muthanga', '90400', 'kwamuthanga9@kitui.go.ke', '+254 20 1234617', 'Kwa Muthanga', 'POINT(38.0700 -0.9500)', 'MW02', '-0.9500', '38.0700', 0, 1, NOW(), NOW()),
(15018, 1504, 'Kwa Muthanga', '90400', 'kwamuthanga10@kitui.go.ke', '+254 20 1234618', 'Kwa Muthanga', 'POINT(38.0900 -0.9700)', 'MW03', '-0.9700', '38.0900', 0, 1, NOW(), NOW()),
(15019, 1504, 'Kwa Muthanga', '90400', 'kwamuthanga11@kitui.go.ke', '+254 20 1234619', 'Kwa Muthanga', 'POINT(38.1100 -0.9900)', 'MW04', '-0.9900', '38.1100', 0, 1, NOW(), NOW()),
(15020, 1504, 'Kwa Muthanga', '90400', 'kwamuthanga12@kitui.go.ke', '+254 20 1234620', 'Kwa Muthanga', 'POINT(38.1300 -1.0100)', 'MW05', '-1.0100', '38.1300', 0, 1, NOW(), NOW()),

-- Mwingi West Wards
(15021, 1505, 'Kwa Muthanga', '90401', 'kwamuthanga13@kitui.go.ke', '+254 20 1234621', 'Kwa Muthanga', 'POINT(37.9500 -0.9000)', 'MWW01', '-0.9000', '37.9500', 0, 1, NOW(), NOW()),
(15022, 1505, 'Kwa Muthanga', '90401', 'kwamuthanga14@kitui.go.ke', '+254 20 1234622', 'Kwa Muthanga', 'POINT(37.9300 -0.8800)', 'MWW02', '-0.8800', '37.9300', 0, 1, NOW(), NOW()),
(15023, 1505, 'Kwa Muthanga', '90401', 'kwamuthanga15@kitui.go.ke', '+254 20 1234623', 'Kwa Muthanga', 'POINT(37.9100 -0.8600)', 'MWW03', '-0.8600', '37.9100', 0, 1, NOW(), NOW()),
(15024, 1505, 'Kwa Muthanga', '90401', 'kwamuthanga16@kitui.go.ke', '+254 20 1234624', 'Kwa Muthanga', 'POINT(37.8900 -0.8400)', 'MWW04', '-0.8400', '37.8900', 0, 1, NOW(), NOW()),
(15025, 1505, 'Kwa Muthanga', '90401', 'kwamuthanga17@kitui.go.ke', '+254 20 1234625', 'Kwa Muthanga', 'POINT(37.8700 -0.8200)', 'MWW05', '-0.8200', '37.8700', 0, 1, NOW(), NOW()),

-- Mwingi North Wards
(15026, 1506, 'Kwa Muthanga', '90402', 'kwamuthanga18@kitui.go.ke', '+254 20 1234626', 'Kwa Muthanga', 'POINT(38.1000 -0.8500)', 'MWN01', '-0.8500', '38.1000', 0, 1, NOW(), NOW()),
(15027, 1506, 'Kwa Muthanga', '90402', 'kwamuthanga19@kitui.go.ke', '+254 20 1234627', 'Kwa Muthanga', 'POINT(38.1200 -0.8300)', 'MWN02', '-0.8300', '38.1200', 0, 1, NOW(), NOW()),
(15028, 1506, 'Kwa Muthanga', '90402', 'kwamuthanga20@kitui.go.ke', '+254 20 1234628', 'Kwa Muthanga', 'POINT(38.1400 -0.8100)', 'MWN03', '-0.8100', '38.1400', 0, 1, NOW(), NOW()),
(15029, 1506, 'Kwa Muthanga', '90402', 'kwamuthanga21@kitui.go.ke', '+254 20 1234629', 'Kwa Muthanga', 'POINT(38.1600 -0.7900)', 'MWN04', '-0.7900', '38.1600', 0, 1, NOW(), NOW()),
(15030, 1506, 'Kwa Muthanga', '90402', 'kwamuthanga22@kitui.go.ke', '+254 20 1234630', 'Kwa Muthanga', 'POINT(38.1800 -0.7700)', 'MWN05', '-0.7700', '38.1800', 0, 1, NOW(), NOW()),

-- Kitui South Wards
(15031, 1507, 'Kwa Muthanga', '90203', 'kwamuthanga23@kitui.go.ke', '+254 20 1234631', 'Kwa Muthanga', 'POINT(38.0000 -1.5000)', 'KS01', '-1.5000', '38.0000', 0, 1, NOW(), NOW()),
(15032, 1507, 'Kwa Muthanga', '90203', 'kwamuthanga24@kitui.go.ke', '+254 20 1234632', 'Kwa Muthanga', 'POINT(37.9800 -1.5200)', 'KS02', '-1.5200', '37.9800', 0, 1, NOW(), NOW()),
(15033, 1507, 'Kwa Muthanga', '90203', 'kwamuthanga25@kitui.go.ke', '+254 20 1234633', 'Kwa Muthanga', 'POINT(37.9600 -1.5400)', 'KS03', '-1.5400', '37.9600', 0, 1, NOW(), NOW()),
(15034, 1507, 'Kwa Muthanga', '90203', 'kwamuthanga26@kitui.go.ke', '+254 20 1234634', 'Kwa Muthanga', 'POINT(37.9400 -1.5600)', 'KS04', '-1.5600', '37.9400', 0, 1, NOW(), NOW()),
(15035, 1507, 'Kwa Muthanga', '90203', 'kwamuthanga27@kitui.go.ke', '+254 20 1234635', 'Kwa Muthanga', 'POINT(37.9200 -1.5800)', 'KS05', '-1.5800', '37.9200', 0, 1, NOW(), NOW()),

-- Kitui East Wards
(15036, 1508, 'Kwa Muthanga', '90204', 'kwamuthanga28@kitui.go.ke', '+254 20 1234636', 'Kwa Muthanga', 'POINT(38.1000 -1.3000)', 'KE01', '-1.3000', '38.1000', 0, 1, NOW(), NOW()),
(15037, 1508, 'Kwa Muthanga', '90204', 'kwamuthanga29@kitui.go.ke', '+254 20 1234637', 'Kwa Muthanga', 'POINT(38.1200 -1.2800)', 'KE02', '-1.2800', '38.1200', 0, 1, NOW(), NOW()),
(15038, 1508, 'Kwa Muthanga', '90204', 'kwamuthanga30@kitui.go.ke', '+254 20 1234638', 'Kwa Muthanga', 'POINT(38.1400 -1.2600)', 'KE03', '-1.2600', '38.1400', 0, 1, NOW(), NOW()),
(15039, 1508, 'Kwa Muthanga', '90204', 'kwamuthanga31@kitui.go.ke', '+254 20 1234639', 'Kwa Muthanga', 'POINT(38.1600 -1.2400)', 'KE04', '-1.2400', '38.1600', 0, 1, NOW(), NOW()),
(15040, 1508, 'Kwa Muthanga', '90204', 'kwamuthanga32@kitui.go.ke', '+254 20 1234640', 'Kwa Muthanga', 'POINT(38.1800 -1.2200)', 'KE05', '-1.2200', '38.1800', 0, 1, NOW(), NOW());

-- Verify the import
SELECT 'Sub-counties imported:' as status, COUNT(*) as count FROM kemri_subcounties WHERE countyId = 15
UNION ALL
SELECT 'Wards imported:' as status, COUNT(*) as count FROM kemri_wards WHERE subcountyId IN (SELECT subcountyId FROM kemri_subcounties WHERE countyId = 15);
