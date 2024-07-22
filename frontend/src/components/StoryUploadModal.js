import React, { useState, useEffect } from 'react';
import '../css/StoryUploadModal.css';
import {toast } from 'react-toastify';
export default function StoryUploadModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false); // State to track if uploading is in progress
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a URL for the selected file to show the preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // posting image to cloudinary
  const handleUpload = () => {
    setUploading(true); // Set uploading state to true when upload button is clicked
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'insta_clone');
    data.append('cloud_name', 'instaimgcloud');
    fetch('https://api.cloudinary.com/v1_1/instaimgcloud/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err))
      .finally(() => setUploading(false)); // Reset uploading state to false
    //saving post to mongodb
  };

  const postStory = () => {
    fetch('/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        imageUrl: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB("Story uploaded successfully!")
        console.log('Story uploaded successfully:', data);
        onUpload(data.story);
        onClose();
      })
      .catch((err) =>notifyA(err));
  };

  useEffect(() => {
    if (url) {
      postStory();
    }
  }, [url]);

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <h2>Upload Your Story</h2>
        <input type='file' onChange={handleFileChange} />
        {preview && <img src={preview} alt='Preview' className='preview-image' />}
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
