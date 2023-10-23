import React, { useState, useEffect } from "react";
import axios from "axios";
import Upload from "./Upload";
import Breadcrumb from "./Breadcrumb";
import "./Body.css";
import CustomDataGrid from "./CustomDataGrid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "antd";
// import ModalButton from "./ModalButton";
import { ExclamationCircleFilled } from "@ant-design/icons";

const Body = () => {
  const [folderData, setFolderData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [fileData, setFileData] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFileInputVisible, setIsFileInputVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [isAnyItemSelected, setIsAnyItemSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);

  const [folderName, setFoldername] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [fileNameInput, setFileNameInput] = useState("");

  // pop-up box to inform users of successful and unsuccessful tasks
  const showAlert = (message) => {
    toast(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: 0,
      theme: "light",
    });
  };
  // called every time the currentpath changes, hence while navigating through directories
  useEffect(() => {
    fetchFolderData();
    // console.log("calling the useeffect");
  }, [currentPath]);

  // check if filedata was updated
  // called everytime "selectedIds changes"
  useEffect(() => {
    // console.log("Updated selected ids:", selectedIds);
  }, [selectedIds]);

  // connect to server to get the first set of folders
  const fetchFolderData = async () => {
    // console.log("going to fetch folder data...", currentPath);
    try {
      const response = await axios.get(`/api/folders${currentPath}`);
      setFolderData(response.data.children);
      setFileData(response.data.files);
      // console.log("here is the response from server", response.data.children);
    } catch (error) {
      console.error("Error fetching folder data for FetchFolderdata:", error);
    }
  };

  const handleBreadcrumbClick = (segment) => {
    // Implement logic to handle breadcrumb click and navigate accordingly.
    // Create a new path based on the clicked segment

    const pathSegments = currentPath.split("/");
    const segmentIndex = pathSegments.indexOf(segment);
    if (segment == 0) {
      // Lead back to root
      setCurrentPath("");
      // fetchFolderData();
      setSelectedIds([]);
    }
    if (segmentIndex !== -1) {
      // Remove segments after the clicked segment
      const newPathSegments = pathSegments.slice(0, segmentIndex + 1);
      const newPath = newPathSegments.join("/");

      // Update the currentPath state variable
      setCurrentPath(newPath);

      // Fetch data for the new path
      fetchFolderData(newPath);
      setSelectedIds([]);
    }
  };
  // when a row in the datagrid componentis clicked, this handles the functionality of displaying the contents
  const handleRowClick = async (params) => {
    const clickedFolderName = params.row.name;
    setSelectedFolder(clickedFolderName);
    // console.log("this file was selected:", params.row.name);
    let newPath = currentPath
      ? `${currentPath}/${clickedFolderName}`
      : clickedFolderName;

    try {
      const response = await axios.get(`/api/folders/${newPath}`);
      setFolderData(response.data.children);
      // Update the currentPath with the new path
      setCurrentPath(newPath);

      // Getting the files:
      setFileData(response.data.files);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error fetching folder data:", error);
    }
  };

  const handleBackClick = () => {
    // Get the current folder's segments
    const folderSegments = currentPath.split("/");

    // Remove the last segment to get the parent folder's segments
    const parentFolderSegments = folderSegments.slice(0, -1);
    //this is root/home
    if (parentFolderSegments.length === 0) {
      fetchFolderData("");
      setCurrentPath("");
      setSelectedFolder("");
      setSelectedIds([]);
    } else {
      // recreate the path, this time without the last element
      const newParentPath = parentFolderSegments.join("/");
      fetchFolderData(newParentPath);
      setCurrentPath(newParentPath);
    }
  };

  // when the drag and drop functionality is used
  const handleFileDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    const collectedPaths = [];
    // console.log("Some accepted files:", acceptedFiles);
    let dirArr;
    for (const item of acceptedFiles) {
      // console.log(item.path);
      if (item.path.includes("/")) {
        // it is a directory
        // split into an array
        dirArr = item.path.split("/");
        const fileUpName = dirArr.pop();
        //  the rest of the array need to be created as folders
        const restOfPath = dirArr.join("/");
        console.log(restOfPath);
        if (!collectedPaths.includes(restOfPath)) {
          collectedPaths.push(restOfPath);
        }
      }
    }

    const folderHierarchy = {};

    // Function to add a path to the folder hierarchy
    const addPathToHierarchy = (path) => {
      const segments = path
        .split("/")
        .filter((segment) => segment.trim() !== "");
      let currentFolder = folderHierarchy;

      for (const segment of segments) {
        if (!currentFolder[segment]) {
          currentFolder[segment] = {}; // Create a new folder if it doesn't exist
        }
        currentFolder = currentFolder[segment]; // Move into the next folder
      }
    };
    // Process each path and add it to the hierarchy
    for (const path of collectedPaths) {
      addPathToHierarchy(path);
      createFolderFromHierarchy(path);
    }
  };
  // This manages the creation of the folder structure
  const createFolderFromHierarchy = async (folderName) => {
    try {
      const newFolderPath = `${currentPath}/${folderName}`;
      const response = await axios.post(`/api/hierarchy/${newFolderPath}`);

      setFileNameInput("");
      setIsInputVisible(false);
      fetchFolderData();
    } catch (error) {
      console.error("Error creating the folder hierarchy", error);
    }
  };

  // this manages the presence of the drag and drop box
  const handleUploadClick = async () => {
    setIsFileInputVisible(true);
  };
  const handleCancel = async () => {
    setSelectedFiles([]);
    setIsFileInputVisible(false);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      return;
    }
    // for each file that is being uploaded
    try {
      for (const file of selectedFiles) {
        // get the path if a folder was uploaded
        const formData = new FormData();
        let filePath;
        let tempfilepath = file.path.split("/");
        tempfilepath.pop();
        filePath = tempfilepath.join("/");

        formData.append("files", file);

        let newFullPath = `${currentPath}${filePath}`;
        // upload the file to the path that is associated with it
        //  the associated path has already been created
        await axios.post(`/api/upload/${currentPath}${filePath}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      // Clear selected files and hide the file input after successful upload
      setSelectedFiles([]);
      setIsFileInputVisible(false);
      // Refresh folder data
      fetchFolderData();
      showAlert("Upload Complete");
    } catch (error) {
      console.error("Error uploading files:", error);
      showAlert("Upload Failed, this item already exists.");
    }
  };

  const handleSelectionChange = (id) => {
    setSelectedIds(id); // Update selectedIds when selection changes
    // Clear the selectedIds state when no rows are selected

    // console.log("Selected IDs:", id); // Log selected IDs for debugging
    const newSelectedNames = id.map((id) => combinedContent[id].name);
    setSelectedNames(newSelectedNames);
    // check if there are any selected items using the length of id array
    setIsAnyItemSelected(id.length > 0);
  };
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("OK");
        handleDeleteClick();
      },
      onCancel() {
        console.log("Cancel");
        setSelectedNames([]);
        setSelectedIds([]);
        setIsAnyItemSelected(false);
      },
    });
  };
  // handling the deletion
  // take selectedNames and for each name, delete the file/folder using the path
  const handleDeleteClick = async () => {
    // console.log("the selectednames: ", selectedNames);

    // const userConfirmDelete = window.confirm(
    //   "Are you sure you want to delete this item?"
    // );
    // If the user clicks "ok", proceed

    // console.log(selectedIds);
    for (const name of selectedNames) {
      try {
        const fullPath = `${currentPath}/${name}`;
        await axios.delete(`api/delete/${fullPath}`);
        console.log(`deleting: ${name} at ${fullPath} `);
        console.log(`Deleted: ${name}`);

        // Update fileData using the functional state update
        setFileData((prevFileData) =>
          prevFileData.filter((file) => file.name !== name)
        );
      } catch (error) {
        console.error(`Error deleing ${name}`, error);
        showAlert("An error occurred during deletion");
      }
    }
    // Clear the selectedIds state to deselect rows
    // Clear the selectedNames state after deletion
    // reset all states
    setSelectedNames([]);
    setSelectedIds([]);
    setIsAnyItemSelected(false);
    fetchFolderData();
    showAlert("Deletion Complete");
  };

  // Code to create a new folder
  // This is called when the "create folder" button is clicked
  const handleCreateFolderClick = async () => {
    setModalOpen(true);
    // const folderName = prompt("Please enter the name for the new folder");
    // used to remove illegal characters
    var re = /^[a-zA-Z].*/;
    if (folderName === null) {
      // User clicked "Cancel", do nothing or show a message
      setFoldername("");
      return;
    }
    // the input was empty or just whitespace
    if (folderName.trim() === "") {
      showAlert("Folder name cannot be empty");
    } else if (re.test(folderName.trim())) {
      createNewFolder(folderName.trim());
    } else {
      showAlert("Folder name cannot start with special characters");
    }
    setFoldername("");
  };

  // Creating a folder >>>> check if folder name already exists
  const createNewFolder = async (folderName) => {
    console.log("the current path:", currentPath);
    try {
      const newFolderPath = `${currentPath}/${folderName}`;
      console.log("here is the path to create", newFolderPath);
      const response = await axios.post(`/api/createfolder/${newFolderPath}`);

      // reset states
      setFileNameInput("");
      setFoldername("");
      setIsInputVisible(false);
      fetchFolderData();
      setModalOpen(false);

      showAlert("New Folder Created Successfully");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showAlert("This folder already exists, please choose another name");
      } else {
        console.error("Error creating the folder", error);
        showAlert("Error creating new folder");
      }
    }
  };

  // handing the downloding of files and folders
  const handleDownloadClick = async () => {
    const items = selectedNames;
    try {
      const response = await fetch(`/api/download/${currentPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_files.zip";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // reset states
      setSelectedNames([]);
      setSelectedIds([]);
      setIsAnyItemSelected(false);
      fetchFolderData();
      showAlert("Download Complete");
      // catch any errors that may occur
    } catch (error) {
      console.log("Error occurred while downloading");

      showAlert("Download failed");
    }
  };

  // rename file/folders
  const handleRenameClick = async () => {
    // console.log(selectedNames);
    // checking that only one object was selected to be renamed
    if (selectedNames.length > 1) {
      showAlert("Please rename one item at a time");
      setSelectedIds([]);
      setIsAnyItemSelected(false);
      setModal2Open(false);
      setNewFolderName("");
    } else {
      setModal2Open(true);
      // const newFolderName = prompt("Please rename the item");

      var re = /^[a-zA-Z].*/;
      try {
        if (newFolderName === null) {
          setSelectedIds([]);
          setIsAnyItemSelected(false);
          // User clicked "Cancel", do nothing or show a message
          return;
        }
        // if (newFolderName.trim() === "") {
        //   showAlert("Name cannot be empty");
        //   setSelectedIds([]);
        //   setIsAnyItemSelected(false);
        // }
        if (re.test(newFolderName.trim())) {
          // console.log("CURRENT PATH", currentPath);
          const currentDir = `${currentPath}${selectedNames}`;
          // console.log("currentdir", currentDir);
          const selectedRename = selectedNames[0];
          await axios.post("/api/rename/", {
            currentPath,
            selectedRename,
            newFolderName,
          });
          showAlert("Item Renamed Successfully");
        } else if (newFolderName.trim() === "") {
          showAlert("Name cannot be empty");
          setSelectedIds([]);
          setIsAnyItemSelected(false);
        } else {
          showAlert("Name cannot start with a special character");
        }
        setNewFolderName("");
        setModal2Open(false);
        setSelectedIds([]);

        setIsAnyItemSelected(false);
        fetchFolderData();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          showAlert("This name already exists, please choose another name");
        } else {
          console.log("Error occurred while renaming file");
          showAlert("An error occured, could not rename file");
        }
      }
    }
  };

  // unziping a zipped file
  // const handleUnzipClick = async () => {
  //   const userConfirmUnzip = window.confirm(
  //     "Are you sure you want to unzip this item?"
  //   );
  //   if (userConfirmUnzip) {
  //     // console.log(selectedIds);
  //     for (const name of selectedNames) {
  //       // console.log("name of file", name);
  //       try {
  //         const fullPath = `${currentPath}/${name}`;
  //         const response = await axios.post(`/api/unzip/${fullPath}`);
  //         console.log(`unzipped: ${name} `); // this should appear on the UI
  //         // console.log("here is the folder content", folderData);
  //         fetchFolderData();
  //       } catch (error) {
  //         console.error(`Error unzipping ${name}`, error);
  //         // alert("Could not unzip the file");
  //       }
  //     }
  //     setSelectedIds([]);
  //     setSelectedNames([]);
  //     // fetchFolderData();
  //   }
  // };

  // all the files and folders that need to be displayed
  let combinedContent = folderData.concat(fileData);

  return (
    <div>
      {/* use for alerts */}
      <ToastContainer />
      <div class="flex-container">
        {selectedFolder && <button onClick={handleBackClick}>Back</button>}
        <button
          onClick={() => {
            setModalOpen(true);
          }}
          disabled={isAnyItemSelected}
        >
          Create Folder
        </button>
        <Modal
          centered
          width="400px"
          title="Please enter the folder name"
          open={modalOpen}
          onOk={() => handleCreateFolderClick()}
          onCancel={() => {
            setModalOpen(false);
            setFoldername("");
          }}
        >
          <form>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFoldername(e.target.value)}
              size="50"
            />
          </form>
        </Modal>
        <button onClick={handleUploadClick} disabled={isAnyItemSelected}>
          Upload
        </button>
        {/* <button onClick={handleUnzipClick} disabled={!isAnyItemSelected}>
          Unzip
        </button> */}
        <button onClick={showConfirm} disabled={!isAnyItemSelected}>
          Delete
        </button>

        <button onClick={handleDownloadClick} disabled={!isAnyItemSelected}>
          Download
        </button>

        <button
          onClick={() => setModal2Open(true)}
          disabled={!isAnyItemSelected}
        >
          Rename
        </button>
        <Modal
          centered
          width="400px"
          title="Please enter the new name"
          open={modal2Open}
          onOk={() => handleRenameClick()}
          onCancel={() => {
            setModal2Open(false);
            setNewFolderName("");
          }}
        >
          <form>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              size="50"
            />
          </form>
        </Modal>

        {/* <button onClick={handleMoveClick}>Move</button> */}

        {isFileInputVisible && (
          <div>
            {/* <input type="file" multiple onChange={handleFileChange} /> */}
            <Upload
              handleFileDrop={handleFileDrop}
              selectedFiles={selectedFiles}
            />

            <button onClick={handleUpload} disabled={selectedFiles == ""}>
              Submit
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>
      {/* breadcrumb for navigation and location */}
      <Breadcrumb
        currentPath={currentPath}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />

      <div className="dataGrid">
        {/* Use the CustomDataGrid component to display content in rows*/}
        <CustomDataGrid
          combinedContent={combinedContent}
          selectedIds={selectedIds}
          handleRowClick={handleRowClick}
          handleSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export default Body;
