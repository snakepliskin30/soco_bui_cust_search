import React, { useContext } from "react";
import PropTypes from "prop-types";
import { callAccountSearchApi } from "../../hooks/AccountSearch360";

import CustSearchContext from "../../store/cust-search-context";

import classes from "./SearchContextMenu.module.css";

const SearchContextMenu = (props) => {
  const searchContext = useContext(CustSearchContext);

  const openContactHandler = () => {
    const osvcParams = searchContext.getOsvcParams();
    if (props.selectedRow) {
      callAccountSearchApi(
        props.selectedRow.accountNo.replace("-", ""),
        osvcParams.osvcExtensionProv,
        osvcParams.osvcSessionToken,
        osvcParams.osvcProfileId,
        osvcParams.osvcInterfaceUrl,
        osvcParams.osvcInterfaceUrlREST
      );
    }
  };

  const showModalShellModalClickHandler = () => {
    const customerNo = props.selectedRow.customerNo;
    const accountNo = props.selectedRow.accountNo;
    searchContext.showModalHandler(customerNo, accountNo);
  };

  const style = () => {
    return {
      height: "auto",
      width: 180,
      borderRadius: 3,
      backgroundColor: "rgba(252, 252, 253)",
      color: "#fcd2d1",
      flexDirection: "column",
      top: props.yLoc,
      left: props.xLoc,
      transform: props.showMenu ? "scale(1)" : "scale(0)",
      transformOrigin: "top left",
      position: "fixed",
      transition: "transform 0.2s ease-in-out",
      boxShadow: "3px 3px 8px 0px rgba(0, 0, 0, 0.5)",
    };
  };

  let openContactClass = `${classes.open360} ${classes.inactive}`;
  let openStartSvcClass = `${classes.startservice} ${classes.inactive}`;
  if (
    props.selectedRow.accountNo &&
    props.selectedRow.revenueClass === "Residential"
  ) {
    openContactClass = `${classes.open360}`;
  }

  if (!props.selectedRow.accountNo && props.selectedRow.customerNo) {
    openStartSvcClass = `${classes.startservice}`;
  }

  return (
    <div
      id="searchContextMenu"
      style={style()}
      onMouseLeave={props.onMouseLeave}
    >
      <div onClick={openContactHandler} className={openContactClass}>
        <div>Open 360</div>
      </div>
      <div
        onClick={showModalShellModalClickHandler}
        className={openStartSvcClass}
      >
        <div> Start Service</div>
      </div>
    </div>
  );
};

SearchContextMenu.propTypes = {
  selectedRow: PropTypes.object,
  xLoc: PropTypes.number.isRequired,
  yLoc: PropTypes.number.isRequired,
  showMenu: PropTypes.bool.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  getOsvcParams: PropTypes.func,
  showModalHandler: PropTypes.func,
};

export default SearchContextMenu;
