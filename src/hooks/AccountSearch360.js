/* eslint-disable no-useless-escape */
// let extensionProvider;
// let globalContext;

const callOICAPI = async (requestString, apiurl, sessionToken, profileId, interfaceUrl) => {
  let apiTimeoutId;
  try {
    const fetchController = new AbortController();
    const { signal } = fetchController;
    const timeOut = 60000;

    apiTimeoutId = setTimeout(() => {
      fetchController.abort();
    }, timeOut);

    let url = `${interfaceUrl}/php/custom/socoapicalls.php`;
    if (process.env.NODE_ENV !== "production") url = `http://localhost:8181/osvc/socoapicalls_nocs.php`;
    const formData = new FormData();
    formData.append("data", requestString);
    formData.append("apiUrl", apiurl);

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
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    clearTimeout(apiTimeoutId);
  }
};

function callGetRequest(url, sessionToken) {
  return new Promise((resolve) => {
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Session ${sessionToken}`,
        "Content-Type": "application/json",
        "OSvC-CREST-Application-Context": "get request",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch(() => resolve(false));
  });
}

function padLeft(str) {
  return str.padStart(2, "0");
}

function getCurrentTimestamp() {
  const d = new Date();
  return (
    d.getFullYear() +
    padLeft((d.getMonth() + 1).toString()) +
    padLeft(d.getDate().toString()) +
    padLeft(d.getHours().toString()) +
    padLeft(d.getMinutes().toString()) +
    padLeft(d.getSeconds().toString())
  );
}

// function getLocalTimeStamp(date = null) {
//   let now = new Date();
//   if (date) {
//     now = date;
//   }
//   const offsetMs = now.getTimezoneOffset() * 60 * 1000;
//   const dateLocal = new Date(now.getTime() - offsetMs);
//   return dateLocal.toISOString().slice(0, 19).replace("T", " ");
// }

// function replacePII(log) {
//   let cleanLog = log.replace(/\"ssn\":(\".*?\")/g, '"ssn":"[ssn]"');
//   cleanLog = cleanLog.replace(/\"birthday\":(\".*?\")/g, '"birthday":"[birthday]"');
//   cleanLog = cleanLog.replace(/\"driverseLicenseNo\":(\".*?\")/g, '"driverseLicenseNo":"[driverseLicenseNo]"');
//   cleanLog = cleanLog.replace(/\"number\":(\".*?\")/g, '"number":"[number]"');
//   cleanLog = cleanLog.replace(/\"creditScoreDecision\":(\".*?\")/g, '"creditScoreDecision":"[creditScoreDecision]"');
//   cleanLog = cleanLog.replace(/\"SSN\":(\".*?\")/g, '"SSN":"[SSN]"');
//   return cleanLog;
// }

// function // logAPI360(startTime, requestString, responseString, accountNo, apiType, apiUrl) {
//   return new Promise((resolve, reject) => {
//     try {
//       const requestTime = getLocalTimeStamp(startTime);
//       const responseTime = getLocalTimeStamp();
//       const endTime = new Date();
//       const timeDiff = ((endTime - startTime) / 1000).toString();
//       const requestStringClean = replacePII(requestString);
//       const responseStringClean = replacePII(responseString);

//       if (!extensionProvider) {
//         ORACLE_SERVICE_CLOUD.extension_loader.load("SoCoAPILibExt", "1").then((IExtensionProvider) => {
//           extensionProvider = IExtensionProvider;
//           extensionProvider.getGlobalContext().then((gc) => {
//             globalContext = gc;
//             globalContext.invokeAction("getConfigSettingValue", apiUrl).then((result) => {
//               const valueArr = result.result;
//               const extensionLogger = extensionProvider.getLogger(`${apiType}`);
//               extensionLogger.warn(`API Time Taken: ${timeDiff} secs`);
//               extensionLogger.warn(`API Response Payload: ${responseStringClean}`);
//               extensionLogger.warn(`API End: ${responseTime}`);
//               extensionLogger.warn(`API Request Payload: ${requestStringClean}`);
//               extensionLogger.warn(`API URL: ${valueArr[0]}`);
//               extensionLogger.warn(`API Start: ${requestTime}`);
//               extensionLogger.warn(`API Account: ${accountNo.substring(0, 5)}-${accountNo.slice(-5)}`);
//               resolve(true);
//             });
//           });
//         });
//       } else {
//         globalContext.invokeAction("getConfigSettingValue", apiUrl).then((result) => {
//           const valueArr = result.result;
//           const extensionLogger = extensionProvider.getLogger(`${apiType}`);
//           extensionLogger.warn(`API Time Taken: ${timeDiff} secs`);
//           extensionLogger.warn(`API Response Payload: ${responseStringClean}`);
//           extensionLogger.warn(`API End: ${responseTime}`);
//           extensionLogger.warn(`API Request Payload: ${requestStringClean}`);
//           extensionLogger.warn(`API URL: ${valueArr[0]}`);
//           extensionLogger.warn(`API Start: ${requestTime}`);
//           extensionLogger.warn(`API Account: ${accountNo.substring(0, 5)}-${accountNo.slice(-5)}`);
//           resolve(true);
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// }

// function logAPI(requestTime, responseTime, timeDiff, requestString, responseString, accountNo, apiType, apiUrl) {
//   return new Promise((resolve, reject) => {
//     try {
//       const requestStringClean = replacePII(requestString);
//       const responseStringClean = replacePII(responseString);
//       ORACLE_SERVICE_CLOUD.extension_loader.load("SoCoAPILibExt", "1").then((IExtensionProvider) => {
//         IExtensionProvider.getGlobalContext().then((globalContext) => {
//           globalContext.invokeAction("getConfigSettingValue", apiUrl).then((result) => {
//             const valueArr = result.result;
//             const extensionLogger = IExtensionProvider.getLogger(`${apiType}`);
//             extensionLogger.warn(`API Time Taken: ${timeDiff} secs`);
//             extensionLogger.warn(`API Response Payload: ${responseStringClean}`);
//             extensionLogger.warn(`API End: ${responseTime}`);
//             extensionLogger.warn(`API Request Payload: ${requestStringClean}`);
//             extensionLogger.warn(`API URL: ${valueArr[0]}`);
//             extensionLogger.warn(`API Start: ${requestTime}`);
//             extensionLogger.warn(`API Account: ${accountNo.substring(0, 5)}-${accountNo.slice(-5)}`);
//             resolve(true);
//           });
//         });
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// }

function buildHeader(verb, noun, revision = "1.4", userId = "EU_OSC", organizaition = "SOCO") {
  return {
    verb,
    noun,
    revision,
    userId,
    organizaition,
    transactionId: getCurrentTimestamp(),
  };
}

async function callEnrolledProgramAPI(accountNo, sessionToken, profileId, interfaceUrl) {
  try {
    // check if account number is valid
    if (accountNo && parseInt(accountNo, 10)) {
      const IExtensionProvider = await ORACLE_SERVICE_CLOUD.extension_loader.load("ExternalSearchResultsExt", "1");
      const gContext = await IExtensionProvider.getGlobalContext();
      const loggedInName = await gContext.invokeAction("getLoggedInName");

      const Request = {};
      const Payload = {};
      const EnrolledPrograms = {};
      const BaseRequest = {};

      BaseRequest.transactionId = getCurrentTimestamp();
      BaseRequest.userId = loggedInName.result
        .find((i) => i != null)
        .split("@")[0]
        .toUpperCase();

      EnrolledPrograms.accountNo = accountNo;
      EnrolledPrograms.channel = "OSCDA";
      EnrolledPrograms.opCo = "2";
      EnrolledPrograms.callType = "3";
      EnrolledPrograms.BaseRequest = BaseRequest;

      Payload.EnrolledPrograms = EnrolledPrograms;

      // Request.Header = Header;
      Request.Payload = Payload;

      const requestString = JSON.stringify(Request);

      // const startTime = new Date();

      callOICAPI(requestString, "CUSTOM_CFG_FCC_PROGRAM_ENROLLMENT_API_URL", sessionToken, profileId, interfaceUrl)
        .then(async (response) => {
          const responseString = JSON.stringify(response);
          sessionStorage.setItem(`enrolledPrograms_${accountNo}`, responseString);

          // logAPI360(startTime, requestString, responseString, accountNo, `360_EnrolledPrograms`, "CUSTOM_CFG_FCC_PROGRAM_ENROLLMENT_API_URL");
        })
        .catch(() => {
          sessionStorage.setItem(`enrolledPrograms_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        });
    } else {
      sessionStorage.setItem(`enrolledPrograms_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
      // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the account number is either 0 or null", accountNo, `360_EnrolledPrograms`, "CUSTOM_CFG_FCC_PROGRAM_ENROLLMENT_API_URL");
    }
  } catch (e) {
    sessionStorage.setItem(`enrolledPrograms_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
  }
}

