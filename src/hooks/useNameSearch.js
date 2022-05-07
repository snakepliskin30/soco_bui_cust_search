import { useState } from "react";

const translateStatus = (code) => {
  const AccountStatus = {};
  AccountStatus["02"] = "Active";
  AccountStatus["03"] = "Pending Active";
  AccountStatus["07"] = "Void";
  AccountStatus["09"] = "Final";
  AccountStatus["18"] = "Written Off";
  AccountStatus["ACTIVE"] = "Active";
  AccountStatus["INACTIVE"] = "Inactive";

  const status = AccountStatus[code] || "";

  return status;
};
const padLeft = (str) => {
  return str.padStart(2, "0");
};

const getCurrentTimestamp = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    padLeft((d.getMonth() + 1).toString()) +
    padLeft(d.getDate().toString()) +
    padLeft(d.getHours().toString()) +
    padLeft(d.getMinutes().toString()) +
    padLeft(d.getSeconds().toString())
  );
};

const buildRequestPayload = (firstname, middleName, lastName, login) => {
  const apiUrl = "CUSTOM_CFG_SOCOMLP_NAME_SEARCH";
  const Request = {};
  const Payload = {};
  const CustomerInfo = {};
  const BaseRequest = {};

  BaseRequest.transactionId = getCurrentTimestamp();
  BaseRequest.userId = login;

  CustomerInfo.fname = firstname ? firstname.toUpperCase() : "";
  CustomerInfo.mname = middleName ? middleName.toUpperCase() : "";
  CustomerInfo.lname = lastName ? lastName.toUpperCase() : "";
  CustomerInfo.BaseRequest = BaseRequest;
  Payload.CustomerInfo = CustomerInfo;

  Request.Payload = Payload;

  return { Request, apiUrl };
};

const capitalizePremise = (premise) => {
  if (premise === "Non-GPC Account" || premise === "Customer only record") {
    return premise;
  }
  const premArray = premise.split(",");
  let finalAddress = "";
  if (premArray.length >= 1) {
    finalAddress += premArray[0].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  if (premArray.length >= 2) {
    finalAddress += `, ${premArray[1].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`;
  }
  if (premArray.length === 4) {
    finalAddress += `, ${premArray[2].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`;
    finalAddress += `, ${premArray[3]}`;
  } else if (premArray.length === 3) {
    finalAddress += `, ${premArray[2]}`;
  }
  return finalAddress;
};

const formatData = (response) => {
  let data = null;
  let custInfo = response.Payload.CustomerInfo;
  custInfo = custInfo.map((info) => ({
    ...info,
    accountStatus: translateStatus(info.accountStatus),
  }));
  let svcAddress = response.Payload.ServiceAddress;
  let shellCust = response.Payload.ShellCustomer;
  let resultObj = {};
  resultObj.fullName = "";
  resultObj.fname = "";
  resultObj.lname = "";
  resultObj.accountNo = "";
  resultObj.accountNoFormatted = "";
  resultObj.accountStatus = "";
  resultObj.accountType = "";
  resultObj.customerType = "";
  resultObj.revenueClass = "";
  resultObj.operatingCompany = "";
  resultObj.partyId = "";
  resultObj.addressLine1 = "";
  resultObj.addressLine2 = "";
  resultObj.city = "";
  resultObj.state = "";
  resultObj.zipCode = "";
  resultObj.addressNotes = "";

  data = custInfo.map((info) => ({
    ...info,
    ...svcAddress.find((item) => item.partyId === info.partyId),
  }));
  if (shellCust) {
    const shellCustFinal = shellCust.map((shell) => ({
      customerNo: shell.customerNo,
      fullname: shell.fullName,
      ...resultObj,
      address: `Customer record only`,
    }));
    data = [...data, ...shellCustFinal];
  }

  data = data.map((info) => ({
    ...info,
    fname: info.fullname.trim().substring(0, info.fullname.trim().lastIndexOf(" ")),
    lname: info.fullname.trim().substring(info.fullname.trim().lastIndexOf(" ") + 1),
    fullname: info.fullname.trim().replace(/\s+/g, " "),
    address: capitalizePremise(info.address),
    accountNoFormatted: info.accountNo ? `${info.accountNo.slice(0, 5)}-${info.accountNo.slice(-5)}` : "",
    groupByField: `${info.fullname.trim().replace(/\s+/g, " ")}, Customer Number: ${info.customerNo ? info.customerNo : ""}`,
  }));

  return data;
};

export const useNameSearch = () => {
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isNameErrorMessage, setIsNameErrorMessage] = useState("");

  const searchName = async (firstname, middleName, lastName, sessionToken, profileId, interfaceUrl, login) => {
    let url = `${interfaceUrl}/php/custom/socoapicalls.php`;
    if (process.env.NODE_ENV !== "production") url = `http://localhost:8181/osvc/socoapicalls_nocs.php`;

    setIsNameLoading(true);
    setIsNameError(false);
    setIsNameErrorMessage("");
    let apiTimeoutId;
    try {
      const { Request, apiUrl } = buildRequestPayload(firstname, middleName, lastName, login);
      const fetchController = new AbortController();
      const { signal } = fetchController;
      const timeOut = 60000;

      apiTimeoutId = setTimeout(() => {
        fetchController.abort();
      }, timeOut);

      const formData = new FormData();
      formData.append("data", JSON.stringify(Request));
      formData.append("apiUrl", apiUrl);

      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          P_SID: sessionToken,
          P_ID: profileId,
        },
        body: formData,
        signal,
      });

      const data = await response.json();
      let formattedData = [];

      if (data.Result.status.toLowerCase() === "ok") {
        formattedData = formatData(data);
      } else {
        formattedData = [];
      }

      setIsNameLoading(false);
      return formattedData;
    } catch (e) {
      console.error(e.message);
      if (e.name === "AbortError") {
        setIsNameError(true);
        setIsNameErrorMessage("TIMEOUT");
        return [];
      } else {
        setIsNameError(true);
        setIsNameErrorMessage("TIMEOUT");
        return [];
      }
    } finally {
      clearTimeout(apiTimeoutId);
    }
  };

  return { isNameLoading, isNameError, isNameErrorMessage, searchName };
};
