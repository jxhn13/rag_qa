import React, { useState } from 'react';
import axios from 'axios';
import './pdf-upload.css';

const MultiplePDFUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState(''); 

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files); 
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('file', file); 
    });

    try {
      await axios.post('http://localhost:5002/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Uploaded successfully');
    } catch (error) {
      setMessage('Upload Error'); 
    }
  };

  const handleChooseFile = () => {
    document.getElementById("fileInput").click();
  }

  const handleFileList = () => {
    if (selectedFiles.length === 0) return null;

    return (
      <ul>
        {Array.from(selectedFiles).map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    );
  }

  const handleClearList = () => {
    setSelectedFiles([]);
  }

  return (
    <div className='insert-file'>
      <input
        id='fileInput'
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />

      <div className="buttonDivs">
        <button id='chooseFile' type='button' onClick={handleChooseFile}>Choose File</button>
        <button className='clearFiles' onClick={handleClearList}>Clear</button>
        <button className='uploadButton' onClick={handleUpload}>Upload</button>
      </div>
      <p className='showFiles'>{handleFileList()}</p>

      {message && <p>{message}</p>} {/* Display message */}
    </div>
  );
};

export default MultiplePDFUpload;