async function callUsageInfoAPI(accountNo, sessionToken, profileId, interfaceUrl) {
  try {
    // check if account number is valid
    if (accountNo && parseInt(accountNo, 10)) {
      const Request = {};
      const Header = buildHeader("get", "usageInfo");
      const Payload = {};
      const UsageInfo = {};
      const startYearMonth = {};
      const endYearMonth = {};

      UsageInfo.accountNo = accountNo;

      const currentDate = new Date();

      const startMonth = (currentDate.getMonth() + 1).toString();
      const endMonth = (currentDate.getMonth() + 1).toString();

      startYearMonth.year = (currentDate.getFullYear() - 1).toString();
      startYearMonth.month = startMonth.length === 1 ? `0${startMonth}` : startMonth;

      endYearMonth.year = currentDate.getFullYear().toString();
      endYearMonth.month = endMonth.length === 1 ? `0${endMonth}` : endMonth;

      UsageInfo.startYearMonth = startYearMonth;
      UsageInfo.endYearMonth = endYearMonth;

      Payload.UsageInfo = UsageInfo;

      Request.Header = Header;
      Request.Payload = Payload;

      const requestString = JSON.stringify(Request);

      // const startTime = new Date();

      callOICAPI(requestString, "CUSTOM_CFG_FCC_USAGE_INFO_API_URL", sessionToken, profileId, interfaceUrl)
        .then(async (response) => {
          const usageArr = response.Payload.UsageInfo;
          const responseString = JSON.stringify(usageArr);
          sessionStorage.setItem(`usageInfo_${accountNo}`, responseString);
          sessionStorage.setItem(`usageInfoChart_${accountNo}`, responseString);

          // logAPI360(startTime, requestString, responseString, accountNo, `360_UsageInfo`, "CUSTOM_CFG_FCC_USAGE_INFO_API_URL");
        })
        .catch(() => {
          sessionStorage.setItem(`usageInfo_${accountNo}`, JSON.stringify([]));
          sessionStorage.setItem(`usageInfoChart_${accountNo}`, JSON.stringify([]));
        });
    } else {
      sessionStorage.setItem(`usageInfo_${accountNo}`, JSON.stringify([]));
      sessionStorage.setItem(`usageInfoChart_${accountNo}`, JSON.stringify([]));
      // Set Logs
      // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the account number is either 0 or null", accountNo, `360_UsageInfo`, "CUSTOM_CFG_FCC_USAGE_INFO_API_URL");
    }
  } catch (e) {
    sessionStorage.setItem(`usageInfo_${accountNo}`, JSON.stringify([]));
    sessionStorage.setItem(`usageInfoChart_${accountNo}`, JSON.stringify([]));
  }
}

