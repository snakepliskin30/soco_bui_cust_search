import { useState } from "react";
import { callAccountSearchApi } from "./AccountSearch360";

function translateStatus(code) {
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
}

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

const getSearchResult = () => {
  return new Promise((resolve) => {
    let counter = 0;

    const intervalId = setInterval(() => {
      if (counter <= 250) {
        if (sessionStorage.getItem("customer_search_contact")) {
          clearInterval(intervalId);
          const result = sessionStorage.getItem("customer_search_contact");
          resolve(result);
        } else {
          counter += 1;
        }
      } else {
        clearInterval(intervalId);
        resolve("COUNTER_LIMIT_REACHED");
      }
    }, 200);
  });
};

export const useAccountSearch = () => {
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isAccountError, setIsAccountError] = useState(false);
  const [isAccountErrorMessage, setIsAccountErrorMessage] = useState("");

  const searchAccount = async (accountNumber, extensionProvider, sessionToken, profileId, interfaceUrl, interfaceUrlRest, login) => {
    try {
      let custInfo = [];
      let data;
      sessionStorage.removeItem("customer_search_contact");
      setIsAccountLoading(true);
      callAccountSearchApi(accountNumber, extensionProvider, sessionToken, profileId, interfaceUrl, interfaceUrlRest, login);
      let response = await getSearchResult();
      response = JSON.parse(response);
      console.log(response);
      if (response.Result.status.toLowerCase() === "ok") {
        const responseData = {
          ...response.Payload.CustomerInfo,
          ...response.Payload.CustomerInfo.ServiceAddress,
          customerNo: response.Payload.CustomerInfo.AccountInquiry.customerNo,
          fullname: response.Payload.CustomerInfo.fullName.trim().replace(/\s+/g, " "),
          accountStatus: translateStatus(response.Payload.CustomerInfo.accountStatus),
          groupByField: `${response.Payload.CustomerInfo.fullName.trim().replace(/\s+/g, " ")}, Customer Number: ${
            response.Payload.CustomerInfo.AccountInquiry.customerNo ? response.Payload.CustomerInfo.AccountInquiry.customerNo : ""
          }`,
        };
        custInfo[0] = responseData;
        data = custInfo;

        let formattedData = data.map((info) => ({
          ...info,
          fname: info.fullname.trim().substring(0, info.fullname.trim().lastIndexOf(" ")),
          lname: info.fullname.trim().substring(info.fullname.trim().lastIndexOf(" ") + 1),
          addressNotes: info.addressNotes === null || info.addressNotes === undefined || info.addressNotes.length === 0 ? " " : info.addressNotes,
          accountNoFormatted: info.accountNo ? `${info.accountNo.slice(0, 5)}-${info.accountNo.slice(-5)}` : "",
          address: capitalizePremise(info.address),
        }));

        setIsAccountLoading(false);
        return formattedData;
      } else {
        setIsAccountLoading(false);
        return [];
      }
    } catch (e) {
      console.error(e.message);
      if (e.name === "AbortError") {
        setIsAccountError(true);
        setIsAccountErrorMessage("TIMEOUT");
        return [];
      } else {
        setIsAccountError(true);
        setIsAccountErrorMessage("TIMEOUT");
        return [];
      }
    }
  };

  return { isAccountLoading, isAccountError, isAccountErrorMessage, searchAccount };
};
