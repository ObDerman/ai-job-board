import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import React from 'react';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';

// Navigation Component
function Navigation() {
    const location = useLocation();

    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold gradient-text">منصة التوظيف الذكية</span>
                </Link>

                <div className="flex gap-2">
                    <Link
                        to="/"
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all ${location.pathname === '/'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        تسجيل مرشح
                    </Link>
                    <Link
                        to="/search"
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all ${location.pathname === '/search'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        البحث بالذكاء الاصطناعي
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen text-white">
                <Navigation />
                <main className="pt-24 pb-12 px-4">
                    <Routes>
                        <Route path="/" element={<RegisterPage />} />
                        <Route path="/search" element={<SearchPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
