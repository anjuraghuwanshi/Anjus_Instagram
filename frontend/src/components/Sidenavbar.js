import React, { useState } from 'react'
import logo from '../images/logo.svg'
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { MdExplore } from "react-icons/md";
import { FiVideo } from "react-icons/fi";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { FiPlusSquare } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import '../css/Sidenavbar.css';
import Search from './Search';
export default function Sidenavbar() {
  const userphoto = JSON.parse(localStorage.getItem("user")).photo;

  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleMessagesClick = () => {
    navigate('/messages');
  };


  const [showSearch,setShowSearch] = useState(false)

  const toggleSearch = ()=>{
    setShowSearch(!showSearch)
  }
  return (

    <div className='sidenav'>

        <div className='sidenav_logo'>
        <Link to='/home'>
        <img src={logo} alt = 'instagram'/>
</Link>
        <div className='sidenav_item_phone sidenav_item '>
        <i><FaRegHeart/></i>
        <p>Notifications</p>
        </div>
        
        <div className='sidenav_item_phone' onClick={handleMessagesClick}>
        <i><FiSend/></i>
        <p>Message</p>
        </div>

        

</div>

<div className='items'>
        <div className='sidenav_item'>
        <Link to='/home'>
        <i><GoHomeFill/></i>
        </Link>
        <Link to='/home'>
        <p>Home</p>
        </Link>
        </div>

        <div className='sidenav_item'>
  
        <i onClick={()=>toggleSearch()}><IoSearch/></i>
  
        <p>Search</p>
  
        </div>
  
        <div className='sidenav_item' style={{cursor:"not-allowed",opacity:'0.5'}}>
        <i><MdExplore/></i>
        <p>Explore</p>
        </div>

        <div className='sidenav_item' style={{cursor:"not-allowed",opacity:'0.5'}}>
        <i><FiVideo/></i>
        <p>Reels</p>
        </div>

        <div className='sidenav_item' onClick={handleMessagesClick}>
        <i><BiSolidMessageRoundedDots/></i>
        <p>Message</p>
        </div>

        <div className='sidenav_item'  style={{cursor:"not-allowed",opacity:'0.5'}}>
        <i><GoHeartFill/></i>
        <p>Notifications</p>
        </div>

        <div className='sidenav_item'>
        <Link to='/createpost'>
        <i><FiPlusSquare/></i></Link>
        <Link to = '/createpost'>
        <p>Create</p>
        </Link>
        
        </div>

        <div className='sidenav_item'>
        <Link to='/profile'>
        <img src={userphoto ? userphoto:"https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"}/>
        </Link>
        <Link to='/profile'>
        <p>Profile</p>
        </Link>
        </div>
        </div>
{ showSearch && <Search/>}
    </div>
  )
}
