import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Createpost from './components/Createpost';
import UserPofile from './components/UserProfile';
import Search from './components/Search';
import Messages from './components/Message';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
    
    <Routes>
      <Route path="/" element= {<SignUp/>}></Route>
      <Route path="/signin" element= {<SignIn/>}></Route>
      <Route exact path="/profile" element= {<Profile/>}></Route>
      <Route path="/home" element= {<Home/>}></Route>
      <Route path="/createpost" element= {<Createpost/>}></Route>
      <Route path="/profile/:userid" element= {<UserPofile/>}></Route>
      <Route path ="/search" element= {<Search/>}></Route>
      <Route path = "/messages" element = {<Messages/>}></Route>

    </Routes>
    <ToastContainer theme='dark' />
    </div>

    </BrowserRouter>
  );
}

export default App;
