import './App.css';
import { Route, Routes } from 'react-router-dom';
import ApprovalRequest from './components/Pages/approvalRequests/approvalRequest';
import ApprovalRequestEdit from './components/Pages/approvalRequests/edit';
import Employees from './components/Pages/employees/employee';
import EmployeesEdit from './components/Pages/employees/edit';
import LeaveRequest from './components/Pages/leaveRequests/leaveRequest';
import LeaveRequestEdit from './components/Pages/leaveRequests/edit';
import Projects from './components/Pages/projects/project';
import Login from './components/Pages/Logon/login';
import Register from './components/Pages/Logon/register';
import ProjectsEdit from './components/Pages/projects/edit';
import Home from './components/Pages/home';
import NotFound from './components/Pages/notFound';
import AccessForbidden from './components/Pages/AccessForbidden';
import Layout from './components/Layout.jsx'
import Protected from './components/Security/protected.jsx';
import ResetPasswordPage from './components/Pages/Logon/resetPassword';



function App() {

    return (
        <div>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/403" element={<AccessForbidden />} />
                <Route path="/login" element={<Login />} />
                <Route path="/resetPassword" element={<ResetPasswordPage />} />
                <Route element={<Protected />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/employees/edit" element={<EmployeesEdit />} />
                        <Route path="/employees/add" element={<EmployeesEdit />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/edit" element={<ProjectsEdit />} />
                        <Route path="/projects/add" element={<ProjectsEdit />} />
                        <Route path="/leaveRequests" element={<LeaveRequest />} />
                        <Route path="/leaveRequests/edit" element={<LeaveRequestEdit />} />
                        <Route path="/leaveRequests/add" element={<LeaveRequestEdit />} />
                        <Route path="/approvalRequests" element={<ApprovalRequest />} />
                        <Route path="/approvalRequests/edit" element={<ApprovalRequestEdit />} />
                        <Route path="/approvalRequests/add" element={<ApprovalRequestEdit />} />
                    </Route>
                </Route>

            </Routes>
        </div>
    );
}

export default App;