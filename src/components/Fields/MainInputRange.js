import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import {useTranslation} from "react-i18next";
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
import helpers from "@/services/helpers";

const InputMain = ({
                       className,
                       label,
                       placeholder,
                       min,
                       max,
                       field,
                       customValue,
                       draggableTrack,
                       form: {touched, errors, setFieldValue},
                       ...props
                   }) => {
    InputMain.propTypes = {
        label: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        customValue: PropTypes.string,
        draggableTrack: PropTypes.bool,
    };

    InputMain.defaultProps = {
        label: "",
        placeholder: "",
        className: null,
        min: 0,
        max: 100,
        customValue: '',
        draggableTrack: false
    };

    const classes = cx(
        "mod-main-input",
        "mod-main-input-range",
        className
    );

    const {t} = useTranslation("main");

    return (
        <div className={classes}>
            {/* {label && <div className='mod-main-input__label'>{label}</div>} */}

            <div className="input-range__wrap">
                <InputRange
                    draggableTrack={draggableTrack}
                    maxValue={max}
                    minValue={min}
                    value={field.value}
                    onChange={value => {
                        setFieldValue(field.name, value)
                    }}/>
            </div>

            <input
                disabled={true}
                className="mod-main-input__input"
                value={customValue ? customValue : helpers.convertToReadable(field.value)}
                {...{placeholder}}
                {...props}
            />

            {touched[field.name] && errors[field.name] && (
                <span className="mod-main-input__error">
					{t(errors[field.name])}
				</span>
            )}
        </div>
    );
};

export default InputMain;
