-- Wprowadzenie danych
INSERT INTO Employees (Name, Surname, Subdivision, Position, EmployeeStatus, EmployeePartner, FreeDays)
VALUES ('Emily', 'Jones', 'Project Management', 'Project Manager', 1, 2, 23),
       ('Frank', 'Miller', 'Project Management', 'Project Manager', 1, 4, 21),
       ('Grace', 'Wilson', 'Project Management', 'Project Manager', 1, 2, 24),
       ('Henry', 'Moore', 'Project Management', 'Project Manager', 1, 3, 26);

-- Wstawienie 12 projektów z częścią ustawioną na true (1), a częścią na false (0)
INSERT INTO Projects (ProjectType, StartDate, EndDate, ManagerId, Comment, ProjectStatus)
VALUES 
    ('Software Development', '2024-08-01', '2024-10-31', 5, 'New CRM System', 1),
    ('Marketing Campaign', '2024-07-15', '2024-09-30', 6, 'Summer Sale Promo', 1),
    ('Infrastructure Upgrade', '2024-08-10', '2024-11-30', 7, 'Data Center Expansion', 1),
    ('Product Launch', '2024-09-01', '2024-12-15', 8, 'New Product Line', 1),
    ('Training Program', '2024-08-15', '2024-10-15', 9, 'Employee Skill Development', 1),
    ('Event Management', '2024-09-10', '2024-10-30', 10, 'Annual Company Event', 1),
    ('Quality Assurance', '2024-08-20', '2024-11-10', 11, 'Product Testing', 0),
    ('Research Project', '2024-09-05', '2024-12-20', 12, 'Market Analysis', 0),
    ('Consulting Service', '2024-08-25', '2024-10-05', 13, 'Client Advisory', 0),
    ('Financial Audit', '2024-09-15', '2024-11-25', 14, 'Annual Audit', 0),
    ('Healthcare Initiative', '2024-08-05', '2024-10-20', 15, 'Community Health Drive', 0),
    ('Logistics Optimization', '2024-09-08', '2024-11-15', 16, 'Supply Chain Efficiency', 0);


-- Wstawienie 15 wniosków urlopowych
INSERT INTO LeaveRequests (EmployeeId, AbsenceReason, StartDate, EndDate, Comment, RequestStatus)
VALUES (1, 'Vacation', '2024-08-10', '2024-08-17', 'Summer break', 'Approved'),
       (2, 'Personal Leave', '2024-09-01', '2024-09-03', 'Family event', 'Approved'),
       (3, 'Sick Leave', '2024-08-15', '2024-08-16', 'Flu', 'Pending'),
       (4, 'Maternity Leave', '2024-10-01', '2025-03-31', 'Expecting a baby', 'Pending'),
       (5, 'Vacation', '2024-08-25', '2024-09-01', 'Annual leave', 'Approved'),
       (6, 'Personal Leave', '2024-09-10', '2024-09-12', 'Short trip', 'Pending'),
       (7, 'Vacation', '2024-09-05', '2024-09-12', 'Holiday', 'Approved'),
       (8, 'Sick Leave', '2024-08-20', '2024-08-21', 'Cold', 'Rejected'),
       (9, 'Personal Leave', '2024-10-15', '2024-10-17', 'Family reunion', 'Pending'),
       (10, 'Vacation', '2024-08-30', '2024-09-06', 'Traveling', 'Approved'),
       (11, 'Maternity Leave', '2024-11-01', '2025-04-30', 'Starting family', 'Pending'),
       (12, 'Vacation', '2024-08-05', '2024-08-12', 'Annual vacation', 'Approved'),
       (13, 'Sick Leave', '2024-09-20', '2024-09-21', 'Fever', 'Pending'),
       (14, 'Personal Leave', '2024-10-05', '2024-10-07', 'Short break', 'Pending'),
       (15, 'Vacation', '2024-08-15', '2024-08-22', 'Summer vacation', 'Approved');

-- Wstawienie 6 zatwierdzonych wniosków urlopowych przez HR i Project Managerów
INSERT INTO ApprovalRequests (ApproverId, LeaveRequestId, RequestStatus, Comment)
VALUES (2, 3, 'Approved', 'Enjoy your time off.'),
       (5, 6, 'Approved', 'Have a good trip.'),
       (6, 9, 'Approved', 'Enjoy your family reunion.'),
       (7, 13, 'Approved', 'Get well soon.'),
       (9, 11, 'Approved', 'Best wishes!'),
       (10, 14, 'Approved', 'Take care.');
