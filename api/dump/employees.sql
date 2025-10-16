-- Combined SQL Script for Generating Sample Staff Data
-- This script is designed for testing a comprehensive reporting dashboard.
-- It generates sample data for 25 employees and their associated records across multiple tables.

-- Disable foreign key checks to allow insertion in any order
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------------------------------------------------
-- Sample data for `kemri_staff` (25 Employees)
-- ---------------------------------------------------------------------------------------------------------------------
INSERT INTO kemri_staff (
    firstName, lastName, email, phoneNumber, departmentId, jobGroupId, gender,
    dateOfBirth, placeOfBirth, bloodType, religion, nationalId, kraPin,
    employmentStatus, startDate, emergencyContactName, emergencyContactRelationship,
    emergencyContactPhone, nationality, maritalStatus, employmentType, managerId,
    userId, role
) VALUES
('Alex', 'Mumo', 'alex.mumo@kemri.org', '254710111222', 1, 1, 'Male', '1985-05-15', 'Nairobi', 'O+', 'Christian', '10111222', 'A101112229Z', 'Active', '2023-01-10', 'Catherine Mumo', 'Spouse', '254710333444', 'Kenyan', 'Married', 'Permanent', NULL, 1, 'Research Scientist'),
('Brenda', 'Atieno', 'brenda.atieno@kemri.org', '254720222333', 2, 2, 'Female', '1990-08-21', 'Kisumu', 'A-', 'Catholic', '20222333', 'B202223338Y', 'Active', '2022-03-20', 'David Otieno', 'Brother', '254720555666', 'Kenyan', 'Single', 'Permanent', 1, 2, 'Lab Technician'),
('Charles', 'Odhiambo', 'charles.odhiambo@kemri.org', '254730333444', 3, 3, 'Male', '1988-11-30', 'Nakuru', 'B+', 'Christian', '30333444', 'C303334447X', 'Active', '2021-06-15', 'Faith Odhiambo', 'Spouse', '254730666777', 'Kenyan', 'Married', 'Permanent', 1, 3, 'Administrative Staff'),
('Diana', 'Wanjiku', 'diana.wanjiku@kemri.org', '254740444555', 4, 1, 'Female', '1992-02-05', 'Nyeri', 'AB+', 'Christian', '40444555', 'D404445556W', 'Active', '2023-09-01', 'James Kariuki', 'Father', '254740888999', 'Kenyan', 'Single', 'Permanent', 2, 4, 'Research Scientist'),
('Erick', 'Kipchoge', 'erick.kipchoge@kemri.org', '254750555666', 1, 2, 'Male', '1987-07-10', 'Eldoret', 'O-', 'Christian', '50555666', 'E505556665V', 'Active', '2022-11-01', 'Grace Kipchoge', 'Mother', '254750777888', 'Kenyan', 'Married', 'Permanent', 3, 5, 'Lab Technician'),
('Fatuma', 'Abdullahi', 'fatuma.abdullahi@kemri.org', '254760666777', 2, 3, 'Female', '1995-04-12', 'Mombasa', 'B-', 'Muslim', '60666777', 'F606667774U', 'Active', '2024-01-20', 'Hassan Ali', 'Brother', '254760888999', 'Kenyan', 'Single', 'Contract', 3, 6, 'Administrative Staff'),
('George', 'Kamau', 'george.kamau@kemri.org', '254770777888', 3, 1, 'Male', '1980-09-25', 'Muranga', 'A+', 'Christian', '70777888', 'G707778883T', 'Active', '2020-05-18', 'Monica Wambui', 'Spouse', '254770999000', 'Kenyan', 'Married', 'Permanent', 4, 7, 'Research Scientist'),
('Halima', 'Juma', 'halima.juma@kemri.org', '254780888999', 4, 2, 'Female', '1991-06-19', 'Tanga', 'O-', 'Muslim', '80888999', 'H808889992S', 'Active', '2023-05-25', 'Omar Said', 'Father', '254780000111', 'Tanzanian', 'Single', 'Permanent', 4, 8, 'Lab Technician'),
('Ibrahim', 'Mwangi', 'ibrahim.mwangi@kemri.org', '254790999000', 1, 3, 'Male', '1989-10-02', 'Kampala', 'A+', 'Christian', '90999000', 'I909990001R', 'Active', '2022-08-11', 'Lilian Mwangi', 'Spouse', '254790111222', 'Ugandan', 'Married', 'Permanent', 5, 9, 'Administrative Staff'),
('Jane', 'Akello', 'jane.akello@kemri.org', '254711111222', 2, 1, 'Female', '1993-01-28', 'Kisumu', 'B-', 'Christian', '11111222', 'J111112221Q', 'Active', '2024-02-14', 'Mark Omondi', 'Spouse', '254711333444', 'Kenyan', 'Married', 'Contract', 5, 10, 'Research Scientist'),
('Kevin', 'Mbugua', 'kevin.mbugua@kemri.org', '254712222333', 3, 2, 'Male', '1986-03-07', 'Thika', 'O+', 'Christian', '12222333', 'K122223331P', 'Active', '2021-09-01', 'Esther Mbugua', 'Mother', '254712444555', 'Kenyan', 'Single', 'Permanent', 6, 11, 'Lab Technician'),
('Linda', 'Njeri', 'linda.njeri@kemri.org', '254713333444', 4, 3, 'Female', '1994-05-19', 'Mombasa', 'AB-', 'Christian', '13333444', 'L133334441O', 'Active', '2023-03-10', 'Paul Njogu', 'Father', '254713555666', 'Kenyan', 'Single', 'Permanent', 6, 12, 'Administrative Staff'),
('Mohamed', 'Said', 'mohamed.said@kemri.org', '254714444555', 1, 1, 'Male', '1983-08-22', 'Zanzibar', 'A+', 'Muslim', '14444555', 'M144445551N', 'Active', '2020-11-05', 'Aisha Said', 'Spouse', '254714666777', 'Tanzanian', 'Married', 'Permanent', 7, 13, 'Research Scientist'),
('Naomi', 'Wambui', 'naomi.wambui@kemri.org', '254715555666', 2, 2, 'Female', '1996-12-01', 'Nanyuki', 'B+', 'Christian', '15555666', 'N155556661M', 'Active', '2024-04-10', 'Daniel Mwangi', 'Spouse', '254715777888', 'Kenyan', 'Married', 'Permanent', 7, 14, 'Lab Technician'),
('Oscar', 'Ochieng', 'oscar.ochieng@kemri.org', '254716666777', 3, 3, 'Male', '1984-09-17', 'Kisumu', 'O+', 'Christian', '16666777', 'O166667771L', 'Active', '2022-07-01', 'Phoebe Adhiambo', 'Sister', '254716888999', 'Kenyan', 'Single', 'Permanent', 8, 15, 'Administrative Staff'),
('Purity', 'Chepkoech', 'purity.chepkoech@kemri.org', '254717777888', 4, 1, 'Female', '1990-03-03', 'Iten', 'A-', 'Christian', '17777888', 'P177778881K', 'Active', '2023-06-21', 'Samuel Cheruiyot', 'Spouse', '254717999000', 'Kenyan', 'Married', 'Permanent', 8, 16, 'Research Scientist'),
('Quincy', 'Abwavo', 'quincy.abwavo@kemri.org', '254718888999', 1, 2, 'Male', '1987-10-14', 'Busia', 'B-', 'Christian', '18888999', 'Q188889991J', 'Active', '2021-02-15', 'Terry Abwavo', 'Sister', '254718000111', 'Kenyan', 'Single', 'Permanent', 9, 17, 'Lab Technician'),
('Rachel', 'Njoki', 'rachel.njoki@kemri.org', '254719999000', 2, 3, 'Female', '1995-01-08', 'Nakuru', 'O+', 'Christian', '19999000', 'R199990001I', 'Active', '2024-05-01', 'Simon Ngugi', 'Brother', '254719111222', 'Kenyan', 'Single', 'Contract', 9, 18, 'Administrative Staff'),
('Samuel', 'Mburu', 'samuel.mburu@kemri.org', '254720000111', 3, 1, 'Male', '1982-04-29', 'Nairobi', 'A+', 'Christian', '20000111', 'S200001111H', 'Active', '2020-08-01', 'Veronica Wanjiru', 'Spouse', '254720222333', 'Kenyan', 'Married', 'Permanent', 10, 19, 'Research Scientist'),
('Teresia', 'Mutheu', 'teresia.mutheu@kemri.org', '254721111222', 4, 2, 'Female', '1993-07-23', 'Machakos', 'O-', 'Christian', '21111222', 'T211112221G', 'Active', '2023-01-15', 'Paul Mbutu', 'Father', '254721333444', 'Kenyan', 'Single', 'Permanent', 10, 20, 'Lab Technician'),
('Uledi', 'Bakari', 'uledi.bakari@kemri.org', '254722222333', 1, 3, 'Male', '1988-09-09', 'Lamu', 'B+', 'Muslim', '22222333', 'U222223331F', 'Active', '2022-09-05', 'Zainabu Bakari', 'Mother', '254722444555', 'Kenyan', 'Married', 'Permanent', 11, 21, 'Administrative Staff'),
('Violet', 'Wambua', 'violet.wambua@kemri.org', '254723333444', 2, 1, 'Female', '1991-02-18', 'Kitui', 'AB+', 'Christian', '23333444', 'V233334441E', 'Active', '2024-03-01', 'Peter Wambua', 'Brother', '254723555666', 'Kenyan', 'Single', 'Contract', 11, 22, 'Research Scientist'),
('William', 'Oduor', 'william.oduor@kemri.org', '254724444555', 3, 2, 'Male', '1985-05-27', 'Bungoma', 'A-', 'Christian', '24444555', 'W244445551D', 'Active', '2021-10-12', 'Lucy Oduor', 'Spouse', '254724666777', 'Kenyan', 'Married', 'Permanent', 12, 23, 'Lab Technician'),
('Xavier', 'Kibaki', 'xavier.kibaki@kemri.org', '254725555666', 4, 3, 'Male', '1994-08-04', 'Nyeri', 'O+', 'Christian', '25555666', 'X255556661C', 'Active', '2023-04-25', 'Agnes Wanjiru', 'Mother', '254725777888', 'Kenyan', 'Single', 'Permanent', 12, 24, 'Administrative Staff'),
('Yvonne', 'Cherono', 'yvonne.cherono@kemri.org', '254726666777', 1, 1, 'Female', '1990-11-13', 'Kericho', 'B-', 'Christian', '26666777', 'Y266667771B', 'Active', '2022-07-07', 'Joshua Cherono', 'Brother', '254726888999', 'Kenyan', 'Married', 'Permanent', 13, 25, 'Research Scientist');

