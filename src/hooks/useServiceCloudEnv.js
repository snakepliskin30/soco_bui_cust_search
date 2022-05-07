import { useState, useCallback } from "react";

export const useServiceCloudEnv = () => {
  const [osvcExtensionProv, setOsvcExtensionProv] = useState(null);
  const [osvcGlobalContext, setOsvcGlobalContext] = useState(null);
  const [osvcSessionToken, setOsvcSessionToken] = useState("");
  const [osvcProfileId, setOsvcProfileId] = useState("");
  const [osvcInterfaceUrl, setOsvcInterfaceUrl] = useState("");
  const [osvcInterfaceUrlREST, setOsvcInterfaceUrlREST] = useState("");
  const [osvcEnvironmentParams, setOsvcEnvironmentParams] = useState({});
  const [osvcLoginName, setOsvcLoginName] = useState("");

  const getOsVcEnvValues = useCallback(async () => {
    const IExtensionProvider = await ORACLE_SERVICE_CLOUD.extension_loader.load("ExternalSearchResultsExt", "1");
    const globalContext = await IExtensionProvider.getGlobalContext();
    const sessionToken = await globalContext.getSessionToken();
    const profileId = globalContext.getProfileId();
    const interfaceUrl = globalContext.getInterfaceUrl();
    const interfaceUrlREST = globalContext.getInterfaceServiceUrl("REST");
    let userId;

    globalContext.invokeAction("getLoggedInDetails").then((loggedInName) => {
      const userDetails = loggedInName.result.find((i) => i != null);
      userId = userDetails.login.split("@")[0].toUpperCase();
    });

    setOsvcExtensionProv(IExtensionProvider);
    setOsvcGlobalContext(globalContext);
    setOsvcSessionToken(sessionToken);
    setOsvcProfileId(profileId);
    setOsvcInterfaceUrl(interfaceUrl);
    setOsvcInterfaceUrlREST(interfaceUrlREST);
    setOsvcLoginName(userId);
    setOsvcEnvironmentParams({
      osvcExtensionProv,
      osvcGlobalContext,
      osvcSessionToken,
      osvcProfileId,
      osvcLoginName,
      osvcInterfaceUrl,
      osvcInterfaceUrlREST,
    });

    return true;
  }, []);

  return {
    osvcExtensionProv,
    osvcGlobalContext,
    osvcSessionToken,
    osvcProfileId,
    osvcInterfaceUrl,
    osvcInterfaceUrlREST,
    osvcEnvironmentParams,
    getOsVcEnvValues,
  };
};
