import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;