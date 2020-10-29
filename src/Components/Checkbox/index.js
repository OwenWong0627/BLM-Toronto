import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', name, value, checked, onChange }) => (
   <li><label><input type={type} name={name} checked={checked} onChange={onChange} />{value}</label></li>
);

Checkbox.propTypes = {
   type: PropTypes.string,
   name: PropTypes.string.isRequired,
   value: PropTypes.string.isRequired,
   checked: PropTypes.bool.isRequired,
   onChange: PropTypes.func.isRequired,
}

export default Checkbox;
