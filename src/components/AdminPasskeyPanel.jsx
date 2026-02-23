import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminPasskeyPanel = () => {
    const [latestKey, setLatestKey] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Hide panel on the admin login page (security requirement)
        if (location.pathname === '/admin-login') {
            setIsVisible(false);
            return;
        }

        // Check if user is logged in via Supabase Auth (the one who can generate keys)
        const checkVisibility = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsVisible(false);
                return;
            }

            const { data, error } = await supabase
                .from('admin_passkeys')
                .select('*')
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching admin panel key:', error);
                setIsVisible(false);
                return;
            }

            if (data) {
                setLatestKey(data);
                setIsVisible(true);
                calculateTimeLeft(data.expires_at);
            } else {
                setIsVisible(false);
            }
        };

        checkVisibility();

        // Subscribe to changes
        const subscription = supabase
            .channel('admin_passkeys_changes_panel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_passkeys' }, checkVisibility)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [location.pathname]);

    const calculateTimeLeft = (expiry) => {
        const difference = new Date(expiry) - new Date();
        if (difference > 0) {
            setTimeLeft(Math.floor(difference / 1000));
        } else {
            setTimeLeft(0);
            setIsVisible(false);
        }
    };

    const handleCopy = () => {
        if (latestKey) {
            navigator.clipboard.writeText(latestKey.passkey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (latestKey) {
            setIsVisible(false);
        }
    }, [timeLeft, latestKey]);

    if (!isVisible || !latestKey) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:bottom-6 sm:right-6 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300 w-[calc(100%-2rem)] sm:w-64">
            <div className="bg-white border border-blue-100 shadow-2xl rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Active Passkey</span>
                    <span className={`text-[10px] sm:text-xs font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
                <div
                    onClick={handleCopy}
                    className="bg-blue-50 py-3 rounded-xl text-center cursor-pointer hover:bg-blue-100 transition-all relative group"
                    title="Click to copy"
                >
                    <span className="text-xl sm:text-2xl font-black text-blue-700 tracking-[0.2em] font-mono">
                        {latestKey.passkey}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-100/10 rounded-xl transition-opacity">
                        <span className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-blue-600 shadow-sm border border-blue-100">
                            {copied ? 'COPIED!' : 'CLICK TO COPY'}
                        </span>
                    </div>
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 text-center leading-tight">
                    This panel is only visible to authenticated admins for sharing.
                </p>
            </div>
        </div>
    );
};

export default AdminPasskeyPanel;
