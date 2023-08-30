const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const routes = require("./routes");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use("/api", routes);

//joining path of directory
// const directoryPath = path.join(__dirname, "../public_html/collection/");
//passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//   //handling error
//   if (err) {
//     return console.log("Unable to scan directory: " + err);
//   }
//   //listing all files using forEach
//   files.forEach(function (file) {
//     const filePath = path.join(directoryPath, file);

//     fs.stat(filePath, function (err, stats) {
//       if (err) {
//         return console.log("Error getting file stats: " + err);
//       }

//       const sizeInBytes = stats.size;
//       const sizeInKB = (sizeInBytes / 1000).toFixed(2);
//       const fileType = path.extname(file).toLowerCase();
//       const modifiedDate = new Date(stats.mtime).toLocaleString(); // Date and time of last modification

//       console.log("File Name:", file);
//       console.log("File Size (Bytes):", sizeInBytes);
//       console.log("File Size (kB):", sizeInKB);
//       console.log("File Type:", fileType);
//       console.log("Modified Date:", modifiedDate);
//       console.log("---------------------------");
//     });
//   });
// });

// app.get("/api/folders", async (req, res) => {
//   try {
//     const files = await fs.readdir(directoryPath);
//     const fileData = await Promise.all(
//       files.map(async (file) => {
//         const filePath = path.join(directoryPath, file);
//         const stats = await fs.stat(filePath);
//         return {
//           name: file,
//           size: stats.size,
//           type: path.extname(file).toLowerCase(),
//           modified: stats.mtime,
//         };
//       })
//     );
//     res.json(fileData);
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Function to get the folder structure
const getFolderStructure = async (folderPath) => {
  const folderName = path.basename(folderPath);
  // console.log("here is the folername:", folderName);
  // console.log("here is the path:", folderPath);
  // console.log("reading the contents of the folder");
  // const files = await fs.readdirSync(folderPath);
  const files = await fs.readdir(folderPath);
  // console.log(files);
  const folder = {
    name: folderName,
    files: [],
    children: [],
  };

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isFile()) {
      // console.log("file found");
      folder.files.push({
        name: file,
        type: path.extname(file).toLowerCase(),
        size: stats.size, // Size of the file in bytes
        lastModified: stats.mtime,
      });
    } else if (stats.isDirectory()) {
      const subFolder = await getFolderStructure(filePath);
      folder.children.push(subFolder);
    }
  }
  return folder;
};

// Route to get the folder structure
app.get("/api/folders/?*", async (req, res) => {
  try {
    const folderPath1 = req.params[0] || "";
    // console.log("thhe request params:", req);
    // console.log(`Folder path: ${folderPath1}`);
    // no folder was selected - home screen
    if (folderPath1 === "") {
      // console.log(
      //   "Here is the folder name from the first get ",
      //   req.params.name
      // );
      const rootFolder = await getFolderStructure("../public_html/collection/");
      res.json(rootFolder);
    } else {
      // Not home screen - folder selected
      const newFolderPath = path.join(
        "../public_html/collection/",
        folderPath1
      );
      // console.log("new folder path will be:", newFolderPath);
      const folderNameData = await getFolderStructure(newFolderPath);
      res.json(folderNameData);
    }
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handling Uploads

// Set up multer storage and upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentPath = req.params[0] || ""; // Get the current path from the URL parameter
    console.log("path to upload to", currentPath);
    cb(null, path.join("../public_html/collection/", currentPath)); // Save files in the current directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

// Define a route for handling file uploads
app.post("/api/upload/*?", upload.array("files"), (req, res) => {
  // Handle saving the uploaded files to the target directory
  // You may need to perform error handling, validation, etc. here
  // For simplicity, this example assumes successful upload
  res.status(200).json({ message: "Files uploaded successfully" });
});

// Route for deleting folders/files
app.delete("/api/delete/*?", async (req, res) => {
  const pathToFolder = req.params[0];
  const fullDirectory = `../public_html/collection/${pathToFolder}`;

  // check if file or folder
  let stats = fs.statSync(fullDirectory);
  if (stats.isFile()) {
    // the path leads to a file
    // try to delete it
    fs.unlink(fullDirectory, (err) => {
      if (err && err.code == "ENOENT") {
        console.info("Error! File doesn't exist.");
      } else if (err) {
        console.error("Something went wrong. Please try again later.");
      } else {
        console.info(
          `Successfully removed file with the path of ${fullDirectory}`
        );
        res.status(200).json({ message: `${pathToFolder} deleted` });
      }
    });
  } else if (stats.isDirectory()) {
    // the path leads to a folder
    try {
      // Delete the folder using Node.js filesystem API
      await fs.rmdir(fullDirectory, {
        recursive: true,
      });

      // Respond with success message
      res.status(200).json({ message: `${pathToFolder} deleted` });
    } catch (error) {
      console.error(`Error deleting ${pathToFolder}:`, error);
      res.status(500).json({ message: `Error deleting ${pathToFolder}` });
    }
  }
});

// app.get('/api',(req,res)=>{
//     res.json({"users":["userOne", "userTwo","userThree"]}); // this will show on the webpage
// });

// app.post('/createfolder',(req, res)=>{
//     const folderName =req.body.folderName;
//     res.json("created the folder")
// });

// app.get('/files/:filename/download',(req, res)=>{
//     const {filename} = req.params;

// });

// app.delete('/files/:filename',(req, res)=>{

// });

// Starting the server

app.listen(3000, (error) => {
  if (!error) console.log("Hello from server on port 3000");
  else console.log("error occurred babe", error);
});

// /*
// / --> res = Hello there friend
// /uploadfile --> POST  = succesfully uploaded / failed to upload
// /createfolder --> POST = succesfully created folder / failed to create folder
// /downloadfile --> GET = download complete/ download failed
// /deletefile --> DELETE = deleted successfully / unsuccessful

// */
