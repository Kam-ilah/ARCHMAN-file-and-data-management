import React, { useEffect, useState } from "react";
import axios from "axios";
import FolderView from "./FolderView";

const FolderTable = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("/api/folders");
      setFolders(response.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleRowClick = (folder) => {
    setSelectedFolder(folder);
  };

  return (
    <div>
      <h2>Manage Datasets</h2>
      <ul>
        {folders.map((folder) => (
          <li key={folder.name} onClick={() => handleRowClick(folder)}>
            {folder.name}
          </li>
        ))}
      </ul>
      {selectedFolder && (
        <FolderView folder={selectedFolder} onRefresh={fetchFolders} />
      )}
    </div>
  );
};

export default FolderTable;