-- ---------------------------------------------------------------------------------------------------------------------
-- Sample data for other related tables
-- The staff IDs correspond to the data inserted above.
-- ---------------------------------------------------------------------------------------------------------------------

-- `kemri_leave_applications`
INSERT INTO kemri_leave_applications (
    staffId, leaveTypeId, startDate, endDate, numberOfDays, reason, status, approvedStartDate, approvedEndDate, userId
) VALUES
(1, 1, '2025-09-01', '2025-09-10', 10, 'Family vacation.', 'Approved', '2025-09-01', '2025-09-10', 1),
(2, 2, '2025-08-15', '2025-08-17', 3, 'Flu.', 'Approved', '2025-08-15', '2025-08-17', 2),
(3, 1, '2025-12-20', '2026-01-05', 16, 'Holiday travel.', 'Pending', NULL, NULL, 3),
(4, 3, '2025-10-01', '2025-12-30', 90, 'Expecting a baby.', 'Approved', '2025-10-01', '2025-12-30', 4),
(5, 1, '2025-11-10', '2025-11-15', 5, 'Personal.', 'Rejected', NULL, NULL, 5),
(6, 2, '2025-09-20', '2025-09-22', 3, 'Stomach bug.', 'Approved', '2025-09-20', '2025-09-22', 6),
(7, 1, '2025-12-01', '2025-12-14', 14, 'End of year rest.', 'Approved', '2025-12-01', '2025-12-14', 7),
(8, 2, '2025-08-25', '2025-08-27', 3, 'Fever.', 'Approved', '2025-08-25', '2025-08-27', 8),
(9, 1, '2025-10-15', '2025-10-25', 10, 'Annual leave.', 'Pending', NULL, NULL, 9),
(10, 1, '2025-11-20', '2025-11-25', 6, 'Short break.', 'Approved', '2025-11-20', '2025-11-25', 10),
(11, 2, '2025-09-10', '2025-09-12', 3, 'Dental appointment.', 'Approved', '2025-09-10', '2025-09-12', 11),
(12, 1, '2025-12-22', '2026-01-02', 12, 'Christmas holiday.', 'Approved', '2025-12-22', '2026-01-02', 12),
(13, 1, '2025-09-05', '2025-09-15', 11, 'Family visit.', 'Approved', '2025-09-05', '2025-09-15', 13),
(14, 2, '2025-08-10', '2025-08-12', 3, 'Migraine.', 'Approved', '2025-08-10', '2025-08-12', 14),
(15, 1, '2025-11-01', '2025-11-05', 5, 'Personal errands.', 'Pending', NULL, NULL, 15),
(16, 1, '2025-12-10', '2025-12-20', 11, 'Holiday.', 'Approved', '2025-12-10', '2025-12-20', 16),
(17, 2, '2025-09-18', '2025-09-20', 3, 'Food poisoning.', 'Approved', '2025-09-18', '2025-09-20', 17),
(18, 1, '2025-10-20', '2025-10-25', 6, 'Annual trip.', 'Approved', '2025-10-20', '2025-10-25', 18),
(19, 1, '2025-11-25', '2025-12-05', 11, 'Vacation.', 'Approved', '2025-11-25', '2025-12-05', 19),
(20, 2, '2025-08-28', '2025-08-30', 3, 'Sore throat.', 'Approved', '2025-08-28', '2025-08-30', 20),
(21, 1, '2025-12-15', '2025-12-25', 11, 'Holiday leave.', 'Pending', NULL, NULL, 21),
(22, 1, '2025-10-05', '2025-10-10', 6, 'Personal.', 'Approved', '2025-10-05', '2025-10-10', 22),
(23, 2, '2025-09-01', '2025-09-03', 3, 'Back pain.', 'Approved', '2025-09-01', '2025-09-03', 23),
(24, 1, '2025-11-08', '2025-11-15', 8, 'Annual leave.', 'Approved', '2025-11-08', '2025-11-15', 24),
(25, 1, '2025-12-05', '2025-12-15', 11, 'Christmas leave.', 'Approved', '2025-12-05', '2025-12-15', 25);


