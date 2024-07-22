import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import Sidenavbar from './Sidenavbar';
import { json, useParams } from 'react-router-dom';

export default function UserPofile() {
    const {userid} = useParams()
    console.log(userid)
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
const [isFollow,setisFollow] = useState(false);
  useEffect(() => {
    setUser(user);

    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        setUser(result.user)
        setPosts(result.posts)
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
          setisFollow(true)
        }
      }
      )
      .catch(err => console.error(err));
  }, [isFollow]);

// to follow user 
const followUser = (userId)=>{
fetch("/follow",{
  method:"put",
  headers:{
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jwt"),
  },
  body:JSON.stringify({
    followId:userId
  })
})
.then((res)=>res.json())
.then((data)=>{
  console.log(data)
  setisFollow(true)
})
}

// to unfollow user 
const unfollowUser = (userId)=>{
  fetch("/unfollow",{
    method:"put",
    headers:{
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body:JSON.stringify({
      followId:userId
    })
  })
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data)
  setisFollow(false)

  })
  }


  return (
    <div>
      <Sidenavbar />
      <div className='profile'>
        <div className='profile-img'>
          <img src= {user.photo ? user.photo : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"} alt="profile" />
        </div>

        <div className='profile-attributes'>
          <div className='userid'>
            <p>{user.username}</p> {/* Display the dynamic username */}
            <button className='flw-unflw-btn' onClick={()=>{
              if(isFollow){
                unfollowUser(user._id)
              }
              else{
                followUser(user._id)
              }
             }}
            >
            
            {isFollow ? "Unfollow":"Follow"}</button>

          </div>
          <div className='info'>
            <p>{posts.length} post{posts.length !== 1 && 's'}</p>
            <p>{user.followers ? user.followers.length:"0"} followers</p>
            <p>{user.following? user.following.length: "0"} following</p>
          </div>
        </div>
      </div>

      <div className='user-post'>
        {posts.map((post) => (
          <div className='post-container' key={post._id}>
            <img src={post.photo} alt="post"/>
          </div>
        ))}
      </div>
{/* 
      {showComment && 
        <Postdetails
          item={post}
          onClose={() => setShowComment(false)}
        />
      } */}
    </div>
  );
}