async function callCriticalContactAPI(accountNo, premiseNo, customerNo, sessionToken, profileId, interfaceUrl) {
  try {
    // Check if these 3 required parameters are valid
    // if NOT then don't call the api
    let accountNoValid = true;
    let premiseNoValid = true;
    let customerNoValid = true;
    // let errorMessage = "";

    if (!(accountNo && parseInt(accountNo, 10))) {
      accountNoValid = false;
      // errorMessage = "WARNING!! API call was not made because the account number is either 0 or null";
    }
    if (!(premiseNo && parseInt(premiseNo, 10))) {
      premiseNoValid = false;
      // errorMessage = "WARNING!! API call was not made because the premise number is either 0 or null";
    }
    if (!(customerNo && parseInt(customerNo, 10))) {
      customerNoValid = false;
      // errorMessage = "WARNING!! API call was not made because the customer number is either 0 or null";
    }

    if (accountNoValid && premiseNoValid && customerNoValid) {
      const Request = {};
      const Header = buildHeader("post", "otherCustomerInfo");
      const Payload = {};
      const CriticalContacts = {};

      CriticalContacts.accountNo = accountNo;
      CriticalContacts.premiseNo = premiseNo;
      CriticalContacts.customerNo = customerNo;

      Payload.CriticalContacts = CriticalContacts;

      Request.Header = Header;
      Request.Payload = Payload;

      const requestString = JSON.stringify(Request);

      // const startTime = new Date();

      callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_VIEW_CONTACT_ALL", sessionToken, profileId, interfaceUrl)
        .then(async (response) => {
          const responseString = JSON.stringify(response);
          sessionStorage.setItem(`criticalContact_${accountNo}`, responseString);

          // logAPI360(startTime, requestString, responseString, accountNo, `360_CriticalContact`, "CUSTOM_CFG_CRITICAL_CONTACTS");
        })
        .catch(() => {
          sessionStorage.setItem(`criticalContact_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        });
    } else {
      sessionStorage.setItem(`criticalContact_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
      // logAPI360(new Date(), "NA", errorMessage, accountNo, `360_CriticalContact`, "CUSTOM_CFG_CRITICAL_CONTACTS");
    }
  } catch (e) {
    sessionStorage.setItem(`criticalContact_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
  }
}

async function callUnpaidBillsAPI(customerNo, sessionToken, profileId, interfaceUrl) {
  try {
    // check if the account no has a value and not 0 before calling the api
    if (customerNo && parseInt(customerNo, 10)) {
      const Request = {};
      const Payload = {};
      const GetUnpaidBill = {};
      const BaseRequest = {};

      BaseRequest.transactionId = getCurrentTimestamp();
      BaseRequest.userId = "EU_OSC";

      GetUnpaidBill.BaseRequest = BaseRequest;
      GetUnpaidBill.customerNumber = customerNo;
      Payload.GetUnpaidBill = GetUnpaidBill;
      Request.Payload = Payload;

      const requestString = JSON.stringify(Request);

      // const startTime = new Date();

      callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_UNPAID_BILLS", sessionToken, profileId, interfaceUrl)
        .then(async (response) => {
          const unpaidBills = response.Payload.GetUnpaidBill.Customer.Accounts;
          let responseString = "";
          if (unpaidBills === undefined) {
            responseString = JSON.stringify([]);
            sessionStorage.setItem(`unpaidBills_${customerNo}`, JSON.stringify([]));
          } else {
            responseString = JSON.stringify(unpaidBills);
            sessionStorage.setItem(`unpaidBills_${customerNo}`, responseString);
          }

          // logAPI360(startTime, requestString, responseString, customerNo, `ServiceOrder_UnpaidBill`, "CUSTOM_CFG_SOCOMLP_UNPAID_BILLS");
        })
        .catch(() => {
          sessionStorage.setItem(`unpaidBills_${customerNo}`, JSON.stringify([]));
        });
    } else {
      sessionStorage.setItem(`unpaidBills_${customerNo}`, JSON.stringify([]));
      // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the customer number is either 0 or null", customerNo, `ServiceOrder_UnpaidBill`, "CUSTOM_CFG_SOCOMLP_UNPAID_BILLS");
    }
  } catch (e) {
    sessionStorage.setItem(`unpaidBills_${customerNo}`, JSON.stringify([]));
  }
}

function callOtherInfoAPI(customerNo, accountNo, sessionToken, profileId, interfaceUrl) {
  try {
    // Check if these 3 required parameters are valid
    // if NOT then don't call the api
    let accountNoValid = true;
    let premiseNoValid = true;
    let customerNoValid = true;
    let companyCodeValid = true;
    // let errorMessage = "";

    if (!(accountNo && parseInt(accountNo, 10))) {
      accountNoValid = false;
      // errorMessage = "WARNING!! API call was not made because the account number is either 0 or null";
    }
    if (!(customerNo && parseInt(customerNo, 10))) {
      customerNoValid = false;
      // errorMessage = "WARNING!! API call was not made because the customer number is either 0 or null";
    }

    if (accountNoValid && premiseNoValid && customerNoValid && companyCodeValid) {
      const Request = {};
      const Header = buildHeader("post", "otherCustomerInfo");
      const Payload = {};
      const BaseRequest = {};
      const OtherCustomerInfo = {};

      BaseRequest.transactionId = getCurrentTimestamp();
      BaseRequest.userId = "X2RGDEZA";
      Payload.BaseRequest = BaseRequest;

      OtherCustomerInfo.customerNo = customerNo;

      Payload.OtherCustomerInfo = OtherCustomerInfo;

      Request.Header = Header;
      Request.Payload = Payload;

      const requestString = JSON.stringify(Request);

      // const st = new Date();

      callOICAPI(requestString, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO", sessionToken, profileId, interfaceUrl)
        .then(async (response) => {
          const responseString = JSON.stringify(response);
          sessionStorage.setItem(`otherInfo_${accountNo}`, responseString);
          // logAPI360(st, requestString, responseString, accountNo, `360_OtherInfo`, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO");
        })
        .catch(() => {
          sessionStorage.setItem(`otherInfo_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        });
    } else {
      // logAPI360(new Date(), "NA", errorMessage, accountNo, `360_OtherInfo`, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO");
    }
  } catch (e) {
    sessionStorage.setItem(`otherInfo_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
  }
}

export function callOtherInfoAPIShell(customerNo, accountNo, sessionToken, profileId, interfaceUrl) {
  return new Promise((resolve) => {
    try {
      // Check if these 3 required parameters are valid
      // if NOT then don't call the api
      let accountNoValid = true;
      let premiseNoValid = true;
      let customerNoValid = true;
      let companyCodeValid = true;
      // let errorMessage = "";

      if (accountNoValid && premiseNoValid && customerNoValid && companyCodeValid) {
        const Request = {};
        const Header = buildHeader("post", "otherCustomerInfo");
        const Payload = {};
        const BaseRequest = {};
        const OtherCustomerInfo = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = "X2RGDEZA";
        Payload.BaseRequest = BaseRequest;

        OtherCustomerInfo.customerNo = customerNo;

        Payload.OtherCustomerInfo = OtherCustomerInfo;

        Request.Header = Header;
        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const st = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO", sessionToken, profileId, interfaceUrl).then(async (response) => {
          resolve(response);
          // logAPI360(st, requestString, responseString, accountNo, `360_OtherInfo`, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO");
        });
      } else {
        // logAPI360(new Date(), "NA", errorMessage, accountNo, `360_OtherInfo`, "CUSTOM_CFG_HIGH_BILL_OTHER_INFO");
      }
    } catch (e) {
      console.error("otherinfoshell api failed");
    }
  });
}

async function getMessageBase(opco, rate, sessionToken, interfaceUrlRest, accountNumber) {
  const messageBaseKey = `CUSTOM_MSG_SOCO_RATE_${opco}_${rate}`;
  // `https://accenture6--tst1.custhelp.com/services/rest/connect/v1.4/queryResults/?query=select id, lookupname from messagebases where lookupname='${param}';`;
  const restInterfaceUrl = `${interfaceUrlRest}/connect/v1.4/queryResults/?query=select value from messagebases where lookupname='${messageBaseKey}'`;
  const messageObj = {};
  messageObj.api = "restquery";
  messageObj.sessionToken = sessionToken; // currently logged in session token
  messageObj.interfaceUrl = restInterfaceUrl;

  // const startTime = new Date();

  callGetRequest(restInterfaceUrl, sessionToken)
    .then((ratevalue) => {
      try {
        const socorate = ratevalue.items[0].rows[0][0];
        sessionStorage.setItem(`socoRate_${accountNumber}`, socorate);

        // logAPI360(startTime, restInterfaceUrl, socorate, accountNumber, `360_MessageBase`, "360_MessageBase");
      } catch (e) {
        /* handle error */
      }
    })
    .catch(() => {
      /* handle error */
    });
}

function callCustomerInfoCDM(accountNo, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve, reject) => {
    try {
      // check if account number is valid
      if (accountNo && parseInt(accountNo, 10)) {
        const Request = {};
        const Payload = {};
        const CustomerInfo = {};
        const BaseRequest = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = userId;

        CustomerInfo.BaseRequest = BaseRequest;
        CustomerInfo.accountNo = accountNo;

        Payload.CustomerInfo = CustomerInfo;

        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const startTime = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CDM", sessionToken, profileId, interfaceUrl)
          .then((response) => {
            const responseString = JSON.stringify(response);
            sessionStorage.setItem(`customerInfo_CDM_${accountNo}`, responseString);

            // logAPI360(startTime, requestString, responseString, accountNo, `360_Customer_Info_CDM`, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CDM");

            resolve(response);
          })
          .catch(() => {
            sessionStorage.setItem(`customerInfo_CDM_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
          });
      } else {
        sessionStorage.setItem(`customerInfo_CDM_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the account number is either 0 or null", accountNo, `360_Customer_Info_CDM`, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CDM");
        reject(new Error("Required parameters not met"));
      }
    } catch (e) {
      sessionStorage.setItem(`customerInfo_CDM_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
      reject(e);
    }
  });
}

function callBillSummaryAPIUpdated(accountNo, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve, reject) => {
    try {
      // check if account number is valid
      if (accountNo && parseInt(accountNo, 10)) {
        const Request = {};
        const Payload = {};
        const GetPaymentHistory = {};
        const BaseRequest = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = userId;

        Payload.BaseRequest = BaseRequest;
        GetPaymentHistory.accountNo = accountNo;

        Payload.GetPaymentHistory = GetPaymentHistory;

        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const startTime = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_GET_PAYMENTS", sessionToken, profileId, interfaceUrl)
          .then((response) => {
            const responseString = JSON.stringify(response);
            sessionStorage.setItem(`billingSummary_${accountNo}`, responseString);

            // logAPI360(startTime, requestString, responseString, accountNo, `360_BillingSummary`, "CUSTOM_CFG_SOCOMLP_GET_PAYMENTS");

            resolve(response);
          })
          .catch(() => {
            sessionStorage.setItem(`billingSummary_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
          });
      } else {
        sessionStorage.setItem(`billingSummary_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the account number is either 0 or null", accountNo, `360_BillingSummary`, "CUSTOM_CFG_SOCOMLP_GET_PAYMENTS");
        reject(new Error("Required parameters not met"));
      }
    } catch (e) {
      sessionStorage.setItem(`billingSummary_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
      reject(e);
    }
  });
}

function callCustomerInfoCSS(accountNo, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve, reject) => {
    try {
      // check if account number is valid
      if (accountNo && parseInt(accountNo, 10)) {
        const Request = {};
        const Payload = {};
        const CustomerInfo = {};
        const BaseRequest = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = userId;

        CustomerInfo.BaseRequest = BaseRequest;
        CustomerInfo.accountNo = accountNo;

        Payload.CustomerInfo = CustomerInfo;

        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const startTime = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CSS", sessionToken, profileId, interfaceUrl)
          .then((response) => {
            const responseString = JSON.stringify(response);
            sessionStorage.setItem(`customerInfo_CSS_${accountNo}`, responseString);

            // logAPI360(startTime, requestString, responseString, accountNo, `360_Customer_Info_CSS`, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CSS");

            resolve(response);
          })
          .catch(() => {
            sessionStorage.setItem(`customerInfo_CSS_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
          });
      } else {
        sessionStorage.setItem(`customerInfo_CSS_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
        // logAPI360(new Date(), "NA", "WARNING!! API call was not made because the account number is either 0 or null", accountNo, `360_Customer_Info_CSS`, "CUSTOM_CFG_SOCOMLP_CUSTOMER_INFO_CSS");
        reject(new Error("Required parameters not met"));
      }
    } catch (e) {
      sessionStorage.setItem(`customerInfo_CSS_${accountNo}`, JSON.stringify({ Result: { status: "FAILED" } }));
      reject(e);
    }
  });
}

function callCustomerInfoCDMCSS(accountNumber, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve) => {
    Promise.allSettled([callCustomerInfoCDM(accountNumber, sessionToken, profileId, interfaceUrl, userId), callCustomerInfoCSS(accountNumber, sessionToken, profileId, interfaceUrl, userId)])
      .then((results) => {
        const customerInfoAll = {};
        customerInfoAll.Payload = {};
        customerInfoAll.Payload.CustomerInfo = {};
        customerInfoAll.Payload.cdmApiStatus = "fail";
        customerInfoAll.Payload.cssApiStatus = "fail";

        // check customer info cdm response and store to object
        const cdmResponse = results[0].value;

        if (cdmResponse.Result.status.toLowerCase() === "ok") {
          customerInfoAll.Payload.cdmApiStatus = "ok";
          customerInfoAll.Payload.CustomerInfo = { ...cdmResponse.Payload.CustomerInfo, fullname: cdmResponse.Payload.CustomerInfo.fullName };
        }

        // check customer info css response and store to object
        const cssResponse = results[1].value;

        if (cssResponse.Result.status.toLowerCase() === "ok" || cssResponse.Result.status.toLowerCase() === "partial") {
          customerInfoAll.Payload.cssApiStatus = cssResponse.Result.status.toLowerCase();
          customerInfoAll.Payload.CustomerInfo = { ...customerInfoAll.Payload.CustomerInfo, ...cssResponse.Payload.CustomerInfo, ...cssResponse.Payload.CustomerInfo?.AccountBalance };

          // flatten customerinfo all properties so that it won't break the existing parsing of properties in the workspace
          customerInfoAll.Payload.CustomerInfo.premiseNo = cssResponse.Payload.CustomerInfo?.AccountInquiry?.premiseNo;
          customerInfoAll.Payload.CustomerInfo.customerNo = cssResponse.Payload.CustomerInfo?.AccountInquiry?.customerNo;
          customerInfoAll.Payload.CustomerInfo.pin = cssResponse.Payload.CustomerInfo?.AccountInquiry?.pin;
          customerInfoAll.Payload.CustomerInfo.ssn = cssResponse.Payload.CustomerInfo?.AccountInquiry?.SSN;
          customerInfoAll.Payload.CustomerInfo.accountOpenDate = cssResponse.Payload.CustomerInfo?.AccountInquiry?.accountOpenDate;
          customerInfoAll.Payload.CustomerInfo.bankruptcy = cssResponse.Payload.CustomerInfo?.AccountInquiry?.bankruptcy;
          customerInfoAll.Payload.CustomerInfo.cashOnly = cssResponse.Payload.CustomerInfo?.AccountInquiry?.cashOnly;
          customerInfoAll.Payload.CustomerInfo.operatingCenter = cssResponse.Payload.CustomerInfo?.AccountInquiry?.operatingCenter;
          customerInfoAll.Payload.CustomerInfo.priorityCode = cssResponse.Payload.CustomerInfo?.AccountInquiry?.priorityCode;
          customerInfoAll.Payload.CustomerInfo.priorityReason = cssResponse.Payload.CustomerInfo?.AccountInquiry?.priorityReason;
        }

        // Set the overall status
        customerInfoAll.Result = {};
        customerInfoAll.Result.status = customerInfoAll.Payload.cdmApiStatus !== "fail" && customerInfoAll.Payload.cssApiStatus !== "fail" ? "ok" : "fail";

        // store combined results in the session storage
        const response = JSON.stringify(customerInfoAll);
        // console.log("customerinfoall", response);
        sessionStorage.setItem(`customerInfo_all_${accountNumber}`, response);

        resolve(customerInfoAll);
      })
      .catch((error) => {
        console.log("customerinfoallerror", error.message);
        resolve(false);
      });
  });
}

function getPremise(accountNo, premiseNo, companyCode, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve) => {
    try {
      let premiseNoValid = true;
      let companyCodeValid = true;
      // let errorMessage = "";

      if (!(premiseNo && parseInt(premiseNo, 10))) {
        premiseNoValid = false;
        // errorMessage = "WARNING!! API call was not made because the premise number is either 0 or null";
      }
      if (!(companyCode && parseInt(companyCode, 10))) {
        companyCodeValid = false;
        // errorMessage = "WARNING!! API call was not made because the company code is either 0 or null";
      }
      if (premiseNoValid && companyCodeValid) {
        const Request = {};
        const Payload = {};
        const GetPremise = {};
        const BaseRequest = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = userId;

        GetPremise.BaseRequest = BaseRequest;
        GetPremise.premiseNo = premiseNo;
        GetPremise.companyCode = companyCode;

        Payload.GetPremise = GetPremise;

        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const startTime = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_GET_PREMISE", sessionToken, profileId, interfaceUrl)
          .then((response) => {
            // const responseString = JSON.stringify(response);
            // logAPI(startTime, requestString, responseString, accountNo, `getPremise`, "CUSTOM_CFG_SOCOMLP_GET_PREMISE");
            resolve(response);
          })
          .catch(() => {
            resolve(false);
          });
      } else {
        // logAPI(new Date(), "NA", errorMessage, accountNo, `getPremise`, "CUSTOM_CFG_SOCOMLP_GET_PREMISE");
        resolve(false);
      }
    } catch (e) {
      resolve(false);
    }
  });
}

