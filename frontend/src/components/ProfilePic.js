import React,{useState,useEffect,useRef} from 'react'
import '../css/Profilepic.css'
export default function ProfilePic( {changeProfile}) {
    const hiddenFileInput = useRef(null)
    const[image ,setImage] = useState("")
    const[url,setUrl] = useState("")
// posting image to cloudnary
const postDetails = ()=>{
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

useEffect(()=>{
    if(image){
        postDetails()
    }
},[image])


const postPic = ()=>{
  
        // Saving post to MongoDB after URL is updated
        fetch("/uploadprofilepic", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                pic: url
            })
        }).then(res => res.json())
            .then(data =>{
               console.log(data)
            })
            .catch(err => console.log(err));
    
}



    const handleClick = ()=>{
   hiddenFileInput.current.click();
    }

useEffect(()=>{
    if(url){
        postPic();
    }
},[url])
  return (
    <div className="profilepic darkBg">
        <div className='changePic centered'>
            <div>
                <h3>Change Profile Photo</h3>
            </div>
<div>
    <button className='upload-btn' style={{color:"#1EA1F7"}}
    onClick={handleClick}>Upload Photo</button>
    <input type='file' ref = {hiddenFileInput} accept='image/*' onChange={(e)=>setImage(e.target.files[0])} style={{display:'none'}} />
</div>
<div>
<button className='upload-btn' style={{color:"#ED4956"}}
onClick={()=>{setUrl(null)
postPic()}}
>Remove current Photo</button>
</div>
<div>
    <button style={{background:'none',border:"none",cursor:"pointer",fontSize:"15px"}}
   onClick={changeProfile} >cancel</button>
</div>
    </div>
    </div>
  )
}
