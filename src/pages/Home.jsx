import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from '../components/BlogPost';
import NavItem from '../components/NavItem';
import ProjectItem from '../components/ProjectItem';
import ExperienceItem from '../components/ExperienceItem';
import FooterLinks from '../components/FooterLinks';
import { blogIds } from '../constants';
import '../styles/theme.css';

function Home() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('about');

    const [blogs, setBlogs] = useState([]);

    async function fetchJson(filePath) {
        const response = await fetch(filePath);
        const json = await response.json();
        return json;
    }

    useEffect(() => {
      const fetchMetadata = async () => {
        const blogData = await Promise.all(
          blogIds.map(async id => {
            const metadata = await fetchJson(`./blogs/${id}/metadata.json`);
            return { id, ...metadata };
          })
        );
        setBlogs(blogData);
      };
  
      fetchMetadata();
    }, []);

    useEffect(() => {
        // Check system preference on mount
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Add scroll event listener for section tracking
        const handleScroll = () => {
            const sections = ['about', 'experience', 'blog', 'projects'];
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageBottom = document.documentElement.scrollHeight;
            
            // If we're at the bottom of the page, activate the last section
            if (Math.abs(scrollPosition - pageBottom) < 50) {
                setActiveSection(sections[sections.length - 1]);
                return;
            }

            // Otherwise find the current section based on scroll position
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top + window.scrollY;
                    if (window.scrollY >= sectionTop - 100) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };

        // Add click handlers for smooth scrolling
        const handleNavClick = (e, sectionId) => {
            e.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                const yOffset = -50; // Offset to account for any fixed headers
                const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                setActiveSection(sectionId);
            }
        };

        // Add click handlers to nav items
        const navItems = document.querySelectorAll('nav a');
        navItems.forEach(item => {
            const sectionId = item.getAttribute('href').substring(1);
            item.addEventListener('click', (e) => handleNavClick(e, sectionId));
        });

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to set initial active section

        return () => {
            window.removeEventListener('scroll', handleScroll);
            navItems.forEach(item => {
                const sectionId = item.getAttribute('href').substring(1);
                item.removeEventListener('click', (e) => handleNavClick(e, sectionId));
            });
        };
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
                            <p className="text-secondary mb-8 max-w-sm">
                                I design complex algorithms and make them run on tiny devices.
                                I like to think about a great user experience.
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
                        <FooterLinks darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                </div>

                {/* Right Column - Scrollable */}
                <div className="w-full lg:w-2/3 lg:ml-[33.333333%] p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
                    {/* About Section */}
                    <section id="about" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Hello World!
                            <img src="./assets/waving_hand_animated.gif" alt="wave" className="w-9 h-9 ml-1 inline" />
                        </h2>
                        <p className="text-secondary">
                            Perhaps you agree that it is the task of an engineer to perceive, understand and <span className="font-bold text-primary">control</span> his environment. However, reality remains unpredictable, noisy and full of unexpected influences. So how can we manipulate a system to <span className="font-bold text-primary">the best of our ability</span>? An interesting question with many answers.
                        </p>
                        <br />
                        <p className="text-secondary">
                            My name is <a href="https://www.linkedin.com/in/stijnwoestenborghs/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover-primary">Stijn Woestenborghs</a>. I am an engineer at <span className="font-bold text-primary">Sony</span> with a MSc in Control Engineering and Automation. I am genuinely passionate about the myriad of advanced technologies that exist today and I get excited to see how they affect the lives of others.
                        </p>
                        <br />
                        <p className="text-secondary">
                            With this site I would like to share with you what I have learned or what inspires me. I want to touch upon the subjects that interest me most and go deep into the implementation that lies at the core of a solution.
                        </p>
                        <br />
                        <p className="text-secondary">
                            After all, something remains just a theory before it gets actually <span className="font-bold text-primary">deployed</span>. 🚀
                        </p>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-primary">Experience</h2>
                        <div className="space-y-8">
                            <ExperienceItem
                                dateFrom="APR 2023"
                                title="Embedded Software Engineer (ML)"
                                company="Sony"
                                companyUrl="https://www.sony.com"
                                explanation="Computer Vision application development on the Sony IMX500 AI Accelerator chip. IMX500 integration on various devices like the Raspberry Pi OS. Main contributor of an SDK that allows AI model, model compilation and application development on IMX500 supported devices. Building no/low code tooling (React) allowing exploration of the IMX500 capabilities."
                                links={[
                                    { label: "Modlib", url: "https://developer.aitrios.sony-semicon.com/en/raspberrypi-ai-camera" },
                                    { label: "Raspberry Pi Ai Camera", url: "https://www.raspberrypi.com/products/ai-camera/" }
                                ]}
                                skills={["Python", "C++", "TensorFlow", "PyTorch", "ARM", "CUDA", "React", "TailwindCSS", "Embedded", "MQTT"]}
                            />
                            <ExperienceItem
                                dateFrom="NOV 2021"
                                dateTo="FEB 2023"
                                title="Embedded Software Engineer"
                                company="In The Pocket"
                                companyUrl="https://www.inthepocket.com/"
                                explanation="Embedded development of an Edge Computing Platform (Homehub). Integration of middleware communication protocols. Development & integration of platform applications layers and OTA updates system. Integration of CICD setup & DevOps platform."
                                links={[
                                    { label: "Homehub", url: "https://www.daikin.be/nl_be/producten/product.html/EKRHH.html" }
                                ]}
                                skills={["ROS2", "DDS", "MQTT", "HTTP", "C++", "Python", "Golang", "Gitlab CI/CD", "Docker", "AWS", "Embedded"]}
                            />
                            <ExperienceItem
                                dateFrom="FEB 2021"
                                dateTo="NOV 2021"
                                title="Machine Learning & Optimization Engineer"
                                company="In The Pocket"
                                companyUrl="https://www.inthepocket.com/"
                                explanation="(Advanced Development) Household energy optimization for HVAC Systems: R&D of a Model Predictive Controller (MPC) combined with additional AI models & predictions. Controller development and implementation for field site validation. Proof of Concept: Reinforcement Learning as a controller for HVAC Systems."
                                skills={["Python", "C++", "MATLAB/Simulink", "TensorFlow", "PyTorch", "CUDA", "Reinforcement Learning", "MPC"]}
                            />
                            <ExperienceItem
                                dateFrom="JUL 2020"
                                dateTo="JUN 2021"
                                title="Reinforcement Learning: Sim to Real transfer in Mechatronic Systems."
                                company="Ghent University"
                                companyUrl="https://www.ugent.be/en"
                                explanation="Training and fine-tuning of multiple Reinforcement Learning Algorithms with customization of OpenAI Gym environments. Implementation of Domain Randomization. Research, implementation and validation of Adaptive Domain Randomization."
                                skills={["Python", "C++", "TensorFlow", "PyTorch", "CUDA", "Reinforcement Learning", "MPC", "Mechatronics"]}
                            />
                        </div>
                    </section>

                    {/* Blog Section */}
                    <section id="blog" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Blog Posts</h2>
                        <div className="mt-8" id="blog-posts">
                            {blogs.map((blog, index) => (
                                <React.Fragment key={index}>
                                    <BlogPost
                                        id={blog.id}
                                        date={blog.date}
                                        topic={blog.topic}
                                        title={blog.title}
                                        shortIntro={blog.shortIntro}
                                        image={blog.image}
                                    />
            
                                </React.Fragment>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="mb-16">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Featured Projects</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <ProjectItem
                                title="Basalt"
                                description="A Machine Learning framework from scratch in Pure Mojo 🔥"
                                technologies={["AI", "ML", "Mojo", "Autograd", "Neural Networks"]}
                                githubLink="https://github.com/basalt-org/basalt"
                                image="./assets/basalt.png"
                            />
                            <ProjectItem
                                title="Gradi Mojo"
                                description="Language performance evaluation on a simple gradient descent problem."
                                technologies={["Python", "Numpy", "Jax", "C++", "Mojo"]}
                                githubLink="https://github.com/StijnWoestenborghs/gradi-mojo"
                                image="./blogs/mojo-does-give-superpowers/flame-icon.png"
                            />
                            <ProjectItem
                                title="Control"
                                description="Personal website to share my experiences, blogs and projects."
                                technologies={["React", "TailwindCSS", "JavaScript", "Vite"]}
                                demoLink="https://control.limited/"
                                githubLink="https://github.com/StijnWoestenborghs/control-limited"
                                image="./assets/ctrl-logo.png"
                                showStars={false}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;