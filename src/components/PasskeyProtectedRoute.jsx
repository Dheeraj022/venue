import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PasskeyProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            // Priority 1: Check if logged in via Supabase Auth (Admin)
            const { data: { session: supabaseSession } } = await supabase.auth.getSession();
            if (supabaseSession) {
                setIsAuthenticated(true);
                return;
            }

            // Priority 2: Check if logged in via Passkey
            const session = localStorage.getItem('admin_session');
            const expiry = localStorage.getItem('admin_session_expiry');

            if (session === 'true' && expiry) {
                // Check if session is expired
                if (new Date(expiry) > new Date()) {
                    setIsAuthenticated(true);
                } else {
                    // Session expired
                    localStorage.removeItem('admin_session');
                    localStorage.removeItem('admin_session_expiry');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();

        // Listen for auth changes (if admin logs in/out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true);
            } else {
                // If logged out from Supabase, fall back to passkey check
                const passkeySession = localStorage.getItem('admin_session');
                const expiry = localStorage.getItem('admin_session_expiry');
                if (passkeySession === 'true' && expiry && new Date(expiry) > new Date()) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default PasskeyProtectedRoute;