function getPremiseMeters(accountNo, premiseNo, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve) => {
    try {
      let premiseNoValid = true;
      // let errorMessage = "";

      if (!(premiseNo && parseInt(premiseNo, 10))) {
        premiseNoValid = false;
        // errorMessage = "WARNING!! API call was not made because the premise number is either 0 or null";
      }

      if (premiseNoValid) {
        const Request = {};
        const Payload = {};
        const GetPremiseMeters = {};
        const BaseRequest = {};

        BaseRequest.transactionId = getCurrentTimestamp();
        BaseRequest.userId = userId;

        GetPremiseMeters.premiseNo = premiseNo;

        Payload.BaseRequest = BaseRequest;
        Payload.GetPremiseMeters = GetPremiseMeters;

        Request.Payload = Payload;

        const requestString = JSON.stringify(Request);

        // const startTime = new Date();

        callOICAPI(requestString, "CUSTOM_CFG_SOCOMLP_GET_PREMISE_METERS", sessionToken, profileId, interfaceUrl)
          .then((response) => {
            // const responseString = JSON.stringify(response);
            // logAPI(startTime, requestString, responseString, accountNo, `getPremiseMeters`, "CUSTOM_CFG_SOCOMLP_GET_PREMISE_METERS");
            resolve(response);
          })
          .catch(() => {
            resolve(false);
          });
      } else {
        // logAPI(new Date(), "NA", errorMessage, accountNo, `getPremiseMeters`, "CUSTOM_CFG_SOCOMLP_GET_PREMISE_METERS");
        resolve(false);
      }
    } catch (e) {
      resolve(false);
    }
  });
}

