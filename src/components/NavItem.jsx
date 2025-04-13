import React from 'react';
import PropTypes from 'prop-types';
import '../styles/theme.css';

const NavItem = ({ href, children, isActive }) => {
  return (
    <div className="nav-item-container relative group">
      <a 
        href={href} 
        className={`
          block 
          pl-8 
          relative
          ${isActive ? '[color:var(--color-primary)] font-medium' : '[color:var(--color-text)] group-hover:[color:var(--color-primary)] group-hover:font-medium'}
        `}
      >
        <div 
          className={`
            absolute 
            left-0 
            top-1/2 
            -translate-y-1/2 
            h-[2px]  
            duration-300 
            ${isActive ? 'w-8 [background-color:var(--color-primary)]' : 'w-4 [background-color:var(--color-text)] group-hover:w-8 group-hover:[background-color:var(--color-primary)]'} 
            nav-line
          `}
        />
        <span className={`block duration-300 ${isActive ? 'translate-x-4' : 'group-hover:translate-x-4'}`}>
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