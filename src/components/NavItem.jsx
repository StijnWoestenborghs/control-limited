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
            bg-primary 
            transition-all 
            duration-300 
            ${isActive ? 'w-6' : 'w-4'} 
            nav-line
          `}
        />
        {children}
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