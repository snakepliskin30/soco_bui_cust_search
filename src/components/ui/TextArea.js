import React from "react";
import PropTypes from "prop-types";

import classes from "./TextArea.module.css";

const TextArea = (props) => {
  return (
    <div>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <textarea id={props.id} rows="4" cols="50" />
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  label: PropTypes.string.isRequired,
};

export default TextArea;