function getPremiseDetails(accountNo, premiseNo, companyCode, sessionToken, profileId, interfaceUrl, userId) {
  return new Promise((resolve) => {
    try {
      let premiseDetails = {};
      premiseDetails.Payload = {};
      premiseDetails.Result = {};
      premiseDetails.Result.getPremiseStatus = "fail";
      premiseDetails.Result.getPremiseMetersStatus = "fail";

      Promise.allSettled([
        getPremise(accountNo, premiseNo, companyCode, sessionToken, profileId, interfaceUrl, userId),
        getPremiseMeters(accountNo, premiseNo, sessionToken, profileId, interfaceUrl, userId),
      ]).then((results) => {
        // Parse getPremise
        const getPremiseResponse = results[0].value;
        if (getPremiseResponse && getPremiseResponse.Result.status.toLowerCase() === "ok") {
          premiseDetails.Result.getPremiseStatus = "ok";
          premiseDetails.Payload.GetPremise = { ...getPremiseResponse.Payload.GetPremise };
        }

        // Parse getPremiseMeters
        const getPremiseMetersResponse = results[1].value;
        if (getPremiseMetersResponse && getPremiseMetersResponse.Result.status.toLowerCase() === "ok") {
          premiseDetails.Result.getPremiseMetersStatus = "ok";
          premiseDetails.Payload.getPremiseMeters = { ...getPremiseMetersResponse.Payload.GetPremiseMeters };
        }

        const premiseDetailsString = JSON.stringify(premiseDetails);
        sessionStorage.setItem(`premiseDetails_all_${accountNo}`, premiseDetailsString);
        resolve(premiseDetails);
      });
    } catch (e) {
      console.log("premiseapi error", e.message);
    }
  });
}

