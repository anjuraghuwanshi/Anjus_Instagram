import React from 'react';
import '../css/Likedbyusers.css';

export default function Likedbyusers({ show, onClose, likes }) {
    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Liked by</h2>
               
                    {likes.map(user => (
                        <ul>
                        <img src= { user.photo ? user.photo : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"}/>
                        <li key={user._id}>{user.username}</li>
                        </ul>
                    ))}
                
            </div>
        </div>
    );
}