-- `kemri_employee_training`
INSERT INTO kemri_employee_training (
    staffId, courseName, institution, certificationName, completionDate, expiryDate, userId
) VALUES
(1, 'Project Management Professional', 'PMI', 'PMP', '2024-03-20', '2027-03-20', 1),
(2, 'Lab Safety Protocols', 'KEMRI Internal Training', 'Safety Certification', '2023-05-10', '2026-05-10', 2),
(3, 'Advanced Excel for Admins', 'Corporate IT Solutions', 'Advanced Excel', '2022-07-22', '2025-07-22', 3),
(4, 'Biostatistics for Researchers', 'University of Nairobi', 'Biostatistics Certificate', '2024-02-15', '2029-02-15', 4),
(5, 'ISO 17025', 'Standards Training', 'ISO 17025 Auditor', '2023-11-01', '2026-11-01', 5);


-- `kemri_employee_promotions`
INSERT INTO kemri_employee_promotions (
    staffId, oldJobGroupId, newJobGroupId, promotionDate, comments, userId
) VALUES
(1, 3, 1, '2024-01-10', 'Promoted from Administrative to Research Scientist.', 1),
(7, 3, 1, '2023-09-01', 'Promoted due to exemplary performance.', 7),
(11, 3, 2, '2022-05-01', 'Moved to a more specialized lab role.', 11);


