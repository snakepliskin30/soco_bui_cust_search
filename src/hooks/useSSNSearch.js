import { useState } from "react";

function padLeft(str) {
  return str.padStart(2, "0");
}

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

const buildRequestPayload = (ssntin) => {
  const apiUrl = "CUSTOM_CFG_SEARCH_SSN_URL";
  const Request = {};
  const Header = {};
  const Payload = {};
  const CustomerInfo = {};

  Header.verb = "get";
  Header.noun = "advancedSearch";
  Header.revision = "1.4";
  Header.organization = "SoCo";
  Header.transactionId = getCurrentTimestamp();
  Request.Header = Header;

  CustomerInfo.SSN = ssntin.replace(/-/g, "");
  Payload.CustomerInfo = CustomerInfo;
  Request.Payload = Payload;

  return { Request, apiUrl };
};

function capitalizePremise(premise) {
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
}

const formatData = (response) => {
  try {
    const allAccountData = [];
    const allShellData = [];
    const resultObj = {};
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
    let data = null;

    const shellObj = {};
    shellObj.fullName = "";
    shellObj.fname = "";
    shellObj.lname = "";
    shellObj.accountNo = "";
    shellObj.accountNoFormatted = "";
    shellObj.accountStatus = "";
    shellObj.accountType = "";
    shellObj.customerType = "";
    shellObj.revenueClass = "";
    shellObj.operatingCompany = "";
    shellObj.partyId = "";
    shellObj.addressLine1 = "";
    shellObj.addressLine2 = "";
    shellObj.city = "";
    shellObj.state = "";
    shellObj.zipCode = "";
    shellObj.addressNotes = "";

    const ssnWithAcct = response.Result.Response.ResponseCode.find((p) => p.AccountExistsFlag === "Y");

    if (ssnWithAcct) {
      // const custInfoObj = response.Payload.find((obj) => obj.CustomerInfo);
      // const gpcAcctExist = custInfoObj.CustomerInfo.find((gpc) => gpc.operatingCompany === "GPC");
      let gpcAcctExist = false;
      response.Payload.forEach((record) => {
        if (record?.CustomerInfo) {
          record.CustomerInfo.forEach((i) => {
            if (i?.operatingCompany === "GPC") gpcAcctExist = true;
          });
        }
      });
      response.Payload.forEach((ssnResult) => {
        // Account details
        if (ssnResult?.CustomerInfo) {
          const customerNo = ssnResult.GetCustomer.customerNumber;
          ssnResult.CustomerInfo.forEach((accountData) => {
            if (accountData.operatingCompany.toLowerCase() === "gpc") {
              accountData.customerNo = customerNo;
              accountData.customerType = "";
              accountData.operatingCompany = "";
              accountData.partyId = "";
              accountData.addressLine1 = "";
              accountData.addressLine2 = "";
              accountData.city = "";
              accountData.state = "";
              accountData.zipCode = "";
              accountData.addressNotes = "";
              allAccountData.push(accountData);
            }
            // Only accept non-gpc if gpc doesn't exist
            else if (!gpcAcctExist && accountData.operatingCompany.toLowerCase() !== "gpc") {
              accountData.customerNo = customerNo;
              accountData.accountNo = "";
              accountData.accountStatus = "";
              accountData.revenueClass = "";
              accountData.address = "Non-GPC Account";
              accountData.customerType = "";
              accountData.operatingCompany = "";
              accountData.partyId = "";
              accountData.addressLine1 = "";
              accountData.addressLine2 = "";
              accountData.city = "";
              accountData.state = "";
              accountData.zipCode = "";
              accountData.addressNotes = "";
              allAccountData.push(accountData);
            }
          });
        } else {
          const shellData = {};
          const customerNo = ssnResult.GetCustomer.customerNumber;
          shellData.customerNo = customerNo;
          shellData.accountNo = "";
          shellData.accountStatus = "";
          shellData.revenueClass = "";
          shellData.fullname = ssnResult.GetCustomer.fullName;
          shellData.customerType = "";
          shellData.operatingCompany = "";
          shellData.partyId = "";
          shellData.address = "Customer only record";
          shellData.addressLine1 = "";
          shellData.addressLine2 = "";
          shellData.city = "";
          shellData.state = "";
          shellData.zipCode = "";
          shellData.addressNotes = "";
          allShellData.push(shellData);
          // sessionStorage.setItem("ssn_shell_exist", "true");
        }
      });
    } else {
      response.Payload.forEach((ssnResult) => {
        const shellData = {};
        const customerNo = ssnResult.GetCustomer.customerNumber;
        shellData.customerNo = customerNo;
        shellData.accountNo = "";
        shellData.accountStatus = "";
        shellData.revenueClass = "";
        shellData.fullname = ssnResult.GetCustomer.fullName;
        shellData.customerType = "";
        shellData.operatingCompany = "";
        shellData.partyId = "";
        shellData.address = "Customer only record";
        shellData.addressLine1 = "";
        shellData.addressLine2 = "";
        shellData.city = "";
        shellData.state = "";
        shellData.zipCode = "";
        shellData.addressNotes = "";
        allShellData.push(shellData);
        //   sessionStorage.setItem("ssn_shell_exist", "true");
      });
    }

    data = [...allAccountData, ...allShellData];
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
  } catch (err) {
    console.log(err);
  }
};

export const useSSNSearch = () => {
  const [isSSNLoading, setIsSSNLoading] = useState(false);
  const [isSSNError, setIsSSNError] = useState(false);
  const [isSSNErrorMessage, setIsSSNErrorMessage] = useState("");

  const searchSSN = async (ssntin, sessionToken, profileId, interfaceUrl) => {
    let url = `${interfaceUrl}/php/custom/socoapicalls.php`;
    if (process.env.NODE_ENV !== "production") url = `http://localhost:8181/osvc/socoapicalls_nocs.php`;

    setIsSSNLoading(true);
    setIsSSNError(false);
    setIsSSNErrorMessage("");
    let apiTimeoutId;
    try {
      const { Request, apiUrl } = buildRequestPayload(ssntin);
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
      sessionStorage.setItem("search_by_ssn_result", JSON.stringify(data));

      if (data.Result.Response.ResponseCode[0].SSNExistsFlag === "N" && data.Result.Response.ResponseCode[0].AccountExistsFlag === "N") {
        formattedData = [];
      } else {
        formattedData = formatData(data);
      }

      setIsSSNLoading(false);
      return formattedData;
    } catch (e) {
      console.error(e.message);
      if (e.name === "AbortError") {
        setIsSSNError(true);
        setIsSSNErrorMessage("TIMEOUT");
        return [];
      } else {
        setIsSSNError(true);
        setIsSSNErrorMessage("TIMEOUT");
        return [];
      }
    } finally {
      clearTimeout(apiTimeoutId);
    }
  };

  return { isSSNLoading, isSSNError, isSSNErrorMessage, searchSSN };
};
