# OutOfOfficeApp
OutOfOffice is an application designed to help manage employee leave days. The web application allows you to:

- Add employees to any department and position.
- Create projects with deadlines and assign a Project Manager.
- Allow any employee to submit a leave request.
- The request must be approved by the employee's HR representative (designated upon creation) and by the Project Managers of each project the employee belongs to.
- Additionally, the application includes a login system, account creation, and password reset functionality.

Elements requiring completion:

- Restrict controller actions based on access groups.
- Restrict Front-End access based on permissions stored in tokens.
- Develop a view for required approvals for Project Managers.
- Automatically close leave requests once all approvals are obtained.

For testing the application:

- A SQL 2019 instance (minimum SQL EXPRESS) is required for the application to function.
- The database connection string can be modified in the `appsettings.json` file.
- The script to create an empty database with basic administrative accounts is located at `MichalOSProject\OutOfOfficeApp\OutOfOffice.Server\Models\SQLscripts\createDbScript.sql`.

Default Administrator login credentials:
- Username: admin
- Password: Start123@

Default System Account (HR) login credentials:
- Username: HRadmin
- Password: Start123@
