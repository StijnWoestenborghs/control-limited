import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { Link } from 'react-router-dom';

function Footer() {
    const markdown = `
Copyright © All Rights Reserved  
Made with :black_heart:
    `;

    return (
        <>
            <hr className="border-gray-200 mt-8" />
            <footer className="bg-white p-4">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-black">
                        <img src={`/icons/ctrl-logo.svg`} alt="Home" className="w-10 h-10" />
                        <span>Control</span>
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-10 mt-4 md:mt-0">
                        <div className="flex items-center space-x-2">
                            <img src={`/icons/phone-icon.svg`} alt="Phone" className="w-6 h-6" />
                            <span className="text-gray-600">+46703010064</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <img src={`/icons/email-icon.svg`} alt="Mail" className="w-6 h-6" />
                            <span className="text-gray-600">stijn.woestenborghs@live.be</span>
                        </div>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/in/stijnwoestenborghs/" target="_blank" rel="noopener noreferrer">
                                <img src={`/icons/linkedin-logo.svg`} alt="LinkedIn" className="w-10 h-10" />
                            </a>
                            <a href="https://github.com/StijnWoestenborghs" target="_blank" rel="noopener noreferrer">
                                <img src={`/icons/github-logo.svg`} alt="GitHub" className="w-10 h-10" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto mt-4 md:mt-6 text-center">
                    <div className="text-gray-600 text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
