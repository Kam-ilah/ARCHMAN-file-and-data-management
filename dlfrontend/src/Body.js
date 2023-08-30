import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Dropzone from "react-dropzone";

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
  const [selectedFolder, setSelectedFolder] = useState("");
  const [fileData, setFileData] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFileInputVisible, setIsFileInputVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  useEffect(() => {
    fetchFolderData();
    // console.log("calling the useeffect");
  }, [currentPath]);

  // connect to server to get the first set of folders
  const fetchFolderData = async () => {
    // console.log("going to fetch folder data...", currentPath);
    try {
      const response = await axios.get(`/api/folders${currentPath}`);
      setFolderData(response.data.children);
      setFileData(response.data.files);
      console.log("here is the response from server", response.data.children);
    } catch (error) {
      console.error("Error fetching folder data for FetchFolderdata:", error);
    }
  };

  const handleRowClick = async (params) => {
    const clickedFolderName = params.row.name;
    setSelectedFolder(clickedFolderName);
    // console.log("this file was selected:", params.row.name);
    let newPath = currentPath
      ? `${currentPath}/${clickedFolderName}`
      : clickedFolderName;

    try {
      console.log(`trying to use this path: ${newPath}`);

      // console.log("trying to set response...");
      // const response = await axios.get(`/api/folders/${clickedFolderName}`);
      const response = await axios.get(`/api/folders/${newPath}`);
      // console.log("this was the response: ", response);
      setFolderData(response.data.children);
      // Update the currentPath with the new path
      setCurrentPath(newPath);

      // Getting the files:
      setFileData(response.data.files);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };

  const handleBackClick = () => {
    // Get the current folder's segments
    const folderSegments = currentPath.split("/");
    // console.log("foldersegments :)", folderSegments);

    // Remove the last segment to get the parent folder's segments
    const parentFolderSegments = folderSegments.slice(0, -1);
    // console.log("here is the parent folder:", parentFolderSegments);
    // console.log(
    //   "here is the current path from the back button>>>",
    //   currentPath
    // );
    if (parentFolderSegments.length === 0) {
      // console.log("array length was zero");
      fetchFolderData("");
      setCurrentPath("");
    } else {
      const newParentPath = parentFolderSegments.join("/");
      fetchFolderData(newParentPath);
      setCurrentPath(newParentPath);
    }
  };

  const handleFileDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  // const handleFileChange = (event) => {
  //   setSelectedFiles(event.target.files);
  // };

  const handleUploadClick = async () => {
    setIsFileInputVisible(true);
  };
  const handleCancel = async () => {
    setSelectedFiles([]);
    setIsFileInputVisible(false);
  };
  const handleUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      console.log(
        "Path from frontend that we are trying to upload to",
        currentPath
      );
      await axios.post(`/api/upload/${currentPath}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear selected files and hide the file input after successful upload
      setSelectedFiles([]);
      setIsFileInputVisible(false);

      // Refresh folder data
      fetchFolderData();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleSelectionChange = (id) => {
    setSelectedIds(id); // Update selectedIds when selection changes
    console.log("Selected IDs:", id); // Log selected IDs for debugging
    const newSelectedNames = id.map((id) => combinedContent[id].name);
    setSelectedNames(newSelectedNames);
  };

  // delete
  // take selectedNames and for each name, delete the file/folder using the path
  const handleDeleteClick = async () => {
    for (const name of selectedNames) {
      console.log("in the for loop with", name);
      try {
        const fullPath = `${currentPath}/${name}`;
        await axios.delete(`api/delete/${fullPath}`);

        console.log(`Deleted: ${name}`); // this should appear on the UI
        const updatedFolderData = folderData.filter(
          (folder) => folder.name !== name
        );
        const updatedFileData = fileData.filter((file) => file.name !== name);
        setFileData(updatedFileData);

        setFolderData(updatedFolderData);
        // Clear the selectedNames state after deletion
        setSelectedNames((prevSelectedNames) =>
          prevSelectedNames.filter((selectedName) => selectedName !== name)
        );
        setSelectedNames([]);
      } catch (error) {
        console.error(`Error deleing ${name}`, error);
      }
    }
  };
  // download
  // moving files and folders

  // copy and paste to another directory ??

  // unziping a zipped file
  // const handleUnzipClick = async () => {
  //   if (selectedFolder) {
  //     try {
  //       const response = await axios.post(`/api/unzip/${selectedFolder}`);
  //       // Handle the response, e.g., show a success message
  //       console.log("Unzip response:", response.data);
  //     } catch (error) {
  //       // Handle error, e.g., show an error message
  //       console.error("Error unzipping files:", error);
  //     }
  //   }
  // };

  const combinedContent = folderData.concat(fileData);
  // if ({ currentPath } === "") {
  //   <h4>Current location: home</h4>;
  // } else {
  //   <h4>Current location:{currentPath}</h4>;
  // }
  return (
    <div>
      <div style={{ height: 500, width: "100%" }}>
        {selectedFolder && <button onClick={handleBackClick}>Back</button>}
        {/* <button onClick={handleUnzip}>Unzip Selected</button> */}
        <button onClick={handleUploadClick}>Upload</button>
        {/* <button onClick={handleUnzipClick}>Unzip</button> */}
        <button onClick={handleDeleteClick}>Delete</button>
        {/* <button onClick={handleDownloadClick}>Download</button> */}
        {/* <button onClick={handleMoveClick}>Move</button> */}

        {isFileInputVisible && (
          <div>
            {/* <input type="file" multiple onChange={handleFileChange} /> */}
            <Dropzone onDrop={handleFileDrop} multiple={true} folder={true}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "1px solid black",
                    padding: "20px",
                  }}
                >
                  <input
                    {...getInputProps()}
                    webkitdirectory=""
                    directory=""
                    type="file"
                  />
                  <p>
                    Drag &amp; drop some files or folders here, or click to
                    select files. Note: Please zip folders
                  </p>
                  {selectedFiles.length > 0 && (
                    <div>
                      <h4>Selected Files/Folders:</h4>
                      <ul>
                        {selectedFiles.map((file) => (
                          <li key={file.name}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>

            <button onClick={handleUpload}>Submit</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}

        <DataGrid
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
            { field: "name", headerName: "Name", width: 200 },
            { field: "type", headerName: "Type", width: 120 },
            { field: "size", headerName: "Size", width: 120 },
            { field: "last_modified", headerName: "Last Modified", width: 200 },
          ]}
          onRowDoubleClick={handleRowClick}
          selectionModel={selectedIds}
          onRowSelectionModelChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export default Body;
