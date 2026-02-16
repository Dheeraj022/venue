import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VenueForm from './components/VenueForm';
import { VenueList } from './components/VenueList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './supabaseClient';

// Header component to handle navigation state highlighting
const Header = () => {
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 cursor-pointer">
          Venue Manager
        </Link>

        <div className="flex items-center gap-4">
          {/* Show 'Back to List' on specific pages */}
          {(location.pathname === '/add-venue' || location.pathname === '/login') && (
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Back to List
            </Link>
          )}

          {/* Auth Buttons */}
          {!session ? (
            location.pathname !== '/login' && (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
            )
          ) : (
            <>
              {/* Show Add Venue only if logged in and not already on the page */}
              {location.pathname !== '/add-venue' && (
                <Link
                  to="/add-venue"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  + Add Venue
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
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
            <Route path="/" element={<VenueList />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/add-venue"
              element={
                <ProtectedRoute>
                  <VenueForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="py-10 text-center text-apple-text-secondary text-sm border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} Premium Properties. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
