import React from 'react';
// import styled from 'styled-components';
import Button from './Button'
// import './FileUploader'
import './Button.css'

// Style the Button component
// const Button = styled.button`
//   /* Insert your favorite CSS code to style a button */
// `;
const FileUploader = props => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };
  return (
    <div className='uploadButton'>
      <Button onClick={handleClick}
        name ="Upload a file">
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}} // Make the file input element invisible 
      />
    </div>
  );
}
export default FileUploader;


// // PART #2
// import React from 'react';
// import Button from './Button';
// import './Button.css';

// const FileUploader = props => {
//   const hiddenFileInput = React.useRef(null);

//   const handleClick = event => {
//     hiddenFileInput.current.click();
//   };

//   const handleChange = async event => {
//     const fileUploaded = event.target.files[0];
//     const formData = new FormData();
//     formData.append('uploadFile', fileUploaded);

//     try {
//       const response = await fetch('/uploadFile', {
//         method: 'POST',
//         // body: text,
//       });

//       const responseData = await response.text();
//       console.log('Server response:', responseData); // Log the server response for debugging


//       if (response.ok) {
//         // File uploaded successfully, do something with the response if needed
//         // For example, you can notify the user or perform additional actions.
//         console.log('File uploaded successfully.');
//       } else {
//         // Handle server-side errors or upload failures here
//         console.log('Failed to upload file.');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div className='uploadButton'>
//       <Button onClick={handleClick} name="Upload a file" />
//       <input
//         type="file"
//         ref={hiddenFileInput}
//         onChange={handleChange}
//         style={{ display: 'none' }}
//       />
//     </div>
//   );
// };

// export default FileUploader;


// // FileUploadButton.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUploader = () => {
//   const [folderName, setFolderName] = useState('');

//   const handleInputChange = (event) => {
//     setFolderName(event.target.value);
//   };

//   const handleCreateFolder = () => {
//     if (!folderName || folderName.trim() === '') {
//       alert('Please enter a valid folder name.');
//       return;
//     }

//     axios
//       .post('/createfolder', { folderName:folderName })
//       .then((response) => {
//         // Handle success response (if any)
//         console.log(response.data);
//       })
//       .catch((error) => {
//         // Handle error response (if any)
//         console.error('Error creating folder:', error.response.data);
//       });
//   };

//   return (
//     <div>
//       <input type="text" value={folderName} onChange={handleInputChange} />
//       <button onClick={handleCreateFolder}>Create Folder</button>
//     </div>
//   );
// };

// export default FileUploader;
