IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [ApprovalRequests] (
    [Id] int NOT NULL IDENTITY(1,1),
    [ApproverId] int NOT NULL,
    [LeaveRequestId] int NOT NULL,
    [RequestStatus] nvarchar(max) NOT NULL,
    [Comment] nvarchar(max) NULL,
    CONSTRAINT [PK_ApprovalRequests] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Employees] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Name] nvarchar(max) NOT NULL,
    [Surname] nvarchar(max) NOT NULL,
    [Subdivision] nvarchar(max) NOT NULL,
    [Position] nvarchar(max) NOT NULL,
    [EmployeeStatus] bit NOT NULL,
    [EmployeePartner] int NOT NULL,
    [FreeDays] int NOT NULL,
        [Photo] nvarchar(max) NULL
);
GO

INSERT INTO Employees (Name, Surname, Subdivision, Position, EmployeeStatus, EmployeePartner, FreeDays)
VALUES ('John', 'Doe', 'HR Department', 'Owner', 1, 1, 25),
('Alice', 'Smith', 'HR Department', 'HR', 1, 1, 20),
       ('Bob', 'Johnson', 'HR Department', 'HR', 1, 1, 18),
       ('Carol', 'Williams', 'HR Department', 'HR', 1, 1, 22),
       ('David', 'Brown', 'HR Department', 'HR', 1, 1, 19);
GO

ALTER TABLE [Employees]
    ADD CONSTRAINT [PK_Employees] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Employees_Employees_EmployeePartner] FOREIGN KEY ([EmployeePartner]) REFERENCES [Employees] ([Id]) ON DELETE NO ACTION
GO

CREATE TABLE [LeaveRequests] (
    [Id] int NOT NULL IDENTITY(1,1),
    [EmployeeId] int NOT NULL,
    [AbsenceReason] nvarchar(max) NOT NULL,
    [StartDate] date NOT NULL,
    [EndDate] date NOT NULL,
    [Comment] nvarchar(max) NULL,
    [RequestStatus] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_LeaveRequests] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Projects] (
    [Id] int NOT NULL IDENTITY(1,1),
    [ProjectType] nvarchar(max) NOT NULL,
    [StartDate] date NOT NULL,
    [EndDate] date NULL,
    [ManagerId] int NOT NULL,
    [Comment] nvarchar(max) NULL,
    [ProjectStatus] bit NOT NULL,
    CONSTRAINT [PK_Projects] PRIMARY KEY ([Id])
);
GO

CREATE INDEX [IX_Employees_EmployeePartner] ON [Employees] ([EmployeePartner]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240706171920_InitialMigration', N'8.0.6');
GO

--Triggers

CREATE TRIGGER trg_CheckEmployeePartner
ON Employees
FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Employees e ON i.EmployeePartner = e.Id
        WHERE e.Position != 'HR'
    )
    BEGIN
        RAISERROR ('EmployeePartner must have Position as HR', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO


COMMIT;
GO

