ARCHMAN - Data and file management system

This system was developed to be a usable interface for users of the Simple DL administrative interface. The goal was to create a usable, modern, and simple interface that can be used to perform the basic functionality for file and data management.

This project makes use of React.js, Node.js, and Express.js. Additional libraries and packages have been used for some features within the system. 

Before running the code:
It is important to note that this code makes use of a collection on the user's local file system. The "public_html" folder contains some demo collections with a few files which can be used. Additionally, files and folders can be added to this folder via the interface. 

How to run this code:
1. Navigate to the node file and run "npm start" from the terminal to get the server running
2. In a different terminal window, navigate to the dlfrontend file and run "npm start". You will be asked if you would like to run on another port, enter "Y".
3. The interface should now be running on http://localhost:3001/

The interface is quite intuitive.
Create Folder: used to create a new folder in the current directory 
Upload: used to drag and drop files/folders or select files/folders for uploading by clicking on the dotted box
//The following functionality is enabled once row(s) have been selected with the checkboxes.
Delete: used to delete selected files/folders
Download: used to download the selected files/folders into a .zip file on the local file system
Rename: rename the selected file/folder

There is some additional functionality like filters, column and row management, and a breadcrumb for navigation.

