import React from "react";
import PropTypes from "prop-types";

import classes from "./ButtonSubmit.module.css";

const ButtonSubmit = (props) => {
  return (
    <button className={classes.submit} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

ButtonSubmit.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
};

export default ButtonSubmit;
