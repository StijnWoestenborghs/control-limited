import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

function FooterLinks({ darkMode, toggleDarkMode }) {
    return (
        <div>
            {/* Dark Mode Toggle */}
            <div className="flex items-center mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                    />
                    <div className="w-16 h-8 peer-focus:outline-none rounded-full peer-checked:after:translate-x-[2rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <MoonIcon className={`absolute left-1 top-1 h-5 w-5 ${darkMode ? 'text-black' : 'text-white'}`} />
                        <SunIcon className={`absolute right-1 top-1 h-5 w-5 ${darkMode ? 'text-black' : 'text-white'}`} />
                    </div>
                </label>
            </div>

            <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                   className="text-secondary hover-primary">
                    GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="text-secondary hover-primary">
                    LinkedIn
                </a>
                <a href="mailto:your@email.com"
                   className="text-secondary hover-primary">
                    Email
                </a>
            </div>
        </div>
    );
}

export default FooterLinks; 