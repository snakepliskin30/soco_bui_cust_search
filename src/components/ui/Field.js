import React from "react";
import PropTypes from "prop-types";

import classes from "./Field.module.css";

const Field = (props) => {
  return (
    <div className={classes.field}>
      <div className={classes.label}>{props.label}</div>
      <div className={classes.value}>{props.value}</div>
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Field;