function callPostRequest(url = "", sessionToken, body = {}) {
  return new Promise((resolve) => {
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Session ${sessionToken}`,
        "Content-Type": "application/json",
        "OSvC-CREST-Application-Context": "post request",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch(() => resolve(false));
  });
}

function createContact(acctNum, fname, lname, sessionToken, interfaceUrlRest) {
  return new Promise((resolve) => {
    const url = `${interfaceUrlRest}/connect/v1.4/contacts`;
    const body = {};
    body.name = {};
    body.name.first = fname;
    body.name.last = lname;

    body.customFields = {};
    body.customFields.c = {};
    body.customFields.c.acct_num = acctNum;

    callPostRequest(url, sessionToken, body)
      .then((response) => {
        if (response) {
          resolve(response.id);
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
}

const searchOsvcAccount = async (acctNum, interfaceUrlRest, sessionToken) => {
  const url = `${interfaceUrlRest}/connect/v1.4/queryResults/?query=select id from Contacts where Contacts.CustomFields.c.acct_num='${acctNum}'`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Session ${sessionToken}`,
        "Content-Type": "application/json",
        "OSvC-CREST-Application-Context": "get request",
      },
    });
    const data = await response.json();
    const id = data.items[0].rows[0][0];
    return id;
  } catch (e) {
    return false;
  }
};

