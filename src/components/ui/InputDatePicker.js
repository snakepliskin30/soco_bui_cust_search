import React, { useEffect } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import classes from "./InputDatePicker.module.css";

const InputDatePicker = (props) => {
  useEffect(() => {
    $(`#${props.id}`).datepicker();
  }, []);

  return (
    <div>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <input
        id={props.id}
        type={props.type ? props.type : "text"}
        autoComplete="off"
      />
      <div className={classes.error}>
        {props.invalid && props.invalidMessage}
      </div>
    </div>
  );
};

InputDatePicker.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
};

export default InputDatePicker;
