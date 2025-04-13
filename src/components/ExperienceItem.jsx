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
  return (
    <div className="group relative mb-12">
      {/* Date */}
      <div className="text-sm text-secondary/80 mb-1 uppercase tracking-wider">
        {dateFrom} — {dateTo || 'Present'}
      </div>

      {/* Title and Company */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-medium text-primary">
          {title}
          {company && (
            <>
              <span className="mx-2">·</span>
              {companyUrl ? (
                <a
                  href={companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary/80 transition-colors inline-flex items-center"
                >
                  {company}
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span>{company}</span>
              )}
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
              className="text-primary hover:text-primary/80 transition-colors inline-flex items-center"
            >
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
              className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary/90"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
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