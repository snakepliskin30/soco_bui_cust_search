import React from "react";
import PropTypes from "prop-types";

import classes from "./ButtonCancel.module.css";

const ButtonCancel = (props) => {
  return (
    <button className={classes.cancel} onClick={props.onClick} type="button">
      {props.children}
    </button>
  );
};

ButtonCancel.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string,
};

export default ButtonCancel;
