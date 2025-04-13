import React from 'react';
import PropTypes from 'prop-types';
import '../styles/theme.css';

const NavItem = ({ href, children, isActive }) => {
  return (
    <div className="nav-item-container relative">
      <a 
        href={href} 
        className={`
          block 
          hover-primary 
          transition-colors 
          pl-8 
          relative
          ${isActive ? 'text-primary font-medium' : 'text-secondary'}
        `}
      >
        <div 
          className={`
            absolute 
            left-0 
            top-1/2 
            -translate-y-1/2 
            h-[2px] 
            transition-all 
            duration-300 
            ${isActive ? 'w-8 [background-color:var(--color-text)]' : 'w-4 [background-color:var(--color-text-secondary)] hover:[background-color:var(--color-text)]'} 
            nav-line
          `}
        />
        <span className={`block transition-transform duration-300 ${isActive ? 'translate-x-4' : ''}`}>
          {children}
        </span>
      </a>
    </div>
  );
};

NavItem.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
};

NavItem.defaultProps = {
  isActive: false,
};

export default NavItem; 