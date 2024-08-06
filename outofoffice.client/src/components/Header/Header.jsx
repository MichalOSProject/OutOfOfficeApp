import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import './Header.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

function Header() {

    const [decodedToken, setDecodedToken] = useState('');

    useEffect(() => {
        setDecodedToken(jwtDecode(localStorage.getItem('token')));
    }, []);

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
    };

    return (
        <div id="Header">
            <Link to="/employees"><Button variant="contained">Employees</Button></Link>
            <Link to="/projects"><Button variant="contained">Projects</Button></Link>
            <Link to="/leaveRequests"><Button variant="contained">Leave Request</Button></Link>
            <Link to="/approvalRequests"><Button variant="contained">Approval Request</Button></Link>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }} >
            <Link to="/login"><Button variant="contained" onClick={handleLogoutClick} style={{ background: 'darkgray' }}>Logout</Button></Link>
                <div>{'Logged-in ID: ' + decodedToken.id}<br />{' Position: ' + decodedToken.position}<br />{' Free Days: ' + decodedToken.freeDays}</div>
            </div>
        </div>
    );
}

export default Header;
