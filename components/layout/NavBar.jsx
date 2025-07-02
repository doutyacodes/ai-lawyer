'use client';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, BookOpen, Home, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { isAuthenticated, getUserFromToken } from '@/lib/auth-client';

export default function NavBar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/auth-check", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          // User is authenticated
          setIsAuth(true);
          const userData = getUserFromToken(); // decode from JWT cookie
          setUser(userData);
        } else {
          // Not authenticated
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuth(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for changes in login/logout across tabs
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navigateTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // const handleLogout = () => {
  //   logout();
  //   setIsAuth(false);
  //   setUser(null);
  //   setIsUserMenuOpen(false);
  // };

  const handleAuthAction = (action) => {
    const currentPath = window.location.pathname;
    if (action === 'login') {
      navigateTo(`/auth/login${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`);
    } else {
      navigateTo(`/auth/signup${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-indigo-900 text-white shadow-2xl border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-56 h-auto cursor-pointer transition-transform duration-200 hover:scale-105" onClick={() => navigateTo('/')}>
              <Image
                src="/images/logo.png"
                alt="AI Lawyer Logo"
                width={220}
                height={60}
                className="object-contain filter drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </button>

              {isAuth && (
                <button
                  onClick={() => navigateTo('/saved-results')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                >
                  <BookOpen size={18} />
                  <span className="font-medium">Saved Results</span>
                </button>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuth ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30 transition-all duration-300 backdrop-blur-sm border border-indigo-400/30 hover:border-indigo-400/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-300">@{user?.username}</p>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                      <div className="p-4 border-b border-white/10">
                        <p className="font-medium text-white">{user?.name}</p>
                        <p className="text-sm text-gray-300">@{user?.username}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-500/20 transition-colors duration-200 text-red-300 hover:text-red-200"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )} */}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthAction('login')}
                    className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthAction('signup')}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <nav className="space-y-3">
              <button
                onClick={() => navigateTo('/')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </button>

              {isAuth && (
                <button
                  onClick={() => navigateTo('/saved-results')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-200"
                >
                  <BookOpen size={18} />
                  <span className="font-medium">Saved Results</span>
                </button>
              )}

              <div className="border-t border-white/10 pt-3 mt-3">
                {isAuth ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-300">@{user?.username}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl hover:bg-red-500/20 transition-colors duration-200 text-red-300"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAuthAction('login')}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 font-medium text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthAction('signup')}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 font-medium text-center shadow-lg"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </div>
  );
};