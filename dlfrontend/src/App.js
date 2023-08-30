import React, { Component, useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Button from "./Button";
import ManagerOptions from "./ManagerOptions";
import Checkbox from "./Checkbox";
import FileUploader from "./FileUploader";
import axios from "axios";
import Body from "./Body";
// creating a folder

// const handleCreateFolder = () => {
//   const folderName = prompt("Please enter a folder name: "); // Use the user-inputted folderName in the data object
//   if (folderName) {
//     const data = { folderName };

//     // fetch('api/createfolder', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify(data),
//     // })
//     //   .then(response => response.json())
//     //   .then(data => {
//     //     setResponseMessage(data); // Update the state with the response message
//     //   })
//     //   .catch(error => {
//     //     console.error('Error:', error);
//     //     // Handle any errors that occurred during the POST request
//     //   });

//     axios
//       .post("/api/createfolder", data)
//       .then((response) => {
//         setResponseMessage(response.data); // Update the state with the response message
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         // Handle any errors that occurred during the POST request
//       });
//   }
// };

// function Folder({ folder, onAddFolder }) {
//   const [expanded, setExpanded] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [file, setFile] = useState(null);

//   const handleToggleFolder = () => {
//     setExpanded((prevExpanded) => !prevExpanded);
//   };

//   const handleAddFolderClick = () => {
//     setShowInput(true);
//   };

//   const handleConfirmAddFolder = () => {
//     if (newFolderName.trim() !== "") {
//       const newFolder = {
//         name: newFolderName,
//         files: [],
//         children: [],
//       };
//       onAddFolder(newFolder, folder.name);
//       setNewFolderName("");
//       setShowInput(false);
//       // Send a POST request to the server to create the folder
//       axios
//         .post("/api/createfolder", { folderName: newFolder.name })
//         .then((response) => {
//           console.log("Folder created on the server:", newFolder.name);
//           // Refresh the page to show the updated folder structure
//           // window.location.reload();
//         })
//         .catch((error) => {
//           console.error("Error creating folder on the server:", error);
//         });
//     }
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileUpload = async () => {
//     if (file) {
//       // Create a FormData object to send the file to the server
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         // Send the file to the server using axios or fetch
//         const response = await axios.post(
//           `/api/uploadfile/${folder.name}`,
//           formData
//         );
//         console.log("File uploaded successfully:", response.data);
//         // Refresh the page to show the updated folder structure
//         window.location.reload();
//       } catch (error) {
//         console.error("Error uploading file:", error);
//         // Handle any errors that occurred during the file upload
//       }
//     }
//   };

//   return (
//     <div key={folder.name}>
//       <h3>
//         {folder.name}
//         <button onClick={handleToggleFolder}>{expanded ? "-" : "+"}</button>
//       </h3>
//       {showInput ? (
//         <div>
//           <input
//             type="text"
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             placeholder="Enter folder name"
//           />
//           <button onClick={handleConfirmAddFolder}>Confirm</button>
//         </div>
//       ) : (
//         <>
//           <button onClick={handleAddFolderClick}>Create Folder</button>
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={handleFileUpload}>Upload File</button>
//         </>
//       )}
//       {expanded && folder.files && folder.files.length > 0 && (
//         <ul>
//           {folder.files.map((file, index) => (
//             <li key={index}>
//               {file.name} ({file.size})
//             </li>
//           ))}
//         </ul>
//       )}
//       {expanded &&
//         folder.children &&
//         folder.children.length > 0 &&
//         folder.children.map((childFolder) => (
//           <Folder
//             key={childFolder.name}
//             folder={childFolder}
//             onAddFolder={onAddFolder}
//           />
//         ))}
//     </div>
//   );
// }

function App() {
  // const [folders, setFolders] = useState([]);

  // const handleAddFolder = (newFolder, parentFolderName) => {
  //   const updatedFolders = addFolderToParent(
  //     folders,
  //     newFolder,
  //     parentFolderName
  //   );
  //   setFolders(updatedFolders);
  // };

  return (
    <div className="App">
      <Header />
      {/* <ManagerOptions /> */}
      <Body />

      {/* <Button name="Create Folder" /> */}
      {/* <Checkbox /> */}
      {/* <h1>createfolder</h1> */}
      {/* <button onClick={handleCreateFolder}>Create Folder</button> */}
      {/* {responseMessage && <p>{responseMessage}</p>} */}
      {/* {folders.map((folder) => (
        <Folder key={folder.name} folder={folder} />
      ))} */}

      {/* {folders.map((folder) => (
        <Folder
          key={folder.name}
          folder={folder}
          onAddFolder={handleAddFolder}
        />
      ))} */}
    </div>
  );
}

// function addFolderToParent(folders, newFolder, parentFolderName) {
//   return folders.map((folder) => {
//     if (folder.name === parentFolderName) {
//       return {
//         ...folder,
//         children: [...folder.children, newFolder],
//       };
//     }
//     if (folder.children && folder.children.length > 0) {
//       return {
//         ...folder,
//         children: addFolderToParent(
//           folder.children,
//           newFolder,
//           parentFolderName
//         ),
//       };
//     }
//     return folder;
//   });
// }
export default App;
