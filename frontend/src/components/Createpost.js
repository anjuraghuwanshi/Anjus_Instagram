import React,{useState , useEffect} from 'react'
import {toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidenavbar from './Sidenavbar';
import '../css/Createpost.css'
export default function Createpost() {
    const [body,setBody] = useState("");
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const[username,setUsername] = useState("")
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
    const navigate = useNavigate()
    const userphoto = JSON.parse(localStorage.getItem("user")).photo;
      // Function to post details after image upload

      useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
            setUsername(user.username);
        }
    }, []);
      useEffect(() => {
        if (url) {
            // Saving post to MongoDB after URL is updated
            fetch("/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data =>{
                    if (data.error){
                        notifyA(data.error)
                    } else{
                        notifyB("Successfully Posted")
                        navigate("/home")
                    }
                })
                .catch(err => console.log(err));
        }
    }, [url]); // This useEffect runs when `url` changes
 // posting image to cloudnary
    const postDetails = ()=>{
        // console.log(body,image)
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","insta_clone")
        data.append("cloud_name","instaimgcloud")
        fetch("https://api.cloudinary.com/v1_1/instaimgcloud/image/upload",{
            method: "POST",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err))
        //saving post to mongodb

    }
    const loadfile  =  (event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
          URL.revokeObjectURL(output.src) // free memory
        }
    }
  return (
    // post header 
    <div className='createPost'>
    <Sidenavbar/>
    <div className='createPostbox'>
    <div className='post_header'>
        <h4 style={{margin:"3px auto"}}>Create New Post</h4>
        <button id='post-btn'onClick={()=>{postDetails()}}>Share</button>
    </div>
    {/* image preview */}
    <div className='main-div'>
    <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/224px-Picture_icon_BLACK.svg.png?20180309172929" id="output"/>
        <input 
        type='file' 
        accept='image/*' 
        onChange={(event)=>{
        loadfile(event);
        setImage(event.target.files[0])
        }}/>
    </div>

{/* details  */}
<div className='details'>
    <div className='card-header'>
        <div className='card-pic'>
            <img src = {userphoto ? userphoto : 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'}/>
        </div>
        <h5>{username}</h5>
    </div>
    <textarea value = {body} onChange = {(e)=>{
        setBody(e.target.value)
    }} type = 'text' placeholder='Write a caption'></textarea>
</div>
    </div>
    </div>
  )
}
