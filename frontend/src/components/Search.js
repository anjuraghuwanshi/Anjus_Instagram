import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../css/Search.css';

export default function Search() {
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

    return (
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
                    <div className='users-profiles' key={user._id}>
                        <img src={user.photo || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'} alt='Profile' />
                        <div className='user-details'>
                        <Link to = {`/profile/${user._id}`}>
                            <p style={{fontWeight:'bold',fontSize:'14px'}}>{user.username}</p>
                            </Link>
                            <p style={{color:"#666362",fontSize:'14px'}}>{user.name}</p>
                        </div>
                    </div>
                )) : <p style={{marginTop:'0',fontWeight:'bold'}}>Seach users</p>}
            </div>
        </div>
    );
}