-- `kemri_employee_performance`
INSERT INTO kemri_employee_performance (
    staffId, reviewDate, reviewScore, comments, reviewerId
) VALUES
(1, '2024-06-30', 95, 'Exceeded all performance goals for the year.', 7),
(2, '2024-06-30', 88, 'Met all key performance indicators with some outstanding results.', 7),
(3, '2024-06-30', 75, 'Consistent performance, meets expectations.', 7),
(4, '2024-06-30', 98, 'Exceptional performance, exceeded all metrics.', 7),
(5, '2024-06-30', 80, 'Strong performance, good team player.', 7);


-- `kemri_employee_contracts`
INSERT INTO kemri_employee_contracts (
    staffId, contractType, contractStartDate, contractEndDate, status, userId
) VALUES
(1, 'Permanent', '2023-01-10', NULL, 'Active', 1),
(2, 'Permanent', '2022-03-20', NULL, 'Active', 2),
(3, 'Permanent', '2021-06-15', NULL, 'Active', 3),
(4, 'Permanent', '2023-09-01', NULL, 'Active', 4),
(5, 'Permanent', '2022-11-01', NULL, 'Active', 5),
(6, 'Contract', '2024-01-20', '2025-01-20', 'Active', 6),
(7, 'Permanent', '2020-05-18', NULL, 'Active', 7),
(8, 'Permanent', '2023-05-25', NULL, 'Active', 8),
(9, 'Permanent', '2022-08-11', NULL, 'Active', 9),
(10, 'Contract', '2024-02-14', '2025-02-14', 'Active', 10),
(11, 'Permanent', '2021-09-01', NULL, 'Active', 11),
(12, 'Permanent', '2023-03-10', NULL, 'Active', 12);


