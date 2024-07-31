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
    [Id] int NOT NULL IDENTITY,
    [ApproverId] int NOT NULL,
    [LeaveRequestId] int NOT NULL,
    [RequestStatus] nvarchar(max) NOT NULL,
    [Comment] nvarchar(max) NULL,
    CONSTRAINT [PK_ApprovalRequests] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Employees] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Surname] nvarchar(max) NOT NULL,
    [Subdivision] nvarchar(max) NOT NULL,
    [Position] nvarchar(max) NOT NULL,
    [EmployeeStatus] bit NOT NULL,
    [EmployeePartner] int NOT NULL,
    [FreeDays] int NOT NULL,
    [Photo] nvarchar(max) NULL,
    CONSTRAINT [PK_Employees] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [LeaveRequests] (
    [Id] int NOT NULL IDENTITY,
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
    [Id] int NOT NULL IDENTITY,
    [ProjectType] nvarchar(max) NOT NULL,
    [StartDate] date NOT NULL,
    [EndDate] date NULL,
    [ManagerId] int NOT NULL,
    [Comment] nvarchar(max) NULL,
    [ProjectStatus] bit NOT NULL,
    CONSTRAINT [PK_Projects] PRIMARY KEY ([Id])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240708151407_InitialMigration', N'8.0.6');
GO

COMMIT;
GO

