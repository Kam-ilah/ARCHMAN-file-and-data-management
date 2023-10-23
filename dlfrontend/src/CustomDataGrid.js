import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { colors } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

function formatFileSize(sizeInBytes) {
  if (sizeInBytes >= 1024 * 1024) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  } else if (isNaN(sizeInBytes)) {
    return "-";
  } else {
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  }
}

// format the timestamp to a readable format for last modified timestamp
function formatModifiedDate(last_modified) {
  try {
    const date = new Date(last_modified); // Convert to Date object
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    // console.error("Error formatting modified date:", error);
    return "-"; // Return a default message for invalid dates
  }
}

const CustomDataGrid = ({
  combinedContent,
  selectedIds,
  handleRowClick,
  handleSelectionChange,
}) => {
  return (
    <DataGrid
      autoHeight={true}
      sortingOrder={["desc", "asc", "null"]}
      localeText={{
        noRowsLabel: "Folder is Empty",
      }}
      sx={{
        m: 1,
        ".MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold",
        },
        // disable cell selection style
        ".MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
        borderColor: "transparent",
        ".css-128fb87-MuiDataGrid-toolbarContainer": {
          padding: "0px 4px",
        },
        ".MuiDataGrid-iconButtonContainer": {
          visibility: "visible",
        },

        ".MuiDataGrid-sortIcon": {
          opacity: "inherit !important",
        },

        ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
          backgroundColor: "#65ade03b",
        },
        // ".MuiDataGrid-overlay css-1w53k9d-MuiDataGrid-overlay": {
        //   margin: "60px",
        //   height: "100px",
        //   padding: "20px",
        // },
      }}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          printOptions: { disableToolbarButton: true },
          csvOptions: { disableToolbarButton: true },
        },
      }}
      checkboxSelection
      disableRowSelectionOnClick
      {...combinedContent}
      rows={combinedContent.map((folder, index) => ({
        id: index, // Unique id for each folder row
        name: folder.name,
        type: folder.type,
        size: formatFileSize(folder.size),
        last_modified: formatModifiedDate(folder.lastModified),
      }))}
      columns={[
        {
          field: "name",
          headerName: "Name",
          flex: 1,
        },
        {
          field: "type",
          headerName: "Type",
          flex: 1,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => {
            if (!params.value) {
              return <FontAwesomeIcon icon={faFolder} color="#4991c4" />;
            }
          },
        },
        {
          field: "size",
          headerName: "Size",
          flex: 1,
          headerAlign: "center",
          align: "center",
        },
        {
          field: "last_modified",
          headerName: "Last Modified",
          flex: 1,
          headerAlign: "center",
          align: "center",
        },
      ]}
      onRowDoubleClick={handleRowClick}
      rowSelectionModel={selectedIds}
      onRowSelectionModelChange={handleSelectionChange}
    />
  );
};

export default CustomDataGrid;
