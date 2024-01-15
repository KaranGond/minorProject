import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // Possible values: 'idle', 'uploading', 'success', 'error'
  const [serverResponse, setServerResponse] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      console.log('Starting file upload...');
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
      setServerResponse(response.data);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || uploadStatus === 'uploading'}>
        Upload
      </button>

      {uploadStatus === 'success' && <div style={{ color: 'green' }}>File uploaded successfully!</div>}
      {uploadStatus === 'error' && <div style={{ color: 'red' }}>Error uploading file. Please try again.</div>}

      {serverResponse && (
        <div>
          <h2>Server Response:</h2>
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
