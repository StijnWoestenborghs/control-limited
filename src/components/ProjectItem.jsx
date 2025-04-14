import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProjectItem = ({ 
  title, 
  description, 
  technologies, 
  demoLink, 
  githubLink, 
  image,
  showStars = true
}) => {
  const [stars, setStars] = useState(null);
  const [showStarsState, setShowStarsState] = useState(showStars);

  useEffect(() => {
    if (githubLink && showStarsState) {
      // Extract owner and repo from GitHub URL
      const match = githubLink.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('GitHub API request failed');
            }
            return response.json();
          })
          .then(data => setStars(data.stargazers_count))
          .catch(error => {
            console.error('Error fetching GitHub stars:', error);
            setShowStarsState(false);
          });
      }
    }
  }, [githubLink, showStarsState]);

  return (
    <a 
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-xl bg-background transition-colors duration-300 hover:[background-color:var(--color-background-secondary)]"
    >
      {/* Image Container */}
      {image && (
        <div className="relative aspect-square w-3/4 mx-auto mt-4 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      {/* Content Container */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
        
        {/* Technologies Pills */}
        {technologies && technologies.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary skill"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-secondary mb-4">{description}</p>
        
        {/* Links */}
        <div className="flex space-x-4" onClick={(e) => e.stopPropagation()}>
          {demoLink && (
            <a 
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center"
            >
              <span className="mr-1">Demo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {githubLink && (
            <a 
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center"
            >
              <span className="mr-1">GitHub</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {showStarsState && stars !== null && (
                <span className="ml-2 text-sm">
                  • Stars: {stars.toLocaleString()} ⭐
                </span>
              )}
            </a>
          )}
        </div>
      </div>
    </a>
  );
};

ProjectItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  technologies: PropTypes.arrayOf(PropTypes.string),
  demoLink: PropTypes.string,
  githubLink: PropTypes.string,
  image: PropTypes.string,
  showStars: PropTypes.bool
};

export default ProjectItem; 