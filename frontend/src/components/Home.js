import React from 'react'
import Sidenavbar from './Sidenavbar'
import Main from './Main'
import '../css/Home.css'

// import  {useNavigate } from "react-router-dom"

export default function Home() {
//   const navigate = useNavigate()
//   useEffect(() =>{
//     const token = localStorage.getItem("jwt");
//     if(!token){
// navigate("/")
//     }
//   },[]);
  return (
    <div className='home'>

    <Sidenavbar/>
    <Main/>
    
      </div>
    
  )
}
