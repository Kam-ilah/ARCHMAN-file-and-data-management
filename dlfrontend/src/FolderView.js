import React from "react";
import axios from "axios";

const FolderView = ({ folder, onRefresh }) => {
  const handleDownloadFile = async (filename) => {
    try {
      const response = await axios.get(
        `/api/downloadfile/${folder.name}/${filename}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  //   const handleDeleteFile = async (filename) => {
  //     try {
  //       await axios.delete(`/api/deletefile/${folder.name}/${filename}`);
  //       onRefresh();
  //     } catch (error) {
  //       console.error("Error deleting file:", error);
  //     }
  //   };

  if (!folder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Files in Folder: {folder.name}</h2>
      <ul>
        {folder.files.map((file) => (
          <li key={file.name}>
            <span onClick={() => handleDownloadFile(file.name)}>
              {file.name}
            </span>{" "}
            {/* <button onClick={() => handleDeleteFile(file.name)}>Delete</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderView;
