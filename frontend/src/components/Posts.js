import React, { useEffect, useState } from 'react';
import '../css/Posts.css';
import { GrFavorite } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Likedbyusers from './Likedbyusers';

export default function Posts() {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentLikes, setCurrentLikes] = useState([]);
    const [showcomment, setShowComment] = useState(false);
    const [item, setItem] = useState({});

    useEffect(() => {
        fetch("/allposts", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        })
        .then(res => res.json())
        .then(result => {
            setData(result);
        })
        .catch(err => console.error(err));
    }, []);

    // to show and hide comments
    const toggleComment = (post) => {
        setShowComment(true);
        setItem(post);
        console.log(post);
    };

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setData(newData);
        })
        .catch(err => console.error(err));
    };

    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setData(newData);
        })
        .catch(err => console.error(err));
    };

    const isLikedByCurrentUser = (likes) => {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        return likes.some(like => like._id === userId);
    };

    const showMoreLikes = (likes) => {
        setCurrentLikes(likes);
        setShowModal(true);
    };

    const formatLikes = (likes) => {
        if (likes.length === 0) return 'No likes';
        if (likes.length === 1) return `Liked by ${likes[0].username}`;
        if (likes.length === 2) return `Liked by ${likes[0].username} and ${likes[1].username}`;
        return (
            <>
                Liked by {likes[0].username}, {likes[1].username} and{" "}
                <span onClick={() => showMoreLikes(likes)} style={{ cursor: "pointer", color: "blue" }}>
                    {likes.length - 2} others
                </span>
            </>
        );
    };


    // function for comments
    const makeComment = (text, id) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text: text,
                postId: id
            }),
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(post => {
                if (post._id === result._id) {
        
                    return result;
                } else {
                    return post;
                }
            });
            setData(newData);
            setComment(""); // clear the comment input after posting
        })
        .catch(err => console.error(err));
    };

    return (
        <div className='post'>
            {data.map(post => (
                <div className='card' key={post._id}>
                    <div className='card-header'>
                        <div className='card-pic'>
                            <img src= {post.postedBy.photo ? post.postedBy.photo : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"} alt="profile" />
                        </div>
                        <Link to = {`/profile/${post.postedBy._id}`}>
                        <h5>{post.postedBy.username}</h5>
                        </Link>
                    </div>
                    <div className='card-image'>
                        <img src={post.photo} alt="post" />
                    </div>
                    <div className='card-content'>
                        {isLikedByCurrentUser(post.likes) ? (
                            <i onClick={() => unlikePost(post._id)} className='RedHeart'><FaHeart className="liked" /></i>
                        ) : (
                            <i onClick={() => likePost(post._id)}><GrFavorite className="unliked" /></i>
                        )}
                        <p style={{fontWeight:"bold"}}>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</p>
                        <p>{formatLikes(post.likes)}</p>
                        <p style={{ cursor: "pointer" }} onClick={() => { toggleComment(post) }}>View all comments</p>
                    </div>
                    <div className='caption'>
                        <span>{post.postedBy.username}</span>
                        <p>{post.body}</p>
                    </div>
                    <div className='add-comment'>
                        <input
                            type='text'
                            placeholder='Add a comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className='comment' onClick={() => makeComment(comment, post._id)}>post</button>
                    </div>
                </div>
            ))}
            <Likedbyusers show={showModal} onClose={() => setShowModal(false)} likes={currentLikes} />
            {/* show Comments */}

            {showcomment && (
                 <div className='showComment'>
                    <div className='container'>
                        <div className='postPic'>
                            <img src={item.photo} alt="post" />
                        </div>
                        <div className='details'>
                            <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
                                <div className='card-pic'>
                                    <img src={item.postedBy.photo ? item.postedBy.photo : "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"} />
                                </div>
                                <h5>{item.postedBy.username}</h5>
                            </div>
                            <div className='comment-section' style={{ borderBottom: "1px solid #00000029" }}>
                                {item.comments && item.comments.map(comment => (
                                    <p className='comm' key={comment._id}>
                                    <img src={comment.postedBy.photo ?  comment.postedBy.photo :"https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg" } alt='photo' className='comment-photo' />
                                        <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy.username}: </span>
                                        <span className='commentText'>{comment.comment}</span>
                                    </p>
                                ))}
                            </div>
                            <div className='card-content'>
                                {isLikedByCurrentUser(item.likes) ? (
                                    <i onClick={() => unlikePost(item._id)} className='RedHeart'><FaHeart className="liked" /></i>
                                ) : (
                                    <i onClick={() => likePost(item._id)}><GrFavorite className="unliked" /></i>
                                )}
                                <p>{item.likes.length} {item.likes.length === 1 ? 'like' : 'likes'}</p>
                                <p>{formatLikes(item.likes)}</p>
                            </div>
                            <div className='add-comment'>
                                <input type='text' placeholder='Add a comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                                <button className='comment' onClick={() => makeComment(comment, item._id)}>post</button>
                            </div>
                        </div>
                    </div>
                    <div className='close-comment' onClick={() => { setShowComment(false) }}>
                        <i><IoCloseSharp /></i>
                    </div>
                </div> 
                
            )}
        </div>
    );
}
