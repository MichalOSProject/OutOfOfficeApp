import { Outlet, Navigate, useOutletContext } from "react-router-dom";
import PropTypes from 'prop-types';

const AccessCheck = ({ requiredAccess }) => {
    const tokenAccess = useOutletContext()?.tokenAccess

    const hasAccess = tokenAccess == 'BOSS' ? true : requiredAccess.includes(tokenAccess)

    if (!hasAccess) {
        return <Navigate to="/403" />;
    }

    return <Outlet/>;
};

AccessCheck.propTypes = {
    requiredAccess: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
};

export default AccessCheck;
