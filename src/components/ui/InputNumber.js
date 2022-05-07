import React from "react";
import PropTypes from "prop-types";
import Cleave from "cleave.js/react";

import classes from "./InputNumber.module.css";

const InputNumber = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <Cleave
        options={{ ...props.options, numericOnly: props.numericOnly === "no" ? false : true }}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        disabled={props.disabled}
        autoComplete="off"
      />
      <div className={classes.error}>{props.invalid && props.invalidMessage}</div>
    </div>
  );
};

InputNumber.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  options: PropTypes.object,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  numericOnly: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
};

export default InputNumber;
