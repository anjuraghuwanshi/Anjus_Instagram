import React from 'react'
import logo from '../images/logo.svg'
import '../css/Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
        <img className='logo' src={logo}alt='instagram' />
        <ul className='nav-menu'>
        <Link to= "/signup">
          <li>SignUp</li>
        </Link>
          <Link to= "/signin">
            <li>SignIn</li>
          </Link>
          <Link to= "/profile">
          <li>Profile</li>
          </Link>

        </ul>
    </div>
  )
}
