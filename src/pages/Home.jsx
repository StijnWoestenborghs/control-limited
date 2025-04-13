import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from '../components/BlogPost';
import { blogIds } from '../constants';
import '../styles/theme.css';

function Home() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference on mount
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
    };

    return (
        <div className="min-h-screen bg-primary">
            <div className="flex flex-col lg:flex-row max-w-[2400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32">
                {/* Left Column - Static */}
                <div className="w-full lg:w-1/3 lg:fixed lg:h-screen p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
                    <div className="h-full flex flex-col justify-between">
                        {/* Profile Section */}
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-primary">Stijn Woestenborghs</h1>
                            <p className="text-xl mb-6 text-primary">ML & Embedded Software Engineer</p>
                            <p className="text-secondary mb-8">
                                I design complex algorithms and make them run on tiny devices.
                                I like to think about the human interaction and a great user experiences.
                            </p>

                            {/* Navigation */}
                            <nav className="space-y-4">
                                <a href="#about" className="block hover-primary transition-colors">About</a>
                                <a href="#experience" className="block hover-primary transition-colors">Experience</a>
                                <a href="#blog" className="block hover-primary transition-colors">Blog</a>
                                <a href="#projects" className="block hover-primary transition-colors">Projects</a>
                            </nav>
                        </div>

                        {/* Footer with Contact Links */}
                        <div>
                            <div className="flex space-x-4 mb-4">
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

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="px-4 py-2 rounded-md button-primary transition-colors"
                            >
                                {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Scrollable */}
                <div className="w-full lg:w-2/3 lg:ml-[33.333333%] p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
                    {/* About Section */}
                    <section id="about" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Hello World!</h2>
                        <p className="text-secondary">
                            Perhaps you agree that it is the task of an engineer to perceive, understand and control his environment. However, reality remains unpredictable, noisy and full of unexpected influences. So how can we manipulate a system to the best of our ability? An interesting question with many answers.
                        </p>
                        <br />
                        <p className="text-secondary">
                            My name is Stijn Woestenborghs. I am an engineer at Sony with a MSc in Control Engineering and Automation. I am genuinely passionate about the myriad of advanced technologies that exist today and I get excited to see how they affect the lives of others.
                        </p>
                        <br />
                        <p className="text-secondary">
                            With this site I would like to share with you what I have learned or what inspires me. I want to touch upon the subjects that interest me most and go deep into the implementation that lies at the core of a solution.
                        </p>
                        <br />
                        <p className="text-secondary">
                            After all, something remains just a theory before it gets actually deployed. 🚀
                        </p>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Experience</h2>
                        <div className="space-y-8">
                            <div className="border-l-2 border-primary pl-4">
                                <h3 className="text-xl font-bold text-primary">Senior Frontend Engineer</h3>
                                <p className="text-secondary">Company Name • 2020 - Present</p>
                                <p className="mt-2 text-primary">Description of your role and achievements</p>
                            </div>
                        </div>
                    </section>

                    {/* Blog Section */}
                    <section id="blog" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Latest Posts</h2>
                        <div className="space-y-6">
                            {/* Blog posts will be mapped here */}
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Featured Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-primary rounded-lg p-4 bg-secondary">
                                <h3 className="text-xl font-bold mb-2 text-primary">Project Name</h3>
                                <p className="text-secondary mb-4">
                                    Brief description of the project
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="hover-primary">Demo</a>
                                    <a href="#" className="hover-primary">GitHub</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;