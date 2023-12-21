import React  from "react";

import PropTypes from "prop-types";
import cx from 'classnames';
import {DatePicker} from 'antd';

const AntDatePicker = ({ className, label, placeholder, onChange, disabled, field, customclass, form: { touched, errors }, ...props }) => {

  const classes = cx(
    'form-field ant-form-item',
    touched[field.name] && errors[field.name] && 'has-error',
    className
  );

  return (
      <div className={classes}>
        {label && (
          <label className="form-field__label ant-label mb-5">{label}</label>
        )}
        <DatePicker
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          value={field.value ? field.value : null}
          customclass={customclass}
          {...props}
        />
        {touched[field.name] && errors[field.name] && (
          <div className="form-field__error ant-form-explain">{errors[field.name]}</div>
        )}
      </div>
  );
};

AntDatePicker.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

AntDatePicker.defaultProps = {
  label: "",
  placeholder: "",
  className: null,
  disabled: false
};

export default AntDatePicker;

