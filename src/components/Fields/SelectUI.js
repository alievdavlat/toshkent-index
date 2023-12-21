import { Select, Form, Space } from "antd";

import React from "react";
import Image from 'next/image';

const { Option } = Select;
const FormItem = Form.Item;

const SelectUI = ({ 
	field,
	form,
	hasFeedback,
	label,
	selectOptions,
	submitCount,
	type,
	style,
	message = "Требуется ввод",
	onChange,
	size = "large",
	autoComplete = "off",
	placeholder,
	containerClass = "",
	formItemClassName,
	customclass = "",
	min,
	max,
	className,
	...props
}) => {
	const touched = form.touched[field.name];
	const submitted = submitCount > 0;
	const hasError = form.errors[field.name];
	const touchedError = hasError && touched;
	const errorMessage = form.errors[field.name];
	const onInputChange = ({ target: { value } }) => form.setFieldValue(field.name, value);
	const onChangeInner = value => form.setFieldValue(field.name, value);
	const onBlur = () => form.setFieldTouched(field.name, true);
	return (
		<div className={`field-container ${containerClass}`}>
			<FormItem
				label={false}
				className={formItemClassName}
				hasFeedback={(hasFeedback && submitted) || (hasFeedback && touched) ? true : false}
				help={touchedError ? errorMessage : false}

				validateStatus={touchedError ? "error" : "success"}
				{...{ style }}>
				{label && <div className="ant-label block text-sm text-secondary-main mb-3">{label}</div>}
				<Select
					{...field}
					{...props}
					{...{ type, defaultValue: field.value }}
					size={size}
					autoComplete={autoComplete}
					placeholder={placeholder}
					onBlur={onBlur}
					min={min ? min : type === "number" ? 0 : min}
					max={max}
					className={`h-14 rounded-xl ${customclass}`}
					optionLabelProp="label"
					onKeyDown={e => {
						if (
							type === "number" &&
							(e.code === "Minus" ||
								e.code === "NumpadSubtract" ||
								e.code === "NumpadAdd" ||
								e.code === "NumpadDecimal" ||
								e.code === "Period" ||
								e.code === "KeyE")
						) {
							e.preventDefault();
						}
					}}
					onChange={onChange ? onChange : type ? onInputChange : onChangeInner}>
					{selectOptions &&
						selectOptions.map(option => (
							<Option key={option.value} value={option.value} label={option.name}>
								<div className='custom-select'>
									<div className='custom-select-img' role="img" aria-label={option.name}>
										<Image src={option.src} width={114} height={40} alt={option.name} />
									</div>
									{option.name}
								</div>
							</Option>
						))}
				</Select>
			</FormItem>
		</div>
	);
};

export default SelectUI;
