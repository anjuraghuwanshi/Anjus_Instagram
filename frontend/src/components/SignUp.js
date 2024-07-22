import React, { useState } from 'react'
import logo from '../images/logo.svg'
import '../css/SignUp.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    } else if (!passRegex.test(password)) {
      notifyA("Password must contain at least eight characters, including at least one number and one uppercase and lowercase letter, and special characters (e.g., #, ?, !)");
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        password: password,
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
        console.log(data);
      }).catch(err => console.error(err));
  }

  return (
    <div className='signUp'>
      <div className='form-container'>
        <div className='form'>
          <img className='signUpLogo' src={logo} alt="instagram" />
          <p className='loginPara'>
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input type="email" name="email" id="email" value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div>
            <input type="text" name="name" id="name" value={name} placeholder='Full name' onChange={(e) => { setName(e.target.value) }} />
          </div>
          <div>
            <input type="text" name="username" id="username" value={username} placeholder='Username' onChange={(e) => { setUsername(e.target.value) }} />
          </div>
          <div>
            <input type="password" id="password" value={password} placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <p className='terms'>
            By signing up, you agree to our Terms, <br /> privacy policy and cookies policy.
          </p>
          <input type="submit" id="submit-btn" value='Sign Up' onClick={postData} />
        </div>
        <div className='form2'>
          Already have an account? 
          <Link to="/signin">
            <span style={{ color: 'blue', cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
