import React from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import '../css/Postdetails.css'
import {toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Postdetails = ({ item,user, onClose}) => {

    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
    const navigate = useNavigate()
   const removePost = (postId) =>{
    fetch(`/deletepost/${postId}`,{
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
    })
    .then((res)=>res.json())
    .then(data =>{
        if (data.error){
            notifyA(data.error)
        } else{
            notifyB("Post deleted successfully")
            navigate("/home")
        }
    })
    .catch(err => console.log(err));
   }
  return (
    <div className='showPostdetails'>
      <div className='Container'>
        <div className='PostPic'>
          <img src={item.photo} alt="post" />
        </div>
        <div className='Details'>
          <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
            <div className='card-pic'>
              <img src= {user.photo ? user.photo : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"} alt="profile" />
            </div>
            <h5>{item.postedBy.username}</h5>
            <i className='delete-post' onClick={()=>{removePost(item._id)}}><MdDelete/></i>
          </div>
        </div>
      </div>
      <div className='close-comment' onClick={onClose}>
        <i><IoCloseSharp /></i>
      </div>
    </div>
  );
}

export default Postdetails;
