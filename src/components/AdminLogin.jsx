import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPasskey, generatePasskey } from '../passkeyService';
import { supabase } from '../supabaseClient';

const AdminLogin = () => {
    const [inputPasskey, setInputPasskey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in via Supabase, no need for passkey
        const checkExistingAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/');
            }
        };
        checkExistingAuth();
    }, [navigate]);

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await generatePasskey();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError('Failed to generate passkey');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await verifyPasskey(inputPasskey);

            if (result.success) {
                // Success! Store session securely
                localStorage.setItem('admin_session', 'true');

                // Set session expiry to 10 hours from now
                const tenHoursInMs = 10 * 60 * 60 * 1000;
                const sessionExpiry = new Date(Date.now() + tenHoursInMs).toISOString();
                localStorage.setItem('admin_session_expiry', sessionExpiry);

                navigate('/'); // Redirect to main home dashboard
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error verifying passkey:', err);
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Secure Access</h2>

                <div className="space-y-6">
                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
                        >
                            {loading ? '...' : 'Generate Pass Key'}
                        </button>
                        {success && (
                            <p className="text-green-600 text-[10px] text-center mt-2 font-medium animate-pulse">
                                New key generated. Please contact admin.
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 mb-1">
                                Enter Pass Key
                            </label>
                            <input
                                id="passkey"
                                type="text"
                                value={inputPasskey}
                                onChange={(e) => setInputPasskey(e.target.value)}
                                placeholder="Ex: 4FD6E"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase text-center text-xl tracking-widest"
                                maxLength={5}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !inputPasskey}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
