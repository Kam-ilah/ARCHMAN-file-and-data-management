const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const archiver = require("archiver");

// const admzip = require("adm-zip");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use("/api", routes);

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
      await fs.rm(fullDirectory, {
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

// route for creating new folders
app.post("/api/createfolder/*?", async (req, res) => {
  const pathToFolder = req.params[0];
  const fullDirectory = `../public_html/collection/${pathToFolder}`;
  if (!fs.existsSync(fullDirectory)) {
    fs.mkdirSync(fullDirectory, { recursive: true });
    res.status(200).json({ message: "Folder created successfully." });
  } else {
    res.status(409).json({ message: "Folder already exists." });
  }
});

// Route for downloading
// app.get("/api/download/*?", (req, res) => {
//   const recPath = req.params[0];
//   const pathSplit = recPath.split("/");
//   const filename = pathSplit.pop();
//   const currentPath = pathSplit.join("/");
//   // const currentPath = req.params.currentPath || "";
//   console.log("here is the file name", filename);
//   console.log("here is the current path", currentPath);
//   let fullpath;
//   if (currentPath) {
//     fullpath = `../public_html/collection/${currentPath}/${filename}`;
//     console.log("the full path", fullpath);
//   } else {
//     fullpath = `../public_html/collection/${filename}`;
//     console.log("the full path", fullpath);
//   }
//   res.download(fullpath, filename, (err) => {
//     if (err) {
//       console.error("Error downloading file:", err);
//       res.status(500).send("Error downloading file");
//     } else {
//       console.log("File downloaded:", filename);
//     }
//   });
// });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/download/*?", async (req, res) => {
  const { items } = req.body;
  const currentPath = req.params[0] || "";
  const zipFileName = "downloaded_files.zip";
  const zipFilePath = path.join(__dirname, "public", zipFileName);

  const archive = archiver("zip", {});

  res.attachment(zipFileName);
  archive.pipe(res);
  for (const item of items) {
    let itemPath;

    if (currentPath) {
      itemPath = path.join("../public_html/collection/", currentPath, item);
    } else {
    }
    itemPath = path.join("../public_html/collection/", item);

    // const itemPath = path.join(__dirname, "public", item);

    if (fs.existsSync(itemPath)) {
      archive.file(itemPath, { name: item });
    }
  }
  res.setHeader("Content-Type", "application/zip");

  archive.finalize();
});

// Route for unzipping folders
// app.post("/api/unzip/*?", async (req, res) => {
//   const pathToFolder = req.params[0];
//   const fullDirectory = `../public_html/collection/${pathToFolder}`;
//   console.log("this was the path to folder", pathToFolder);
//   console.log("this was the full dir", fullDirectory);

//   // remove the filename to check for zipped file
//   var urlPath = fullDirectory.split("/");
//   const zippedfile = urlPath.pop(); //saving only the folder name

//   const pathDir = pathToFolder.split(".");
//   pathDir.pop();
//   console.log("PATHDIR", pathDir);
//   const dest = `../public_html/collection/${pathDir}`;
//   // if the directory doesn't exits, create it and put the zipped conent in there
//   if (!fs.existsSync(dest)) {
//     // fs.mkdirSync(dest, { recursive: true });
//     // checking if the path is a zipped file
//     if (zippedfile.endsWith(".zip")) {
//       res.json({ message: `${zippedfile} is not a zipped file` });
//     }
//     //   const zip = new admzip(fullDirectory);
//     //   try {
//     //     zip.extractAllTo(dest, false, (error) => {
//     //       if (error) {
//     //         console.log(error);
//     //         reject(error);
//     //       } else {
//     //         console.log(`Extracted to "${outputDirectory}" successfully`);
//     //         resolve();
//     //       }
//     //     });
//     //     res.status(200).json({ message: "folder unzipped successfully" });
//     //   } catch (error) {
//     //     console.log("there was error", error);
//     //   }
//     // }
//   } else {
//     // tell user the file already unzipped
//   }

//   //
//   // console.log("the file you wanted to unzip", zippedfile);
//   // // const dest = urlPath.join("/");
//   // console.log("here is the path to dest", dest);

//   // // checking if the path is a zipped file
//   // if (zippedfile.endsWith(".zip")) {
//   //   // res.status(200).json({ message: `${zippedfile} is not a zipped file` });

//   //   const zip = new admzip(fullDirectory);
//   //   try {
//   //     zip.extractAllTo(dest, false, (error) => {
//   //       if (error) {
//   //         console.log(error);
//   //         reject(error);
//   //       } else {
//   //         console.log(`Extracted to "${outputDirectory}" successfully`);
//   //         resolve();
//   //       }
//   //     });
//   //     res.status(200).json({ message: "folder unzipped successfully" });
//   //   } catch (error) {
//   //     console.log("there was error", error);
//   //   }
//   // }
// });

app.post("/api/rename/*?", (req, res) => {
  const currentPath = req.body.currentPath || "";
  const selectedItem = req.body.selectedRename;
  const newFolderName = req.body.newFolderName;
  let oldDirName, newDirName;
  console.log("the current path", currentPath);
  if (currentPath) {
    oldDirName = `../public_html/collection/${currentPath}/${selectedItem}`;
    newDirName = `../public_html/collection/${currentPath}/${newFolderName}`;
  } else {
    oldDirName = `../public_html/collection/${selectedItem}`;
    newDirName = `../public_html/collection/${newFolderName}`;
  }
  const fileExtension = path.extname(selectedItem);
  console.log("file extension", fileExtension);
  if (fileExtension) {
    console.log("there was a file extension");
    newDirName = `${newDirName}${fileExtension}`;
  }

  fs.rename(oldDirName, newDirName, function (err) {
    if (err) {
      console.error("Error renaming directory:", err);
      res.status(500).json({ error: "Failed to rename directory" });
    } else {
      console.log("Successfully renamed the directory.");
      res.status(200).json({ message: "Directory renamed successfully" });
    }
  });
});

// Starting the server
app.listen(3000, (error) => {
  if (!error) console.log("Hello from server on port 3000");
  else console.log("error occurred", error);
});

// /*
// / --> res = Hello there friend
// /uploadfile --> POST  = succesfully uploaded / failed to upload
// /createfolder --> POST = succesfully created folder / failed to create folder
// /downloadfile --> GET = download complete/ download failed
// /deletefile --> DELETE = deleted successfully / unsuccessful

// */
