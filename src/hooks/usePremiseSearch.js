import { useState } from "react";

const buildRequestPayload = (address, city, state, zip) => {
  const apiUrl = "CUSTOM_CFG_SEARCH_ADDRESS_URL";
  const Request = {};
  const Payload = {};

  Payload.formattedAddress = address;
  Payload.city = city;
  Payload.state = state;
  Payload.zipCode = zip;

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

const buildAddress = (addrLine1, addrLine2, city, state, zip) => {
  let fullAddress = "";
  if (addrLine1) {
    if (addrLine2) {
      fullAddress += `${capitalizePremise(addrLine1)} `;
    } else {
      fullAddress += `${capitalizePremise(addrLine1)}, `;
    }
  }
  if (addrLine2) {
    fullAddress += `${capitalizePremise(addrLine2)}, `;
  }
  if (city) {
    fullAddress += `${capitalizePremise(city)}, `;
  }
  if (state) {
    fullAddress += `${state} `;
  }
  if (zip) {
    fullAddress += `${zip}`;
  }
  return fullAddress;
};

const formatData = (response) => {
  const custInfo = response.Payload.CustomerInfo;
  let data = custInfo.map((info) => ({ ...info, ...info.ServiceAddress }));
  data = data.map((info) => ({
    ...info,
    fname: info.fullname.trim().substring(0, info.fullname.trim().lastIndexOf(" ")),
    lname: info.fullname.trim().substring(info.fullname.trim().lastIndexOf(" ") + 1),
    addressNotes: info.addressNotes ? info.addressNotes : " ",
    accountNoFormatted: `${info.accountNo.slice(0, 5)}-${info.accountNo.slice(-5)}`,
    address: buildAddress(info.addressLine1, info.addressLine2, info.city, info.state, info.zipCode),
    groupByField: `${buildAddress(info.addressLine1, info.addressLine2, info.city, info.state, info.zipCode)}, ${info.addressNotes ? info.addressNotes : " "}, Premise Number ${info.premiseNo}`,
  }));

  return data;
};

export const usePremiseSearch = () => {
  const [isPremiseLoading, setIsPremiseLoading] = useState(false);
  const [isPremiseError, setIsPremiseError] = useState(false);
  const [isPremiseErrorMessage, setIsPremiseErrorMessage] = useState("");

  const searchPremise = async (address, city, state, zip, sessionToken, profileId, interfaceUrl) => {
    let url = `${interfaceUrl}/php/custom/socoapicalls.php`;
    if (process.env.NODE_ENV !== "production") url = `http://localhost:8181/osvc/socoapicalls_nocs.php`;

    setIsPremiseLoading(true);
    setIsPremiseError(false);
    setIsPremiseErrorMessage("");
    let apiTimeoutId;
    try {
      const { Request, apiUrl } = buildRequestPayload(address, city, state, zip);
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

      setIsPremiseLoading(false);
      return formattedData;
    } catch (e) {
      console.error(e.message);
      if (e.name === "AbortError") {
        setIsPremiseError(true);
        setIsPremiseErrorMessage("TIMEOUT");
        return [];
      } else {
        setIsPremiseError(true);
        setIsPremiseErrorMessage("TIMEOUT");
        return [];
      }
    } finally {
      clearTimeout(apiTimeoutId);
    }
  };

  return {
    isPremiseLoading,
    isPremiseError,
    isPremiseErrorMessage,
    searchPremise,
  };
};
