import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VenueForm from './components/VenueForm';
import { VenueList } from './components/VenueList';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import PasskeyProtectedRoute from './components/PasskeyProtectedRoute';
import AdminPasskeyPanel from './components/AdminPasskeyPanel';
import { supabase } from './supabaseClient';
import { generatePasskey } from './passkeyService';

// Header component to handle navigation state highlighting
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [adminSession, setAdminSession] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch active passkey for admins - Pulled out of useEffect so it can be reused
  const fetchActiveKey = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        setActiveKey(null);
        return;
      }

      const { data, error } = await supabase
        .from('admin_passkeys')
        .select('passkey, expires_at')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active key:', error);
        setActiveKey(null);
        return;
      }

      if (data) {
        setActiveKey(data);
        const diff = new Date(data.expires_at) - new Date();
        setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
      } else {
        setActiveKey(null);
        setTimeLeft(0);
      }
    } catch (err) {
      console.error('FetchActiveKey crash:', err);
      setActiveKey(null);
    }
  };

  // Check admin session (passkey session)
  const checkAdmin = () => {
    const isAdmin = localStorage.getItem('admin_session') === 'true';
    const expiry = localStorage.getItem('admin_session_expiry');

    if (isAdmin && expiry) {
      const diff = new Date(expiry) - new Date();
      if (diff > 0) {
        setAdminSession(true);
        setSessionTimeLeft(Math.floor(diff / 1000));
      } else {
        // Session expired
        handleLogout();
      }
    } else {
      setAdminSession(false);
      setSessionTimeLeft(0);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    checkAdmin();
    const interval = setInterval(checkAdmin, 10000); // Check every 10s for broad session status

    // Fetch active passkey for admins
    fetchActiveKey();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setActiveKey(null);
      else fetchActiveKey();
    });

    // Subscribe to passkey changes
    const passkeySubscription = supabase
      .channel('header_passkey_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_passkeys' }, fetchActiveKey)
      .subscribe();

    return () => {
      subscription.unsubscribe();
      passkeySubscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Close menu and update session status on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    checkAdmin();
  }, [location.pathname]);

  // Timer effects
  useEffect(() => {
    const timer = setInterval(() => {
      // Active key countdown
      if (timeLeft > 0) setTimeLeft(prev => prev - 1);
      else if (activeKey) setActiveKey(null);

      // Session countdown
      if (sessionTimeLeft > 0) setSessionTimeLeft(prev => prev - 1);
      else if (adminSession && !session) handleLogout(); // Only auto-logout passkey users, not Supabase admins
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, activeKey, sessionTimeLeft, adminSession, session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_session_expiry');
    setAdminSession(false);
    setSessionTimeLeft(0);
    navigate('/admin-login');
  };

  const handleGenerateKey = async () => {
    setGenerating(true);
    try {
      await generatePasskey();
      // Manually trigger fetch to ensure immediate UI update
      fetchActiveKey();
    } catch (err) {
      alert('Failed to generate passkey.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activeKey) {
      navigator.clipboard.writeText(activeKey.passkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format seconds to H:MM:SS
  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="text-lg sm:text-xl font-bold text-gray-900 cursor-pointer shrink-1 truncate">
          Venue Manager
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {(location.pathname === '/add-venue' || location.pathname === '/login' || location.pathname === '/admin-login') && (
            <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-800 hover:bg-gray-200">
              Venue Explorer
            </Link>
          )}

          {!adminSession && !session && location.pathname !== '/admin-login' && (
            <Link to="/admin-login" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-blue-600 hover:bg-blue-50">
              Enter Passkey
            </Link>
          )}

          {adminSession && !session && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                <span className="text-[9px] uppercase font-bold text-blue-600 leading-tight">Session Ends In</span>
                <span className="text-xs font-mono font-bold text-blue-700 leading-tight">
                  {formatSessionTime(sessionTimeLeft)}
                </span>
              </div>
              {location.pathname !== '/add-venue' && (
                <Link to="/add-venue" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                  + Add Venue
                </Link>
              )}
            </div>
          )}

          {!session ? (
            location.pathname !== '/login' && adminSession && (
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                Logout
              </button>
            ) || location.pathname !== '/login' && !adminSession && (
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700">
                Admin Login
              </Link>
            )
          ) : (
            <>
              {activeKey && (
                <div onClick={handleCopy} className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-all group relative">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase font-bold text-green-600 leading-tight">
                      {copied ? 'COPIED!' : 'Active Key'}
                    </span>
                    <span className="text-sm font-mono font-black text-green-700 leading-tight">
                      {activeKey.passkey}
                    </span>
                  </div>
                  <div className="h-6 w-[1px] bg-green-200 mx-1"></div>
                  <span className={`text-xs font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              <button onClick={handleGenerateKey} disabled={generating} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50">
                {generating ? '...' : 'Generate Passkey'}
              </button>
              {session && location.pathname !== '/add-venue' && (
                <Link to="/add-venue" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100">
                  + Add Venue
                </Link>
              )}
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Header Icons/Buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Active Key (Mini) */}
          {session && activeKey && (
            <div onClick={handleCopy} className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100 cursor-pointer text-xs">
              <span className="font-mono font-black text-green-700">{activeKey.passkey}</span>
              <span className={`font-mono ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {/* Nav Links */}
            {(location.pathname === '/add-venue' || location.pathname === '/login' || location.pathname === '/admin-login') && (
              <Link to="/" className="block px-4 py-3 rounded-xl text-center bg-gray-50 text-gray-800 font-medium">
                Venue Explorer
              </Link>
            )}

            {!adminSession && !session && location.pathname !== '/admin-login' && (
              <Link to="/admin-login" className="block px-4 py-3 rounded-xl text-center bg-blue-50 text-blue-600 font-medium">
                Enter Passkey
              </Link>
            )}

            {/* Session Timer (Mobile) */}
            {adminSession && !session && (
              <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">Session Ends In</p>
                <p className="font-mono text-lg font-bold text-blue-700">{formatSessionTime(sessionTimeLeft)}</p>
              </div>
            )}

            {!session ? (
              location.pathname !== '/login' && adminSession && (
                <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl text-center text-red-500 font-medium bg-red-50">
                  Logout
                </button>
              ) || location.pathname !== '/login' && !adminSession && (
                <Link to="/login" className="block px-4 py-3 rounded-xl text-center bg-blue-600 text-white font-semibold">
                  Admin Login
                </Link>
              )
            ) : (
              <div className="space-y-3 pt-2">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Admin Tools</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={handleGenerateKey} disabled={generating} className="w-full py-3 px-4 rounded-xl bg-orange-50 text-orange-600 font-semibold text-center border border-orange-100">
                      {generating ? 'Generating...' : 'Generate New Passkey'}
                    </button>
                    {(session || adminSession) && location.pathname !== '/add-venue' && (
                      <Link to="/add-venue" className="block w-full py-3 px-4 rounded-xl bg-blue-50 text-blue-600 font-semibold text-center border border-blue-100">
                        + Add New Venue
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-semibold text-center">
                      Logout Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-apple-blue/20 selection:text-apple-blue">
        <Header />

        <main className="relative z-20 pt-8 pb-20">
          <Routes>
            <Route
              path="/"
              element={
                <PasskeyProtectedRoute>
                  <VenueList />
                </PasskeyProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/add-venue"
              element={
                <PasskeyProtectedRoute>
                  <VenueForm />
                </PasskeyProtectedRoute>
              }
            />
          </Routes>
        </main>

        <AdminPasskeyPanel />

        <footer className="py-10 text-center text-apple-text-secondary text-sm border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} Venue Manager. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
