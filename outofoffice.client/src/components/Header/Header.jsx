import Button from "@mui/material/Button";
import { Link, useOutletContext } from "react-router-dom";
import './Header.css';
import { jwtDecode } from "jwt-decode";

function Header() {
    const tokenAccess = useOutletContext()?.tokenAccess
    const decodedToken = jwtDecode(localStorage.getItem('token'))

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
    };

    const isHR = () => {
        var requiredAccess = ["HR"];
        return tokenAccess == 'BOSS' ? true : requiredAccess.includes(tokenAccess)
    }

    const isPM = () => {
        var requiredAccess = ["Project Manager"];
        return tokenAccess == 'BOSS' ? true : requiredAccess.includes(tokenAccess)
    }

    const isHighPos = () => {
        var requiredAccess = ["HR", "Project Manager"];
        return tokenAccess == 'BOSS' ? true : requiredAccess.includes(tokenAccess)
    }

    return (
        <div id="Header">
            <Link to={isHR() ? '/employees' : null}><Button variant="contained" disabled={!isHR()}>Employees</Button></Link>
            <Link to={isPM() ? '/projects' : null}><Button variant="contained" disabled={!isPM()}>Projects</Button></Link>
            <Link to="/leaveRequests"><Button variant="contained">Leave Request</Button></Link>
            <Link to={isHighPos() ? '/approvalRequests' : null}><Button variant="contained" disabled={!isHighPos()}>Approval Request</Button></Link>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }} >
            <Link to="/login"><Button variant="contained" onClick={handleLogoutClick} style={{ background: 'darkgray' }}>Logout</Button></Link>
                <div>{'Login: ' + decodedToken.sub}<br />{'Position: ' + decodedToken.position}</div>
            </div>
        </div>
    );
}

export default Header;
