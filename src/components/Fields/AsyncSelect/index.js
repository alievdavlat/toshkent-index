import React from "react";
import { get } from "lodash";
import { AsyncPaginate } from "react-select-async-paginate";
import api from '@/services/api';
import queryBuilder from '@/services/queryBuilder';
import PropTypes from "prop-types";
import cx from "classnames";

const ControllerAsyncSelect = ({
	loadOptionsUrl,
	loadOptionsParams,
	filterParams,
	loadOptionsKey,
	extraOptions,
	isSearchable,
	isClearable,
	isDisabled,
	placeholder = "Select...",
	optionLabel,
	optionValue,
	label,
	className,
	options,
	isMulti,
	message = "Required",
	menuPlacement,
	field,
	form: { errors, setFieldValue, setFieldTouched, touched }
}) => {
	const loadOptions = async (searchQuery, prevOptions, { page }) => {
		const { data } = await api.get(
			queryBuilder(loadOptionsUrl, {
				page,
				filter: filterParams,
				...loadOptionsParams(searchQuery)
			})
		);

		return {
			options: loadOptionsKey
				? typeof loadOptionsKey === "function"
					? [...extraOptions, ...loadOptionsKey(get(data, "data"))]
					: [...extraOptions, ...get(data, "data", [])]
				: get(data, "data"),
			hasMore: get(data, "current_page", 1) < get(data, "last_page", 1),
			additional: { page: get(data, "current_page", 1) + 1 }
		};
	};
	const classNames = cx("field-container async-field", field.name && touched[field.name] && errors[field.name] && "has-error", className);

	const customStyles = {
		menu: props => ({
			...props,
			zIndex: 10
		}),
		control: props => ({
			...props,
			height: "100%",
			minHeight: '64px',
			curor: 'pointer',
			boxShadow: "",
			borderRadius: "35px",
			border: field.value ? "" : touched[field.name] && errors[field.name] && "1px solid transparent",
			"&:hover": {
				borderColor: !field.value && touched[field.name] && errors[field.name] ? "transparent" : "transparent",
				borderInlineEndWidth: 1
			}
		}),
		placeholder: props => ({
			...props,
			color: "#bfbfbf",
			fontWeight: 500
		}),
		singleValue: props => ({
			...props,
			fontWeight: 500
		}),
		option: props => ({
			...props,
			fontWeight: 500
		})
	};
	return (
		<div className={`${classNames}`}>
			{label && (
				<label className="block text-sm text-secondary-main mb-3" htmlFor={field.name}>
					{label}
				</label>
			)}
			<AsyncPaginate
				className={`custom-react-select ${className}`}
				classNamePrefix={className}
				id={field.name}
				key={field.name}
				name={field.name}
				loadOptions={loadOptions}
				debounceTimeout={300}
				styles={customStyles}
				value={field.value}
				onBlur={() => setFieldTouched(field.name, true)}
				getOptionLabel={option => (typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel])}
				getOptionValue={option => (typeof optionValue === "function" ? optionValue(option) : option[optionValue])}
				onChange={option => {
					setFieldValue(field.name, option);
				}}
				noOptionsMessage={() => "No results found"}
				isSearchable={isSearchable}
				isClearable={isClearable}
				isDisabled={isDisabled}
				placeholder={placeholder}
				additional={{
					page: 1
				}}
				{...{ isMulti, options, placeholder, isSearchable, menuPlacement }}
			/>
			{field.value ? "" : touched[field.name] && errors[field.name] && <small className="async-select__error">{message}</small>}
		</div>
	);
};
ControllerAsyncSelect.propTypes = {
	isSearchable: PropTypes.bool,
	isClearable: PropTypes.bool,
	isDisabled: PropTypes.bool,
	loadOptionsParams: PropTypes.func,
	onChange: PropTypes.func
};
ControllerAsyncSelect.defaultProps = {
	optionValue: "id"
};

export default ControllerAsyncSelect;
