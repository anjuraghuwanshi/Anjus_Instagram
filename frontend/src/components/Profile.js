import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import Sidenavbar from './Sidenavbar';
import Postdetails from './Postdetails';
import ProfilePic from './ProfilePic';

export default function Profile() {
  const [pic, setPic] = useState([]);
  const [user, setUser] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [post, setPost] = useState(null);
  const [changePic , setChangePic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt")
          }
        });
        const result = await response.json();
        setPic(result.posts || []);
        setUser(result.user || {});
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const toggleComment = (post) => {
    setShowComment(true);
    setPost(post);
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  };

  return (
    <div>
      <Sidenavbar />
      <div className='profile'>
        <div className='profile-img'>
          <img onClick={changeProfile}
               src={user.photo ? user.photo : 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'} 
               alt="profile" />
        </div>
        <div className='profile-attributes'>
          <div className='userid'>
            <p>{user.username}</p> {/* Display the dynamic username */}
            <button>Edit Profile</button>
          </div>
          <div className='info'>
          <p>{pic.length} post{pic.length !== 1 && 's'}</p>
          <p>{user.followers ? user.followers.length:" 0 "} followers</p>
          <p>{user.following ? user.following.length:" 0 "} following</p>

            {/* Uncomment and update these lines if you have followersCount and followingCount data */}
            {/*
            <p>{followersCount} follower{followersCount !== 1 && 's'}</p>
            <p>{followingCount} following</p> */}
          </div>
        </div>
      </div>
      <div className='user-post'>
        {Array.isArray(pic) && pic.map((pics) => (
          <div className='post-container' key={pics._id}>
            <img src={pics.photo} alt="post" onClick={() => toggleComment(pics)} />
          </div>
        ))}
      </div>
      {showComment && 
        <Postdetails
          item={post}
          user={user}
          onClose={() => setShowComment(false)}
        />
      }
      {changePic && 
        <ProfilePic changeProfile={changeProfile} />
      }
    </div>
  );
}
