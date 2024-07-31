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

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
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
    CONSTRAINT [PK_Employees] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Employees_Employees_EmployeePartner] FOREIGN KEY ([EmployeePartner]) REFERENCES [Employees] ([Id]) ON DELETE NO ACTION
);
GO

INSERT INTO Employees (Name, Surname, Subdivision, Position, EmployeeStatus, EmployeePartner, FreeDays)
VALUES ('Admin', 'Admin', 'WEB APP ADMIN', 'BOSS', 1, 1, 100),
('Alice', 'Smith', 'HR Department', 'HR', 1, 1, 20),
       ('Bob', 'Johnson', 'HR Department', 'HR', 1, 1, 18),
       ('Carol', 'Williams', 'HR Department', 'HR', 1, 1, 22),
       ('David', 'Brown', 'HR Department', 'HR', 1, 1, 19);
GO

ALTER TABLE [Employees]
    ADD CONSTRAINT [PK_Employees] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Employees_Employees_EmployeePartner] FOREIGN KEY ([EmployeePartner]) REFERENCES [Employees] ([Id]) ON DELETE NO ACTION
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [Discriminator] nvarchar(21) NOT NULL,
    [EmployeeId] int NULL,
    [changePassword] bit NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUsers_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE NO ACTION
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
    CONSTRAINT [PK_LeaveRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_LeaveRequests_Employees_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
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
    CONSTRAINT [PK_Projects] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Projects_Employees_ManagerId] FOREIGN KEY ([ManagerId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [ApprovalRequests] (
    [Id] int NOT NULL IDENTITY,
    [ApproverId] int NOT NULL,
    [LeaveRequestId] int NOT NULL,
    [RequestStatus] nvarchar(max) NOT NULL,
    [Comment] nvarchar(max) NULL,
    CONSTRAINT [PK_ApprovalRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ApprovalRequests_Employees_ApproverId] FOREIGN KEY ([ApproverId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ApprovalRequests_LeaveRequests_LeaveRequestId] FOREIGN KEY ([LeaveRequestId]) REFERENCES [LeaveRequests] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [ProjectsDetails] (
    [Id] int NOT NULL IDENTITY,
    [employeeId] int NOT NULL,
    [ProjectId] int NOT NULL,
    CONSTRAINT [PK_ProjectsDetails] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProjectsDetails_Employees_employeeId] FOREIGN KEY ([employeeId]) REFERENCES [Employees] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProjectsDetails_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_ApprovalRequests_ApproverId] ON [ApprovalRequests] ([ApproverId]);
GO

CREATE INDEX [IX_ApprovalRequests_LeaveRequestId] ON [ApprovalRequests] ([LeaveRequestId]);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE INDEX [IX_AspNetUsers_EmployeeId] ON [AspNetUsers] ([EmployeeId]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO

CREATE INDEX [IX_Employees_EmployeePartner] ON [Employees] ([EmployeePartner]);
GO

CREATE INDEX [IX_LeaveRequests_EmployeeId] ON [LeaveRequests] ([EmployeeId]);
GO

CREATE INDEX [IX_Projects_ManagerId] ON [Projects] ([ManagerId]);
GO

CREATE INDEX [IX_ProjectsDetails_employeeId] ON [ProjectsDetails] ([employeeId]);
GO

CREATE INDEX [IX_ProjectsDetails_ProjectId] ON [ProjectsDetails] ([ProjectId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240716153833_InitialCreate', N'8.0.7');
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