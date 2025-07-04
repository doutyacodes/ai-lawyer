'use client';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Menu, X, User, Phone, BookOpen, Home, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { isAuthenticated, getUserFromToken } from '@/lib/auth-client';

export default function NavBar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  };

  const handleContact = () => {
    window.open('tel:+916361400800', '_self');
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-indigo-900 text-white shadow-2xl border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center lg:justify-between">
          {/* Logo Section - Centered on mobile */}
          <div className="flex items-center space-x-4 lg:flex-none flex-1 lg:flex-initial justify-center lg:justify-start">
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
                onClick={handleContact}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <Phone size={18} />
                <span className="font-medium"> +91 6361400800</span>
              </button>

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
                onClick={handleContact}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                <Phone size={18} />
                <span className="font-medium">+91 6361400800</span>
              </button>

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
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};