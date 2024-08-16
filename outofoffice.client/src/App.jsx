import './App.css';
import { Route, Routes } from 'react-router-dom';
import ApprovalRequest from './components/Pages/approvalRequests/approvalRequest';
import RequestResolve from './components/Pages/approvalRequests/RequestResolve';
import Employees from './components/Pages/employees/employee';
import EmployeesEdit from './components/Pages/employees/edit';
import EmployeesAdd from './components/Pages/employees/add';
import LeaveRequest from './components/Pages/leaveRequests/leaveRequest';
import LeaveRequestAdd from './components/Pages/leaveRequests/add';
import LeaveRequestOpen from './components/Pages/leaveRequests/open';
import Projects from './components/Pages/projects/project';
import ProjectsEdit from './components/Pages/projects/edit';
import ProjectsAdd from './components/Pages/projects/add';
import Login from './components/Pages/Logon/login';
import Home from './components/Pages/home';
import NotFound from './components/Pages/notFound';
import AccessForbidden from './components/Pages/AccessForbidden';
import Layout from './components/Layout.jsx'
import Protected from './components/Security/protected.jsx';
import AccessCheck from './components/Security/AccessCheck.jsx';
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
                        <Route element={<AccessCheck requiredAccess={["HR"]} />}>
                            <Route path="/employees" element={<Employees />} />
                            <Route path="/employees/edit" element={<EmployeesEdit />} />
                            <Route path="/employees/add" element={<EmployeesAdd />} />
                        </Route>
                        <Route element={<AccessCheck requiredAccess={["Project Manager"]} />}>
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/edit" element={<ProjectsEdit />} />
                            <Route path="/projects/add" element={<ProjectsAdd />} />
                        </Route>
                        <Route element={<AccessCheck requiredAccess={["Project Manager", "HR"]} />}>
                            <Route path="/approvalRequests" element={<ApprovalRequest />} />
                            <Route path="/approvalRequests/resolve" element={<RequestResolve />} />
                        </Route>
                        <Route path="/leaveRequests" element={<LeaveRequest />} />
                        <Route path="/leaveRequests/open" element={<LeaveRequestOpen />} />
                        <Route path="/leaveRequests/add" element={<LeaveRequestAdd />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;