import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import Users from './users';
import Posts from './Posts';
import ShowStory from './ShowStory';
import StoryUploadModal from './StoryUploadModal';
import {toast } from 'react-toastify';
export default function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleStory, setToggleStory] = useState(false);
  const [currentStoryUser, setCurrentStoryUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserStory, setLoggedInUserStory] = useState(null);
  const [stories, setStories] = useState([]);
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const [watchedStories, setWatchedStories] = useState(false);
  const defaultPhoto = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png';

  useEffect(() => {
    fetch('/stories', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(result => {
        setStories(result.stories);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('/profile', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(result => {
        setLoggedInUser(result.user);
        if (result.story) {
          setLoggedInUserStory(result.story);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const closeStory = () => {
    setToggleStory(!toggleStory);
  };

  const handleStory = (story) => {
    const storyUser = {
      ...story,
      isLoggedInUser: story.postedBy._id === loggedInUser._id
    };
    setCurrentStoryUser(storyUser);
    setToggleStory(true);
  };

  const handleOpenModal = (event) => {
    event.stopPropagation();
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  const handleUpload = (file) => {
    console.log('Uploading file:', file);
  };

  const handleDeleteStory = (storyId) => {
    fetch(`/story/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          console.error(result.error);
          notifyA(result.error); // Display the error message
        } else {
          // Remove the story from state
          if (loggedInUserStory && storyId === loggedInUserStory._id) {
            setLoggedInUserStory(null);
            notifyB("Story deleted successfully!")
          } else {
            setStories(stories.filter(story => story._id !== storyId));
          }
          setToggleStory(false);
        }
      })
      .catch(err => {
        console.error("An error occurred", err);
        alert("An error occurred while deleting the story"); // Display the error message
      });
  };

  return (
    <>
      <div className='story_post'>
        <div className='main'>
          <div className="viewport">
            <ul className="list">
              <li className='item' onClick={loggedInUserStory ? () => handleStory(loggedInUserStory) : null}>
                <div className='profile-container'>
                  {!loggedInUserStory ? 
                    <img 
                      className='story_profile' 
                      style={{ background: 'none' }} 
                      src={loggedInUser?.photo || defaultPhoto} 
                      alt={loggedInUser?.username || 'username'} 
                    />
                    :
                    <img 
                      className='story_profile' 
                      src={loggedInUser?.photo || defaultPhoto} 
                      alt={loggedInUser?.username || 'username'} 
                    />
                  }
                  {!loggedInUserStory ? <span className='plus-sign' onClick={(event) => { handleOpenModal(event); console.log('Plus icon clicked'); }}>+</span> : null}
                </div>
                <p>{loggedInUser ? (loggedInUser.username.length > 10 ? loggedInUser.username.slice(0, 10) + '...' : loggedInUser.username) : 'Loading...'}</p>
              </li>
              {stories.map((story) => (
                <li className='item' key={story._id}>
                  {!watchedStories ? 
                    <img className='story_profile' src={story.postedBy.photo} alt={story.postedBy.username} onClick={() => { handleStory(story); setWatchedStories(true); }} />
                    :
                    <img className='watched-story_profile' src={story.postedBy.photo} alt={story.postedBy.username} onClick={() => handleStory(story)} style={{ border: '2px solid black' }} />
                  }
                  <p>{story.postedBy.username.length > 10 ? story.postedBy.username.slice(0, 10) + '...' : story.postedBy.username}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Posts />
        </div>
        {isModalOpen && (
          <StoryUploadModal onClose={handleCloseModal} onUpload={handleUpload} />
        )}
      </div>
      {toggleStory && <ShowStory user={currentStoryUser} closeStory={closeStory} onDeleteStory={handleDeleteStory} />}
    </>
  );
}
