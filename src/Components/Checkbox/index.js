import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ name, checked, onChange }) => (
   <li><label><input type='checkbox' name={name} checked={checked} onChange={onChange} />{name}</label></li>
);

Checkbox.propTypes = {
   name: PropTypes.string.isRequired,
   checked: PropTypes.bool.isRequired,
   onChange: PropTypes.func.isRequired,
}

export default Checkbox;
