import React, { forwardRef, forwardedRef } from "react";
import { DatePicker, Form, Input, InputNumber, Radio, Select, TimePicker, TreeSelect } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

// eslint-disable-next-line react/display-name
const CreateAntField = AntComponent => ({
	field,
	form,
	hasFeedback,
	label,
	selectOptions,
	submitCount,
	type,
	style,
	message = "required",
	onChange,
	size = "large",
	autoComplete = "off",
	placeholder,
	containerClass = "",
	formItemClassName,
	min,
	max,
	className,
	customclass = "",
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
				// rules={[
				// 	{
				// 		message: "dfsdfsdf"
				// 	}
				// ]}
				validateStatus={touchedError ? "error" : "success"}
				{...{ style }}>
				{label && <div className="ant-label block text-sm text-secondary-main mb-3">{label}</div>}
				<AntComponent
					{...field}
					{...props}
					{...{ type, defaultValue: field.value }}
					size={size}
					autoComplete={autoComplete}
					placeholder={placeholder}
					onBlur={onBlur}
					// autoSize={AntComponent === Input.TextArea ? { minRows: 3, maxRows: 5 } : false}
					// {AntComponent===Input.TextArea && autoSize={{minRows:5, maxRows:7}}}
					min={min ? min : type === "number" ? 0 : min}
					max={max}
					className={`h-14 rounded-xl ${customclass}`}
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
							<Option key={option.value} value={option.value}>
								{option.name}
							</Option>
						))}
				</AntComponent>
			</FormItem>
		</div>
	);
};

export const AntSelect = CreateAntField(Select);
export const AntInput = CreateAntField(Input);
export const AntInputNumber = CreateAntField(InputNumber);
export const AntTextarea = CreateAntField(Input.TextArea);
export const AntRadio = CreateAntField(Radio);
export const AntTreeSelect = CreateAntField(TreeSelect);
export const AntPassword = CreateAntField(Input.Password);
export const AntTimePicker = CreateAntField(TimePicker);
export const AntRangePicker = CreateAntField(RangePicker);
