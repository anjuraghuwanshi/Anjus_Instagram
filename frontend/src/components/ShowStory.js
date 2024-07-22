import React from 'react';
import '../css/ShowStory.css';
import { IoMdClose } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function ShowStory({ user, closeStory, onDeleteStory }) {
  const defaultPhoto = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png';

  if (!user) return null;

  const handleDelete = () => {
    onDeleteStory(user._id); // Assuming user._id is the story ID
  };

  return (
    <div className='show-story'>
      <i onClick={closeStory} className='close-story-icon'><IoMdClose /></i>
      
      <div className='story-container'>
        <div className='story-postedby'>
          <img src={user.postedBy.photo ? user.postedBy.photo : defaultPhoto} alt={user.postedBy.username} />
          <p>{user.postedBy.username}</p>
          {user.isLoggedInUser && (
            <i onClick={handleDelete} className="delete-story-button"><MdDeleteOutline/></i>
          )}
        </div>
        <img src={user.imageUrl} alt={`${user.postedBy.username}'s story`} className='story-image' />
        <div className='like-msg-send'>
          <input type='text' placeholder='reply' />
          <i><FaRegHeart /></i>
          <i><FiSend /></i>
        </div>
      </div>
    </div>
  );
}
