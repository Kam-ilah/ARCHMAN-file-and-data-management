// import React, { useState } from "react";
// import axios from "axios";
// import currentPath from "./Body";

// const UploadFiles = () => {
//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

//   const handleUploadClick = () => {
//     setUploadDialogOpen(true);
//   };

//   const handleUploadDialogClose = () => {
//     setUploadDialogOpen(false);
//   };

//   const handleFileUpload = async (event) => {
//     const files = event.target.files;

//     if (files && files.length > 0) {
//       const formData = new FormData();

//       for (const file of files) {
//         formData.append("files", file);
//       }

//       try {
//         await axios.post(`/api/upload/${currentPath}`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         // Close the upload dialog and refresh the folder data
//         handleUploadDialogClose();
//         fetchFolderData();
//       } catch (error) {
//         console.error("Error uploading files:", error);
//       }
//     }
//   };
//   return (
//     <div>
//       {uploadDialogOpen && (
//         <form>
//           <input type="file" name="file" multiple onChange={handleFileUpload} />
//           <button type="submit">Submit</button>
//           <button onClick={handleUploadDialogClose}>Cancel</button>
//         </form>
//       )}
//       <button onClick={handleUploadClick}>Upload</button>
//     </div>
//   );
// };

// export default UploadFiles;