-- `kemri_employee_compensation`
INSERT INTO kemri_employee_compensation (
    staffId, baseSalary, allowances, bonuses, bankName, accountNumber, payFrequency, userId
) VALUES
(1, 85000.00, 5000.00, 10000.00, 'Equity Bank', '1234567890', 'Monthly', 1),
(2, 45000.00, 3000.00, 2000.00, 'Cooperative Bank', '0987654321', 'Monthly', 2),
(3, 60000.00, 4000.00, 5000.00, 'KCB Bank', '1122334455', 'Monthly', 3),
(4, 85000.00, 6000.00, 12000.00, 'Standard Chartered', '2233445566', 'Monthly', 4),
(5, 45000.00, 3500.00, 2500.00, 'Absa Bank', '3344556677', 'Monthly', 5);


-- `kemri_employee_dependants`
INSERT INTO kemri_employee_dependants (
    staffId, dependantName, relationship, dateOfBirth, userId
) VALUES
(1, 'Catherine Mumo', 'Spouse', '1988-02-25', 1),
(1, 'Lisa Mumo', 'Child', '2018-05-01', 1),
(3, 'Faith Odhiambo', 'Spouse', '1990-11-15', 3),
(3, 'Michael Odhiambo', 'Child', '2019-03-20', 3),
(4, 'James Kariuki', 'Father', '1965-01-10', 4);


-- `kemri_employee_bank_details`
INSERT INTO kemri_employee_bank_details (
    staffId, bankName, accountNumber, branchName, isPrimary, userId
) VALUES
(1, 'Equity Bank', '1234567890', 'Nairobi Branch', 1, 1),
(2, 'Cooperative Bank', '0987654321', 'Kisumu Branch', 1, 2),
(3, 'KCB Bank', '1122334455', 'Nakuru Branch', 1, 3),
(4, 'Standard Chartered', '2233445566', 'Nyeri Branch', 1, 4),
(5, 'Absa Bank', '3344556677', 'Eldoret Branch', 1, 5);


-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;