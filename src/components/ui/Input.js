import React from "react";
import PropTypes from "prop-types";

import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <input
        id={props.id}
        type={props.type ? props.type : "text"}
        maxLength={props.length ? props.length : ""}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        disabled={props.disabled}
        autoComplete="off"
      />
      <div className={classes.error}>
        {props.invalid && props.invalidMessage}
      </div>
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  length: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
};

export default Input;
