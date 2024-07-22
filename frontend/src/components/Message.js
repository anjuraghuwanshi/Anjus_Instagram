import React, { useState, useEffect } from 'react';
import '../css/Message.css';
import '../css/Search.css';
import { Link } from 'react-router-dom';
function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userfound, setUserFound] = useState(true);



  const [username, setUsername] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  useEffect(() => {
      if (username) {
          const fetchUsers = async () => {
              try {
                  const response = await fetch("/search", {
                      method: "post",
                      headers: {
                          "Authorization": "Bearer " + localStorage.getItem("jwt"),
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ query: username })
                  });
                  const result = await response.json();
                  if (result.users) {
                      setSearchUser(result.users);
                  }
              } catch (err) {
                  console.error(err);
              }
          };
          fetchUsers();
      } else {
          setSearchUser([]); // Clear search results if username is empty
      }
  }, [username]);








  useEffect(() => {
    fetch('/users', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    .then(res => res.json())
    .then(data => setUsers(data.users))
    .catch(err => console.error(err));
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const fetchMessages = (userId) => {
    fetch(`/messages/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    .then(res => res.json())
    .then(data => 
  setMessages(data.messages))
    
    .catch(err => console.error(err));
  };

  const handleSendMessage = () => {
    fetch('/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        recipientId: selectedUser._id,
        text: message
      })
    })
    .then(res => res.json())
    .then(data => {
      setMessages([...messages, data.message]);
      setMessage('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className='messages'>
      <div className='user-list'>
      <div className='search'>
            <div className='searchbar'>
                <input 
                    type='text' 
                    placeholder='Search' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div className='search-users'>
                {searchUser.length ? searchUser.map(user => (
                    <div className='users-profiles' key={user._id} onClick={() => handleUserSelect(user)}>
                        <img src={user.photo || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'} alt='Profile' />
                        <div className='user-details'>
                       
                            <p style={{fontWeight:'bold',fontSize:'14px'}}>{user.username}</p>
                           
                            <p style={{color:"#666362",fontSize:'14px'}}>{user.name}</p>
                        </div>
                    </div>
                )) : <p style={{marginTop:'0',fontWeight:'bold'}}>Seach users</p>}
                
                {messages.length && messages.map(message => (
                    <div className='users-profiles' key={message._id} onClick={() => handleUserSelect(message)}>
                        <img src={message.sender.photo || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'} alt='Profile' />
                        <div className='user-details'>
                       
                            <p style={{fontWeight:'bold',fontSize:'14px'}}>{message.sender.username}</p>
                           
                            <p style={{color:"#666362",fontSize:'14px'}}>{message.name}</p>
                        </div>
                    </div>
                )) }

            </div>
        </div>
  
      </div>
      <div className= { selectedUser ?'message-area-show':'message-area' }>
        {selectedUser ? (
          <>
            <h2>Chat with {selectedUser.username}</h2>
            <div className='messages-list'>
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender._id === selectedUser._id ? 'message-received' : 'message-sent'}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className='message-input'>
              <input 
                type='text' 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder='Type a message' 
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
