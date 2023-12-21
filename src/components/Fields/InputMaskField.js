import React from "react";

import PropTypes from "prop-types";
import cx from "classnames";
import InputMask from "react-input-mask";

const Text = ({ className, customclass='', label, placeholder, disabled, readOnly, type, mask, field, form: { touched, errors }, ...props }) => {
	const classes = cx(
		"form-field ant-form-item-control",
		touched[field.name] && !Boolean(field.value) ? "has-error" : errors[field.name] && "has-error",
		className
	);
	return (
		<div className="ant-row ant-form-item">
			<div className={classes}>
				{label && <label className="ant-label block text-sm text-secondary-main mb-3">{label}</label>}
				<InputMask
					{...field}
					{...props}
					disabled={disabled}
					formatChars={{
						"9": "[0-9]",
						a: "[0-9]",
						b: "[0-2]",
						c: "[0-5]",
						A: "[A-Z]"
					}}
					className={`w100 form-field__input ant-input ant-input-lg input-mask h-14 rounded-xl w-full ${customclass} ${touched[field.name] && !Boolean(field.value) ? 'mask-error': ''}`}
					mask={mask}
					type={type}
					placeholder={placeholder}
					readOnly={readOnly}
					name={field.name}
					value={field.value}
				/>
				{/* {touched[field.name] && !Boolean(field.value) ? (
					<div className="form-field__error ant-form-explain" style={{color: '#FF4D4F', fontSize: '12px', borderColor: '#FF4D4F'}}>{"Required"}</div>
				) : null} */}
			</div>
		</div>
	);
};

Text.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.oneOf(["text", "password"]),
	className: PropTypes.string,
	mask: PropTypes.string,
	disabled: PropTypes.bool
};

Text.defaultProps = {
	label: "",
	placeholder: "",
	type: "text",
	className: null,
	mask: "+999999999999",
	disabled: false
};

export default Text;
