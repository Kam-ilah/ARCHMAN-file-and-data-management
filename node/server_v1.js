const express = require("express");
const bodyParser = require("body-parser");
const { error } = require("console");
const cors = require("cors");
// const routes = require("./routes");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");

const app = express();

let newPath = "";
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

app.post("/pathway", (req, res) => {
  const newPath = req.body.newPath;
  console.log(`RECEIVED PATH:${newPath}`);
  res.send(`RECEIVED PATH:${newPath}`);
});

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
app.get("/api/folders/:folderName?", async (req, res) => {
  try {
    if (req.params.name === undefined) {
      console.log(
        "Here is the folder name from the first get ",
        req.params.folderName
      );
    }

    const rootFolder = await getFolderStructure("../public_html/collection/");
    res.json(rootFolder);
    // console.log("response from serevr side for test", rootFolder);
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// getting forlder structure for selected file
app.get("/api/folders/:folderName", async (req, res) => {
  const folderName = req.params.folderName;
  console.log("here is the folder name:", folderName);
  // const subfolderPath = req.params.subfolder || "";
  const fullPath = newPath ? `${folderName}/${newPath}` : folderName;
  const folderPath = path.join("../public_html/collection/", fullPath);

  const folderNameData = await getFolderStructure(folderPath);
  res.json(folderNameData);
  try {
    console.log("there is the fullpath from server side:", fullPath);
    // res.send(`Fetching data for path: ${fullPath}`);

    // folderName = "logos/Test folder";
    // console.log("subfolder from the server: ", req.params.subfolder);
    // try {
    // if (req.params.subfolder) {
    //   const folderPath = path.join(
    //     "../public_html/collection/",
    //     folderName,
    //     req.params.subfolder
    //   );
    //   console.log("here is the folder path with subfolder", folderPath);
    //   const folderNameData = await getFolderStructure(folderPath);
    //   res.json(folderNameData);
    // } else {
    //   console.log("this was the folder name", folderName);
    //   // console.log("back in the server with the selected folder", folderName);
    //   const folderPath = path.join("../public_html/collection/", folderName);
    //   console.log("here is the folder path", folderPath);
    //   const folderNameData = await getFolderStructure(folderPath);
    //   res.json(folderNameData);
    // }
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folderName = req.params.folderName; // Get the folder name from the request parameters
//     const folderPath = path.join("../public_html/collection/", folderName);
//     cb(null, folderPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Route to handle file uploads
// app.post("/api/uploadfile/:folderName", upload.single("file"), (req, res) => {
//   // The file is uploaded and saved to the specified folder
//   res.json({ message: "File uploaded successfully" });
// });

// app.get('/api',(req,res)=>{
//     res.json({"users":["userOne", "userTwo","userThree"]}); // this will show on the webpage
// });

// app.post('/createfolder',(req, res)=>{
//     const folderName =req.body.folderName;
//     res.json("created the folder")
// });

// app.post('/files/uploadfile',(req, res)=>{

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
