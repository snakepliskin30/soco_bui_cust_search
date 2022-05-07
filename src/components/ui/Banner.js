import React from "react";
import PropTypes from "prop-types";

import classes from "./Banner.module.css";

const Banner = (props) => {
  const icon_container = props.info ? `${classes.banner_icon_container} ${classes.info}` : `${classes.banner_icon_container}`;
  const banner_container = props.info ? `${classes.banner_container} ${classes.info_container}` : `${banner_container}`;

  return (
    <div className={banner_container}>
      <div className={icon_container}></div>
      <div className={classes.banner_message}>{props.children}</div>
      {props.custom && (
        <div className={classes.custom} onClick={props.customClick}>
          {props.custom}
        </div>
      )}
    </div>
  );
};

Banner.propTypes = {
  children: PropTypes.object,
  info: PropTypes.bool,
  custom: PropTypes.string,
  customClick: PropTypes.func,
};

export default Banner;
