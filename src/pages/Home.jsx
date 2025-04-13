import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from '../components/BlogPost';
import NavItem from '../components/NavItem';
import ProjectItem from '../components/ProjectItem';
import ExperienceItem from '../components/ExperienceItem';
import { blogIds } from '../constants';
import '../styles/theme.css';

function Home() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        // Check system preference on mount
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Add scroll event listener for section tracking
        const handleScroll = () => {
            const sections = ['about', 'experience', 'blog', 'projects'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            
            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
                                <NavItem href="#about" isActive={activeSection === 'about'}>About</NavItem>
                                <NavItem href="#experience" isActive={activeSection === 'experience'}>Experience</NavItem>
                                <NavItem href="#blog" isActive={activeSection === 'blog'}>Blog</NavItem>
                                <NavItem href="#projects" isActive={activeSection === 'projects'}>Projects</NavItem>
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
                        <h2 className="text-2xl font-bold mb-8 text-primary">Experience</h2>
                        <div className="space-y-8">
                            <ExperienceItem
                                dateFrom="JULY 2017"
                                dateTo="DEC 2017"
                                title="UI Engineer Co-op"
                                company="Apple"
                                companyUrl="https://www.apple.com"
                                explanation="Developed and styled interactive web apps for Apple Music, including the user interface of Apple Music's embeddable web player widget for in-browser user authorization and full song playback."
                                links={[
                                    { label: "MusicKit.js", url: "https://developer.apple.com/documentation/musickitjs" },
                                    { label: "9to5Mac", url: "https://9to5mac.com" },
                                    { label: "The Verge", url: "https://www.theverge.com" }
                                ]}
                                skills={["Ember", "SCSS", "JavaScript", "MusicKit.js"]}
                            />
                            <ExperienceItem
                                dateFrom="JAN 2023"
                                title="ML & Embedded Software Engineer"
                                company="Sony"
                                companyUrl="https://www.sony.com"
                                explanation="Design and implementation of machine learning algorithms for embedded systems, focusing on optimization and real-time performance."
                                skills={["Python", "C++", "TensorFlow", "PyTorch", "ARM", "CUDA"]}
                            />
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
                            <ProjectItem
                                title="Control Limited"
                                description="A modern control engineering portfolio showcasing advanced algorithms and embedded systems development."
                                technologies={["React", "TailwindCSS", "Control Theory", "Embedded Systems"]}
                                githubLink="https://github.com/yourusername/control-limited"
                                demoLink="https://control-limited.com"
                                image="/images/control-project.jpg"
                            />
                            <ProjectItem
                                title="Embedded ML Pipeline"
                                description="Implementation of machine learning algorithms optimized for resource-constrained embedded devices."
                                technologies={["Python", "C++", "TensorFlow Lite", "ARM Cortex-M"]}
                                githubLink="https://github.com/yourusername/embedded-ml"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;