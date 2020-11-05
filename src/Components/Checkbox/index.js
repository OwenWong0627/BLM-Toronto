import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component represents each checkbox in the sidebar of the map page
 * This component will take in three props: where the name is the 'identifier' of the checkbox
 * The checked prop will monitor whether the checkbox will be checked or not
 * The onChange function prop will determine what happens when the checkbox is checked/unchecked
 */
const Checkbox = ({ name, checked, onChange }) => (
   <li><label><input
      data-testid="checkbox"
      type='checkbox'
      name={name}
      checked={checked}
      onChange={onChange}
   />
      {name}
   </label></li>
);

/**
 * propType Documentation
 */
Checkbox.propTypes = {
   name: PropTypes.string.isRequired,
   checked: PropTypes.bool.isRequired,
   onChange: PropTypes.func.isRequired,
}

export default Checkbox;
