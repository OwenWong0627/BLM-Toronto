import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large'];

/**
 * Component for the button in the navbar(it will not appear in small screen widths).
 * The component will take in two required props: label for the text in the button and type for the type of the button tag
 */
export const Button = ({
   label,
   type,
   onClick,
   buttonStyle,
   buttonSize
}) => {
   const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

   const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

   return (
      <Link to='/find-business' data-testid="button-link">
         <button
            data-testid="button"
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
         >
            {label}
         </button>
      </Link>
   )
};

/**
 * propType Documentation
 */
Button.propTypes = {
   label: PropTypes.string.isRequired,
   type: PropTypes.string.isRequired,
   onClick: PropTypes.func,
   buttonStyle: PropTypes.string,
   buttonSize: PropTypes.string,
}

export default Button;
