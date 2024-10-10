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

  return (
    <div className='insert-file'>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>} {/* Display message */}
    </div>
  );
};

export default MultiplePDFUpload;

