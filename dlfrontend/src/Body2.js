import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

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

const Body = () => {
  const [folderData, setFolderData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileData, setFileData] = useState([]);
  //   const [currentPath, setcurrentPath] = useState([]);
  //   const [combinedData, setCombinedData] = useState([]);
  const combinedContent = [];

  useEffect(() => {
    fetchFolderData();
    // console.log("calling the useeffect");
  }, []);

  // connect to server to get the folder structure
  const fetchFolderData = async () => {
    console.log("going to fetch folder data...");
    try {
      const response = await axios.get("/api/folders");
      setFolderData(response.data.children);
      console.log("here is the response from server", response.data.children);
      //   console.log(response.data.children[0].files[1].type);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };

  const extractNames = (fileArray) => {
    return fileArray.map((file) => file.name);
  };

  //  on row click, if file, display contents:
  //    1. connect to server with path using the file name of selected folder
  //    2. fetch data for specified path and send to client
  //    3. display contents of folder using datagrid
  //    4. have a variable to keep track of current path and use to append to

  const handleRowClick = async (params) => {
    console.log("calling the handle row", params.row.name);
    // get the folder name from the clicked row
    const clickedFolderName = params.row.name;
    // update the selected folder
    setSelectedFolder(clickedFolderName);
    // fetch the folder information using its ID
    let folderInfo = folderData[params.id];
    console.log("here is the info: ", folderInfo);

    // trying to get test folder: This works!!!!!
    // console.log(
    //   "attempt1:::   ",
    // folderInfo.children.find((child) => child.name === "secondTest");
    // );

    //If the folder has files
    if (folderInfo.files) {
      // return all the files
      //   console.log("Here are the files:\n", folderInfo.files);
      const fileNames = extractNames(folderInfo.files);
      //   console.log("The file names babe:", fileNames);
      //   onclick>open the file

      try {
        const response = await axios.get(`/api/folders/${params.row.name}`);
        // console.log("selected folder:", `/api/folders/${params.row.name}`);

        setFileData(response.data.files);
        console.log("filedata", response.data.files);
        console.log(folderInfo.files[1].lastModified);
        combinedContent.push(
          ...folderInfo.files.map((file) => ({
            id: `file-${file.name}`,
            name: file.name,
            type: file.type.replace(".", ""),
            size: file.size,
            last_modified: file.lastModified,
          }))
        );
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    }
    // handle subfolders
    if (folderInfo.children) {
      // return all the subfolders
      const parentFolder = folderInfo;
      console.log("Here is the parent folder with info\n", parentFolder);
      //   const folderNames = extractNames(folderInfo.children);
      const subfolderInfo = folderInfo.children;
      if (subfolderInfo.length !== 0) {
        console.log("this file has subfolders", subfolderInfo);
        setFolderData(subfolderInfo);
        if (subfolderInfo.children) {
          try {
            console.log("subfolder has files");
            combinedContent.push(
              ...subfolderInfo.children.map((child) => ({
                id: `child-${child.name}`,
                name: child.name,
                type: "Folder",
                size: "-",
                last_modified: "-",
              }))
            );
          } catch (error) {
            console.error("Error fetching subfolder data:", error);
          }
        } else if (subfolderInfo.files) {
          console.log("subfolder has files");
          combinedContent.push(
            ...subfolderInfo.files.map((file) => ({
              id: `file-${file.name}`,
              name: file.name,
              type: file.type.replace(".", ""),
              size: file.size,
              last_modified: file.last_modified,
            }))
          );
        } else {
          // do nothing
        }
      }
      //   onclick>call function to display children and files again
      try {
        const response = await axios.get(`/api/folders/${params.row.name}`);
        // console.log("selected folder:", clickedFolderName);
        setFolderData(response.data.children);

        combinedContent.push(
          ...folderInfo.children.map((child) => ({
            id: `child-${child.name}`,
            name: child.name,
            type: "Folder",
            size: "-",
            last_modified: "-",
          }))
        );
      } catch (error) {
        console.error("Error fetching subfolder data:", error);
      }
    } else {
      //display empty
      console.log("empty folder");
    }

    // console.log("the combined data:", combinedContent);
    setFolderData(combinedContent);
  };

  const handleBackClick = () => {
    // Get the current folder's parent folder name
    const parentFolderName = selectedFolder.split("/").slice(0, -1).join("/");
    // Fetch and display the parent folder's contents
    fetchFolderData(parentFolderName);
    setSelectedFolder(parentFolderName);
  };
  console.log(folderData);
  return (
    <div style={{ height: 500, width: "100%" }}>
      {/* {selectedFolder ? (
        <div>
          <button onClick={() => setSelectedFolder(null)}>Back</button>
          <FolderRow folder={selectedFolder} onRowClick={handleRowClick} />
        </div>
      ) : ( */}
      {selectedFolder && <button onClick={handleBackClick}>Back</button>}

      <DataGrid
        rows={folderData.map((folder, index) => ({
          id: index, // Unique id for each folder row
          name: folder.name,
          type: folder.type,
          size: formatFileSize(folder.size),
          last_modified: formatModifiedDate(folder.last_modified),
        }))}
        columns={[
          { field: "name", headerName: "Name", width: 200 },
          { field: "type", headerName: "Type", width: 120 },
          { field: "size", headerName: "Size", width: 120 },
          { field: "last_modified", headerName: "Last Modified", width: 120 },
        ]}
        // onRowClick={(params) => handleEvent(folderData[params.rowIndex])}
        onRowClick={handleRowClick}
      />

      {/* {selectedFile && <FileRow file={selectedFile} />} */}
    </div>
  );
};

export default Body;

//  on row click, if file, display contents:
//    1. connect to server with path using the file name of selected folder
//    2. fetch data for specified path and send to client
//    3. display contents of folder using datagrid
//    4. have a variable to keep track of current path and use to append to
