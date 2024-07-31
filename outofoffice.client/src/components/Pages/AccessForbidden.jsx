import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const AccessForbidden = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
    };

    return (
        <div>
            <h1>403 - Access Forbidden</h1>
            <Button variant="contained" onClick={goBack}>
                Back
            </Button>
        </div>
    )
};

export default AccessForbidden;