function AccountSearchPerformance(accountNumber, sessionToken, profileId, interfaceUrl, interfaceUrlRest, userId) {
  return new Promise((resolve) => {
    Promise.allSettled([
      callCustomerInfoCDMCSS(accountNumber, sessionToken, profileId, interfaceUrl, userId).then((response) => {
        // Check if customerinfo response is successful before calling dependent apis
        if (response && response.Payload.cssApiStatus !== "fail") {
          sessionStorage.setItem("customer_search_contact", JSON.stringify(response));
          callOtherInfoAPI(response.Payload.CustomerInfo.AccountInquiry.customerNo, accountNumber, sessionToken, profileId, interfaceUrl);
          callUnpaidBillsAPI(response.Payload.CustomerInfo.AccountInquiry.customerNo, sessionToken, profileId, interfaceUrl);
          callCriticalContactAPI(accountNumber, response.Payload.CustomerInfo.AccountInquiry.premiseNo, response.Payload.CustomerInfo.AccountInquiry.customerNo, sessionToken, profileId, interfaceUrl);
          getPremiseDetails(
            accountNumber,
            response.Payload.CustomerInfo.AccountInquiry.premiseNo,
            response.Payload.CustomerInfo.operatingCompany.toLowerCase().trim() === "gpc" ? "02" : "05",
            sessionToken,
            profileId,
            interfaceUrl,
            userId
          ).then((svcresponse) => {
            if (response.Payload.cdmApiStatus === "ok" && svcresponse.Result.getPremiseStatus.toLowerCase() === "ok") {
              const opco = response.Payload.CustomerInfo?.operatingCompany.toUpperCase();
              // const rate = svcresponse.Payload.ServiceMeterInfo[0].servicePoints[0].rate;
              if (svcresponse.Payload.GetPremise?.ServicePoints) {
                const rate = svcresponse.Payload.GetPremise?.ServicePoints[0].TariffSchedule.code;
                getMessageBase(opco, rate, sessionToken, interfaceUrlRest, accountNumber);
              }
            }
          });
          resolve(response);
        } else {
          // customerinfo api failed, set the session storage for the dependent api
          // this is to make sure 360 will not continue loading
          sessionStorage.setItem("customer_search_contact", JSON.stringify({ Result: { status: "FAILED" } }));
          sessionStorage.setItem(`otherInfo_${accountNumber}`, JSON.stringify({ Result: { status: "FAILED" } }));
          sessionStorage.setItem(`criticalContact_${accountNumber}`, JSON.stringify({ Result: { status: "FAILED" } }));
          sessionStorage.setItem(`serviceMeterInfo_${accountNumber}`, JSON.stringify({ Result: { status: "FAILED" } }));
          sessionStorage.setItem(`unpaidBills_${"error"}`, JSON.stringify([]));
          resolve(false);
        }
      }),
      callEnrolledProgramAPI(accountNumber, sessionToken, profileId, interfaceUrl),
      callBillSummaryAPIUpdated(accountNumber, sessionToken, profileId, interfaceUrl, userId),
      callUsageInfoAPI(accountNumber, sessionToken, profileId, interfaceUrl),
    ]);
  });
}

