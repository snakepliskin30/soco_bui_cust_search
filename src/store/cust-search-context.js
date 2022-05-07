import React from "react";

const CustSearchContext = React.createContext({
  searchParams: {},
  searchResult: [],
  showModal: false,
  updateSearchParams: () => {},
  searchHandler: () => {},
  showModalHandler: () => {},
  getOsvcParams: () => {},
});

export default CustSearchContext;
