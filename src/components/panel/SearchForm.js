import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import Input from "../ui/Input";
import InputNumber from "../ui/InputNumber";
import ButtonSubmit from "../ui/ButtonSubmit";
import ButtonCancel from "../ui/ButtonCancel";
import Banner from "../ui/Banner";

import CustSearchContext from "../../store/cust-search-context";

import classes from "./SearchForm.module.css";

const SearchForm = () => {
  const searchContext = useContext(CustSearchContext);
  const [ssntin, setSSNTin] = useState(searchContext.searchParams.ssn);
  const [accountNumber, setAccountNumber] = useState(
    searchContext.searchParams.accountNumber
  );
  const [phone, setPhone] = useState(searchContext.searchParams.phone);
  const [firstName, setFirstName] = useState(
    searchContext.searchParams.firstName
  );
  const [middleName, setMiddleName] = useState(
    searchContext.searchParams.middleName
  );
  const [lastName, setLastName] = useState(searchContext.searchParams.lastName);
  const [street, setStreet] = useState(searchContext.searchParams.street);
  const [city, setCity] = useState(searchContext.searchParams.city);
  const [state, setState] = useState(searchContext.searchParams.state);
  const [zip, setZip] = useState(searchContext.searchParams.zip);
  const [ssntinRO, setSSNTinRO] = useState(false);
  const [accountNumberRO, setAccountNumberRO] = useState(false);
  const [phoneRO, setPhoneRO] = useState(false);
  const [firstNameRO, setFirstNameRO] = useState(false);
  const [middleNameRO, setMiddleNameRO] = useState(false);
  const [lastNameRO, setLastNameRO] = useState(false);
  const [streetRO, setStreetRO] = useState(false);
  const [cityRO, setCityRO] = useState(false);
  // const [stateRO, setStateRO] = useState(true);
  const [zipRO, setZipRO] = useState(false);
  const [ssnInvalid, setSSNInvalid] = useState(false);
  const [accountNumberInvalid, setAccountNumberInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [streetInvalid, setStreetInvalid] = useState(false);

  const setEnableDisable = (...args) => {
    if (args.includes("ssntin")) {
      setSSNTinRO(false);
    } else setSSNTinRO(true);

    if (args.includes("accountNumber")) setAccountNumberRO(false);
    else setAccountNumberRO(true);

    if (args.includes("phone")) setPhoneRO(false);
    else setPhoneRO(true);

    if (args.includes("firstName")) setFirstNameRO(false);
    else setFirstNameRO(true);

    if (args.includes("middleName")) setMiddleNameRO(false);
    else setMiddleNameRO(true);

    if (args.includes("lastName")) setLastNameRO(false);
    else setLastNameRO(true);

    if (args.includes("street")) setStreetRO(false);
    else setStreetRO(true);

    if (args.includes("city")) setCityRO(false);
    else setCityRO(true);

    // if (args.includes("state")) setStateRO(false);
    // else setStateRO(true);

    if (args.includes("zip")) setZipRO(false);
    else setZipRO(true);
  };

  useEffect(() => {
    if (ssntin) setEnableDisable("ssntin");
    if (accountNumber) setEnableDisable("accountNumber");
    if (phone) setEnableDisable("phone");
    if (firstName) setEnableDisable("firstName", "middleName", "lastName");
    if (middleName) setEnableDisable("firstName", "middleName", "lastName");
    if (lastName) setEnableDisable("firstName", "middleName", "lastName");
    if (street) setEnableDisable("street", "city", "zip");
    if (city) setEnableDisable("street", "city", "zip");
    // if (state) setEnableDisable("street", "city", "state", "zip");
    if (zip) setEnableDisable("street", "city", "zip");
    if (
      !ssntin &&
      !accountNumber &&
      !phone &&
      !firstName &&
      !middleName &&
      !lastName &&
      !street &&
      !city &&
      !zip
    ) {
      setEnableDisable(
        "ssntin",
        "accountNumber",
        "phone",
        "firstName",
        "middleName",
        "lastName",
        "street",
        "city",
        "zip"
      );
      setSSNInvalid(false);
      setAccountNumberInvalid(false);
      setPhoneInvalid(false);
      setFirstNameInvalid(false);
      setLastNameInvalid(false);
      setStreetInvalid(false);
    }
    const params = {
      ssn: ssntin,
      phone,
      accountNumber,
      firstName,
      middleName,
      lastName,
      street,
      city,
      state,
      zip,
    };
    searchContext.updateSearchParams(params);
  }, [
    ssntin,
    accountNumber,
    phone,
    firstName,
    middleName,
    lastName,
    street,
    city,
    state,
    zip,
  ]);

  const submitFormHandler = (e) => {
    e.preventDefault();
    if (validateFields())
      searchContext.searchHandler({
        ssntin,
        accountNumber,
        phone,
        firstName,
        middleName,
        lastName,
        street,
        city,
        state,
        zip,
      });
  };

  const validateFields = () => {
    let fieldsInvalid = 0;
    if (ssntin) {
      if (ssntin.replace(/-/g, "").length !== 9) {
        setSSNInvalid(true);
        ++fieldsInvalid;
      } else {
        setSSNInvalid(false);
      }
    } else if (accountNumber) {
      if (accountNumber.replace(/-/g, "").length !== 10) {
        setAccountNumberInvalid(true);
        ++fieldsInvalid;
      } else {
        setAccountNumberInvalid(false);
      }
    } else if (phone) {
      if (phone.replace(/-/g, "").length !== 10) {
        setPhoneInvalid(true);
        ++fieldsInvalid;
      } else {
        setPhoneInvalid(false);
      }
    } else if (firstName || middleName || lastName) {
      if (!firstName) {
        setFirstNameInvalid(true);
        ++fieldsInvalid;
      } else {
        setFirstNameInvalid(false);
      }
      if (!lastName) {
        setLastNameInvalid(true);
        ++fieldsInvalid;
      } else {
        setLastNameInvalid(false);
      }
    } else if (street || city || zip) {
      if (!street) {
        setStreetInvalid(true);
        ++fieldsInvalid;
      } else {
        setStreetInvalid(false);
      }
    }
    if (
      !ssntin &&
      !accountNumber &&
      !phone &&
      !firstName &&
      !lastName &&
      !street
    ) {
      ++fieldsInvalid;
    }
    return fieldsInvalid === 0;
  };

  const clearFormHandler = () => {
    setSSNTin("");
    setAccountNumber("");
    setPhone("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setStreet("");
    setCity("");
    setZip("");
    setSSNInvalid(false);
    setAccountNumberInvalid(false);
    setPhoneInvalid(false);
    setFirstNameInvalid(false);
    setLastNameInvalid(false);
    setStreetInvalid(false);
  };

  const startServiceHandler = () => {
    const osvcParams = searchContext.getOsvcParams();
    osvcParams.osvcExtensionProv.registerWorkspaceExtension(
      (workspaceRecord) => {
        workspaceRecord.createWorkspaceRecord("Contact");
      }
    );
  };

  return (
    <form
      className={classes.main}
      onSubmit={submitFormHandler}
      autoComplete="off"
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Customer Record Lookup
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "0.9rem",
          color: "#7f7f7f",
          marginTop: "-25px",
        }}
      >
        Find your customer in the system
      </div>

      {searchContext.searchResult.data.length === 0 &&
        (searchContext.searchResult.isCustSearch ||
          searchContext.searchResult.isPremiseSearch) && (
          <Banner
            info={true}
            custom="Start Service"
            customClick={startServiceHandler}
          >
            Search criteria you entered was not found. Click the Start Service
            to add the new customer.
          </Banner>
        )}
      <div className={classes.mainForm}>
        <div className={classes.custinfoform}>
          <InputNumber
            label="SSN/TIN"
            id="ssntin"
            options={{ blocks: [3, 2, 4], delimiter: "-" }}
            value={ssntin}
            onChange={setSSNTin}
            disabled={ssntinRO}
            invalid={ssnInvalid}
            invalidMessage="SSN format xxx-xx-xxxx"
          />
          <InputNumber
            label="Phone"
            id="phoneNumber"
            options={{ blocks: [3, 3, 4], delimiter: "-" }}
            value={phone}
            onChange={setPhone}
            disabled={phoneRO}
            invalid={phoneInvalid}
            invalidMessage="Phone format xxx-xxx-xxxx"
          />
          <InputNumber
            label="Account Number"
            id="accoutNumber"
            options={{ blocks: [5, 5], delimiter: "-" }}
            value={accountNumber}
            onChange={setAccountNumber}
            disabled={accountNumberRO}
            invalid={accountNumberInvalid}
            invalidMessage="Account Number format xxxxx-xxxxx"
          />
          <Input
            label="First Name"
            id="fname"
            value={firstName}
            onChange={setFirstName}
            disabled={firstNameRO}
            invalid={firstNameInvalid}
            invalidMessage="First Name is a required field"
          />
          <Input
            label="Middle Name"
            id="mname"
            value={middleName}
            onChange={setMiddleName}
            disabled={middleNameRO}
          />
          <Input
            label="Last Name"
            id="lname"
            value={lastName}
            onChange={setLastName}
            disabled={lastNameRO}
            invalid={lastNameInvalid}
            invalidMessage="Last Name is a required field"
          />
        </div>
        <div className={classes.vertbar}></div>
        <div className={classes.premiseinfoform}>
          <div className={classes.premiseField}>
            <Input
              label="Street Address"
              id="streetAddress"
              value={street}
              onChange={setStreet}
              disabled={streetRO}
              invalid={streetInvalid}
              invalidMessage="Street Address is a required field"
            />
          </div>
          <Input
            label="City"
            id="city"
            value={city}
            onChange={setCity}
            disabled={cityRO}
          />
          <Input
            label="State"
            id="state"
            value={state}
            onChange={setState}
            disabled={true}
          />
          <InputNumber
            label="Zip"
            id="zip"
            options={{ blocks: [4] }}
            value={zip}
            onChange={setZip}
            disabled={zipRO}
          />
        </div>
      </div>
      <div className="btnGrp">
        <ButtonCancel onClick={clearFormHandler}>Clear</ButtonCancel>
        <ButtonSubmit>Search</ButtonSubmit>
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  getOsvcParams: PropTypes.func,
  searchResult: PropTypes.object,
  searchParams: PropTypes.object,
  updateSearchParams: PropTypes.func,
};

export default React.memo(SearchForm);
