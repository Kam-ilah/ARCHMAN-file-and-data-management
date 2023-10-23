import React from "react";
import Dropzone from "react-dropzone";

const Upload = ({ handleFileDrop, selectedFiles }) => {
  return (
    <div>
      <Dropzone onDrop={handleFileDrop} multiple={true}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed grey",
              margin: "20px 0px",
              padding: "30px",
              fontFamily: "Quicksand",
              fontWeight: "600",
            }}
          >
            <input
              {...getInputProps()}
              webkitdirectory=""
              directory=""
              type="folder"
            />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>
                Drag 'n' drop some files here, or click <u>here</u> to select
                files
              </p>
            )}
            {selectedFiles.length > 0 && (
              <div>
                <h4>Selected Files:</h4>
                <ol>
                  {selectedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default Upload;