export const callAccountSearchApi = (accountNumber, extensionProvider, sessionToken, profileId, interfaceUrl, interfaceUrlRest, login) => {
  Promise.allSettled([
    searchOsvcAccount(accountNumber, interfaceUrlRest, sessionToken).then((id) => {
      if (id) {
        extensionProvider.registerWorkspaceExtension((workspaceRecord) => {
          sessionStorage.setItem(`fromSearch_${accountNumber}`, true);
          workspaceRecord.editWorkspaceRecord("Contact", id);
        });
      }
    }),
    AccountSearchPerformance(accountNumber, sessionToken, profileId, interfaceUrl, interfaceUrlRest, login),
    searchOsvcAccount(accountNumber, interfaceUrlRest, sessionToken),
  ]).then((results) => {
    if (!results[2].value && results[1].value) {
      const customerObj = results[1].value;
      if (customerObj.Result.status.toLowerCase() === "ok") {
        const fname = customerObj.Payload.CustomerInfo.fname;
        const lname = customerObj.Payload.CustomerInfo.lname;
        createContact(accountNumber, fname, lname, sessionToken, interfaceUrlRest)
          .then((response) => {
            if (response) {
              extensionProvider.registerWorkspaceExtension((workspaceRecord) => {
                sessionStorage.setItem(`fromSearch_${accountNumber}`, true);
                workspaceRecord.editWorkspaceRecord("Contact", response);
              });
            }
          })
          .catch(() => console.log("error in creating an account"));
      }
    }
  });
};
