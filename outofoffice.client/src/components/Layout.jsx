import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import { Outlet, useOutletContext } from 'react-router-dom';

const Layout = () => {
    const tokenAccess = useOutletContext()?.tokenAccess

    return (
        <div>
            <Header context={{ tokenAccess }} />
            <main>
                <Outlet context={{ tokenAccess }} />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;