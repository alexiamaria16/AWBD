import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
        window.location.href = '/';
    }, [logout]);

    return (
        <section className="logout">
            <h2>Logging out...</h2>
        </section>
    );
}

export default Logout;
