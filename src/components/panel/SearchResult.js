import React, { Fragment, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import SearchContextMenu from "../layout/SearchContextMenu";
import ButtonCancel from "../ui/ButtonCancel";

//Datatable Modules
import "jquery/dist/jquery.min.js";
import "datatables.net/js/jquery.dataTables";
import "datatables.net-rowgroup/js/dataTables.rowGroup.min.js";
import $ from "jquery";

import CustSearchContext from "../../store/cust-search-context";

import "datatables.net-dt/css/jquery.dataTables.css";

import classes from "./SearchResult.module.css";

const SearchResult = () => {
  const searchContext = useContext(CustSearchContext);
  const [selectedRow, setSelectedRow] = useState({});
  const [xLoc, setXLoc] = useState(0);
  const [yLoc, setYLoc] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const buildSearchTable = () => {
    let columns;
    let columnDefs;
    if (searchContext.searchResult.isCustSearch) {
      columns = [
        { data: "address", title: "Premise Address" },
        { data: "addressNotes", title: "Address Notes" },
        { data: "accountNoFormatted", title: "Account Number" },
        { data: "accountStatus", title: "Account Status" },
        { data: "revenueClass", title: "Revenue Class" },
        { data: "groupByField", title: "Group By" },
      ];
      columnDefs = [
        {
          targets: [5], //Comma separated values
          visible: false,
          searchable: false,
        },
        {
          width: "40%",
          targets: 0,
        },
      ];
    } else {
      columns = [
        { data: "fullname", title: "Customer Name" },
        { data: "addressNotes", title: "Address Notes" },
        { data: "accountNoFormatted", title: "Account Number" },
        { data: "accountStatus", title: "Account Status" },
        { data: "revenueClass", title: "Revenue Class" },
        { data: "groupByField", title: "Group By" },
      ];
      columnDefs = [
        {
          targets: [1, 5], //Comma separated values
          visible: false,
          searchable: false,
        },
        {
          width: "40%",
          targets: 0,
        },
      ];
    }
    let collapsedGroups = {};
    const oTable = $("#searchResultTable").DataTable({
      destroy: true,
      paging: false,
      bFilter: false,
      bInfo: false,
      data: searchContext.searchResult.data,
      columns: columns,
      columnDefs: columnDefs,
      language: {
        search: "Table search: ",
      },
      orderFixed: [[5, "asc"]],
      createdRow: function (row, data) {
        $(row).attr("data-accountnum", data.accountNo);
        $(row).attr("data-customernum", data.customerNo);
        $(row).attr("data-revenueclass", data.revenueClass);
      },
      rowGroup: {
        // Uses the 'row group' plugin
        dataSrc: "groupByField",
        startRender: function (rows, group) {
          let collapsed;
          // var collapsed = !!collapsedGroups[group]; // default to collapse all; original code
          if (expandAll) {
            collapsed = !collapsedGroups[group]; // default to expand all
          } else {
            collapsed = !!collapsedGroups[group];
          }

          rows.nodes().each(function (r) {
            r.style.display = "none";
            if (collapsed) {
              r.style.display = "";
            }
          });
          // Add category name to the <tr>. NOTE: Hardcoded colspan
          return $("<tr/>")
            .append('<td colspan="8">' + group + " (" + rows.count() + ")</td>")
            .attr("data-name", group)
            .toggleClass("collapsed", collapsed);
        },
      },
    });

    $("#searchResultTable tbody").on("click", "tr.dtrg-start", function () {
      const name = $(this).data("name");
      collapsedGroups[name] = !collapsedGroups[name];
      oTable.draw(false);
    });

    document
      .querySelector("thead")
      .classList.add(`${classes.result_table_header}`);
    const rows = document.querySelectorAll("tr:not(.dtrg-start)");
    rows.forEach((e) => {
      e.addEventListener("contextmenu", contextMenuHandler);
    });
  };

  const contextMenuHandler = (e) => {
    console.log(e.target.closest("tr").dataset.accountnum);
    e.preventDefault();
    e.clientX + 200 > window.innerWidth
      ? setXLoc(window.innerWidth - 210)
      : setXLoc(e.clientX - 10);
    e.clientY + 70 > window.innerHeight
      ? setYLoc(window.innerHeight - 70)
      : setYLoc(e.clientY - 10);
    setSelectedRow({
      accountNo: e.target.closest("tr").dataset.accountnum,
      customerNo: e.target.closest("tr").dataset.customernum,
      revenueClass: e.target.closest("tr").dataset.revenueclass,
    });
    setShowMenu(true);
  };

  useEffect(() => {
    if (
      searchContext.searchResult?.data.length > 0 &&
      (searchContext.searchResult?.isCustSearch ||
        searchContext.searchResult?.isPremiseSearch)
    ) {
      buildSearchTable();
    }
  }, [searchContext.searchResult]);

  useEffect(() => {
    if (
      searchContext.searchResult?.data.length > 0 &&
      (searchContext.searchResult?.isCustSearch ||
        searchContext.searchResult?.isPremiseSearch)
    ) {
      buildSearchTable();
    }
  }, [expandAll]);

  const hideContextMenu = () => {
    setShowMenu(false);
  };

  const expandAllHandler = () => {
    setExpandAll((current) => !current);
  };

  if (searchContext.searchResult?.data.length === 0)
    return <div>No Result</div>;
  return (
    <Fragment>
      <div className={classes.main}>
        <ButtonCancel onClick={expandAllHandler}>
          Expand All/Collapse All
        </ButtonCancel>
        <table
          id="searchResultTable"
          className="table table-hover w-100 mt-4"
        ></table>
      </div>
      <SearchContextMenu
        xLoc={xLoc}
        yLoc={yLoc}
        selectedRow={selectedRow}
        showMenu={showMenu}
        onMouseLeave={hideContextMenu}
        // getOsvcParams={props.getOsvcParams}
        // showModalClick={props.showModalClick}
        // showModal={props.showModal}
      />
    </Fragment>
  );
};

SearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
  getOsvcParams: PropTypes.func,
  showModalClick: PropTypes.func,
  showModal: PropTypes.bool,
};

export default React.memo(SearchResult);
