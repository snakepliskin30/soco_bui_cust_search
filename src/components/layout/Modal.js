import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";
import InputNumber from "../ui/InputNumber";
import { callOtherInfoAPIShell } from "../../hooks/AccountSearch360";

import classes from "./Modal.module.css";

const Modal = (props) => {
  const [ssnModal, setSSNModal] = useState("XXXXXXXXX");
  const [customerNoModal, setCustomerNoModal] = useState("");
  const [primaryPhoneModal, setPrimaryPhoneModal] = useState("XXXXXXXXXX");
  const [altPhoneModal, setAltPhoneModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalShow = props.showModal
    ? `${classes.box} ${classes.active}`
    : `${classes.box}`;
  const modalShowOverlay = props.showModal
    ? `${classes.overlay} ${classes.active}`
    : `${classes.overlay}`;

  const yesButtonHandler = () => {
    const osvcParams = props.getOsvcParams();
    sessionStorage.setItem(
      "start_service_modal_customer_number",
      customerNoModal
    );
    sessionStorage.setItem("ssn_value_from_modal", ssnModal); // this will be used to default ssn addin
    sessionStorage.setItem("primphone_value_from_modal", primaryPhoneModal); // this will be used to default primphone addin
    sessionStorage.setItem("altphone_value_from_modal", altPhoneModal); // this will be used to default altphone addin
    osvcParams.osvcExtensionProv.registerWorkspaceExtension(
      (workspaceRecord) => {
        workspaceRecord.createWorkspaceRecord("Contact");
        props.hideModalClick();
      }
    );
  };

  const hideModalHandler = () => {
    setSSNModal("XXXXXXXXX");
    setPrimaryPhoneModal("XXXXXXXXXX");
    setAltPhoneModal("");
    setCustomerNoModal("");
    props.hideModalClick();
  };

  const overlayClickHandler = (e) => {
    if (!e.target.closest("#modal")) props.hideModalClick();
  };

  const getModalValues = async () => {
    try {
      setIsLoading(true);
      const osvcParams = props.getOsvcParams();
      const response = await callOtherInfoAPIShell(
        props.modalFields.customerNo,
        props.modalFields.accountNo,
        osvcParams.osvcSessionToken,
        osvcParams.osvcProfileId,
        osvcParams.osvcInterfaceUrl
      );
      if (props.searchField === "ssn") {
        const ssnSearchResult = JSON.parse(
          sessionStorage.getItem("search_by_ssn_result")
        ); // this was set in the externalsearchresult via ssn search
        const customerObj = ssnSearchResult.Payload.find(
          (x) => x.GetCustomer.customerNumber === props.modalFields.customerNo
        );
        let ssnModal = customerObj.GetCustomer.ssn
          ? customerObj.GetCustomer.ssn.toUpperCase()
          : "";
        let primPhoneModal = customerObj.GetCustomer.primaryContact.phone;
        let altPhoneModal = customerObj.GetCustomer.secondaryContact.phone;
        setSSNModal(ssnModal);
        setPrimaryPhoneModal(primPhoneModal);
        setAltPhoneModal(altPhoneModal);
        setCustomerNoModal(props.modalFields.customerNo);
        sessionStorage.setItem(
          "shell_ssn_nongpc_details",
          JSON.stringify(customerObj)
        ); // this will be used to predefault customer info

        if (response.Result.responseCode === "000") {
          sessionStorage.setItem(
            "shell_namephone_nongpc_details",
            JSON.stringify(response)
          ); // this will be used to predefault customer info
        }
      } else {
        if (response.Result.responseCode === "000") {
          sessionStorage.setItem(
            "shell_namephone_nongpc_details",
            JSON.stringify(response)
          ); // this will be used to predefault customer info
          let ssnModal = response.Payload.OtherCustomerInfo.ssn
            ? response.Payload.OtherCustomerInfo.ssn.toUpperCase()
            : "";
          let primPhoneModal = response.Payload.OtherCustomerInfo.primaryPhone;
          let altPhoneModal = response.Payload.OtherCustomerInfo.altPhone;
          setSSNModal(ssnModal);
          setPrimaryPhoneModal(primPhoneModal);
          setAltPhoneModal(altPhoneModal);
          setCustomerNoModal(props.modalFields.customerNo);
        } else {
          setSSNModal("Error fetching details");
          setPrimaryPhoneModal("Error fetching details");
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
    }
  };

  useEffect(() => {
    setSSNModal("XXXXXXXXX");
    setPrimaryPhoneModal("XXXXXXXXXX");
    setAltPhoneModal("");
    setCustomerNoModal("");
    if (props.showModal) {
      getModalValues();
    }
  }, [props.showModal]);

  return (
    <div className={classes.main}>
      <div className={modalShowOverlay} onClick={overlayClickHandler}>
        <div className={modalShow} id="modal">
          <div className={classes.header}>
            <span>Start Service</span>
            <span className={classes.closeBtn} onClick={hideModalHandler}>
              &#10005;
            </span>
          </div>
          <div className={classes.message}>
            <span className={classes.text}>Is this the correct customer?</span>
            <InputNumber
              label="SSN"
              id="ssntin"
              options={{ blocks: [3, 2, 4], delimiter: "-" }}
              numericOnly="no"
              value={ssnModal}
              disabled={true}
              invalidMessage="SSN format xxx-xx-xxxx"
            />
            <InputNumber
              label="Primary Phone"
              id="phoneNumber"
              options={{ blocks: [3, 3, 4], delimiter: "-" }}
              numericOnly="no"
              value={primaryPhoneModal}
              disabled={true}
              invalidMessage="Phone format xxx-xxx-xxxx"
            />
            <div className="btnGrp">
              <ButtonCancel onClick={hideModalHandler}>No</ButtonCancel>
              <ButtonSubmit onClick={yesButtonHandler}>Yes</ButtonSubmit>
            </div>

            {isLoading && (
              <div className={classes.overlayspin}>
                <div className={classes.spinner}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool,
  hideModalClick: PropTypes.func,
  modalFields: PropTypes.object,
  searchField: PropTypes.string,
  getOsvcParams: PropTypes.func,
};

export default Modal;
