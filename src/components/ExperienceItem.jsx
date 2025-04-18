import React from 'react';
import PropTypes from 'prop-types';

const ExperienceItem = ({
  dateFrom,
  dateTo,
  title,
  company,
  companyUrl,
  explanation,
  links,
  skills
}) => {
  const handleClick = () => {
    if (companyUrl) {
      window.open(companyUrl, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div 
      className={`group relative mb-12 grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 p-4 rounded-lg transition-colors cursor-pointer hover:[background-color:var(--color-background-secondary)] ${companyUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      role={companyUrl ? 'link' : 'article'}
      tabIndex={companyUrl ? 0 : undefined}
    >
      {/* Date - Moves to top on small screens */}
      <div className="text-sm text-secondary uppercase tracking-wider order-1 lg:order-none">
        {dateFrom} — <span className="hidden lg:inline"><br /></span> {dateTo || 'Present'}
      </div>

      {/* Right Column - Content */}
      <div className="order-2 lg:order-none">
        {/* Title and Company */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xl font-medium text-primary group-hover:[color:var(--color-primary)]">
            {title}
            {company && (
              <>
                <span className="mx-2">·</span>
                <span className="group-hover:[color:var(--color-primary)]">
                  {company}
                  {companyUrl && (
                    <svg className="w-4 h-4 ml-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </span>
              </>
            )}
          </h3>
        </div>

        {/* Explanation */}
        <p className="text-secondary mb-4 leading-relaxed">
          {explanation}
        </p>

        {/* Links */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover-primary inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full text-primary skill"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ExperienceItem.propTypes = {
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string,
  title: PropTypes.string.isRequired,
  company: PropTypes.string,
  companyUrl: PropTypes.string,
  explanation: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  skills: PropTypes.arrayOf(PropTypes.string)
};

export default ExperienceItem; 