import React ,{useState} from 'react'
import {toast } from 'react-toastify';
import "../css/Signin.css"
import logo from '../images/logo.svg'
import { Link ,useNavigate} from 'react-router-dom'
export default function SignIn() {
  const navigate = useNavigate()
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const postData = () =>{
    // checking email
    // if (!emailRegex.test(email)){
    //   notifyA("Envalid email")
    //   return
    // }
 fetch("/signin",{
  method:"post",
  headers:{
    "Content-Type": "application/json"
  },
  body:JSON.stringify({
email:email,
password:password,

  })
  }).then(res => res.json())
  .then(data => {
    if (data.error){
      notifyA(data.error)
    }else{
      notifyB(data.message)
      console.log(data.token)
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      navigate("/home")
    }

    console.log(data)
  })
  }
  return (
    <div className='signIn'>
      <div>
        <div className='loginForm'>
        <img  className = 'signUpLogo' src={logo} alt="instagram"/>
        <div>
          <input type="email" name = "email" value = {email} id="email" placeholder='Email' onChange={(e) => {
            setEmail(e.target.value)}}/>
        </div>

        <div>
          <input type="password" name='password' id="password" placeholder='Password' value={password} onChange={(e) => {setPassword(e.target.value)}}/>
        </div>
        <input type="submit" id="login-btn" value="Sign In" onClick={() => {postData()}} />
        </div>

<div className='loginForm2'>
Don't have an account? 
        <Link to="/">
        <span style={{
          color:'blue',
          cursor: "pointer"
        }}>Sign Up</span>
        </Link>
</div>

      </div>
    </div>
  )
}
