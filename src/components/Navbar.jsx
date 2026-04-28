import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200 text-white">
              <BookOpen size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800">
              Flipnexa
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <a href="#" className="hover:text-indigo-600 transition-colors">Use Cases</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors hidden sm:block">Log in</Link>
            <Link to="/pricing" className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:shadow-xl active:scale-95">
              Try for free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
