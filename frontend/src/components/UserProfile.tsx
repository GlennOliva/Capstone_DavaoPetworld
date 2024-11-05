import React, { useEffect, useState } from 'react';
import '../css/style.css'; // Import your CSS for styling

import news from '../images/news.png';
import marketplace from '../images/marketplace.png';
import profile_pic from '../images/profile-pic.png';
import photo from '../images/photo.png';

import haha from '../images/haha.png';
import like from '../images/like-blue.png';
import sad from '../images/sad.png';
import wow from '../images/wow.png';
import heart from '../images/heart.png';
import angry from '../images/angry.png';
import care from '../images/care.png';

import betta from '../e-commerce/images/betta-siamese.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const UserProfile = () => {
  const [isTextPostModalOpen, setTextPostModalOpen] = useState(false);
  const [isPhotoVideoModalOpen, setPhotoVideoModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [comment, setComment] = useState('');
  const [commentInputValue, setCommentInputValue] = useState(''); // For main comment input
  const [replyInputValue, setReplyInputValue] = useState(''); // For reply input
  const [showReplyInput, setShowReplyInput] = useState<{ postId: number; commentId: number }| null>(null);

  const handleReplyClick = (postId: number, commentId: number) => {
    // Toggle reply input visibility for the clicked comment
    setShowReplyInput(showReplyInput?.commentId === commentId ? null : { postId, commentId });
  };

  const replyComment = () => {
    const userId = localStorage.getItem('user_id');
    if (!showReplyInput) return; // Ensure there's a valid showReplyInput state
  
    const replyData = {
        post_id: showReplyInput.postId, // This should be the post ID
        user_id: userId, // Current user's ID
        reply_description: replyInputValue, // Use the reply input value
        comment_id: showReplyInput.commentId, // Include the comment_id
    };
  
    // Call your API to submit the reply
    axios.post('http://localhost:8081/insert_reply', replyData)
        .then(response => {
            console.log(response.data.message);
            // Reset the reply input field and close the reply input
            setReplyInputValue(''); // Reset reply input
            setShowReplyInput(null);
            setSnackbarMessage('Reply comment');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
  
      // Delay page refresh to allow Snackbar to show
      setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
        })
        .catch(error => {
            console.error('Error adding reply:', error);
            
    setSnackbarMessage('Failed to reply');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    setTimeout(() => {
      window.location.reload(); // Refresh the current page
  }, 2000); // Delay in milliseconds (2000ms)
        });
  };


  const [PostselectedEmojis, PostsetSelectedEmojis] = useState<{ [key: string]: { emojiSrc: string; emojiName: string } }>({});
const [PostshowEmojis, PostsetShowEmojis] = useState(false);
const [PostselectedEmoji, PostsetSelectedEmoji] = useState<string | null>(null);
const [PostselectedEmojiName, PostsetSelectedEmojiName] = useState('');

// Fetch emojis based on user_id from local storage
useEffect(() => {
  const userId = localStorage.getItem('user_id');
  
  if (!userId) {
    console.error('User ID is missing');
    return;
  }

  // Retrieve the saved emojis for the specific user
  const savedEmojis = JSON.parse(localStorage.getItem(`selectedEmojis_${userId}`) || '{}');
  PostsetSelectedEmojis(savedEmojis);
}, []);

const PostchangeEmoji = async (emojiSrc: string, name: string, post: any) => {
  const postId = post.id; // Get the current post's ID
  const userId = localStorage.getItem('user_id');

  // Check for valid userId
  if (!userId) {
    console.error('User ID is missing');
    return;
  }

  // Update the state for the specific post
  PostsetSelectedEmojis((prev) => {
    const updatedEmojis = {
      ...prev,
      [postId]: { emojiSrc, emojiName: name } // Set the selected emoji for the post ID
    };
    
    // Save updated emojis to localStorage under user-specific key
    localStorage.setItem(`selectedEmojis_${userId}`, JSON.stringify(updatedEmojis));
    return updatedEmojis;
  });

  try {
    // Send the reaction to the server
    await axios.post('http://localhost:8081/react', { userId, postId, reactionType: name });
    console.log('Reaction sent successfully');
  } catch (error) {
    console.error('Error sending reaction:', error);
  }
};


  


  

  const showTextPostModal = () => setTextPostModalOpen(true);
  const showPhotoVideoModal = () => setPhotoVideoModalOpen(true);
  const closeModal = (modalSetter: { (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (arg0: boolean): any; }) => modalSetter(false);



const toggleDropdown = (dropdownId: string) => {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
};



const submitSharePost = (postId: number, shareDescription: string) => {
  // Retrieve the admin/user ID from local storage
  const userId = localStorage.getItem('user_id'); 

  console.log('Share Post Content:', shareDescription);

  // Send the share data to the server via a POST request
  fetch('http://localhost:8081/share_post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      post_id: postId,
      user_id: userId,
      share_description: shareDescription,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Share post successfully') {
      // Handle success
      setSnackbarMessage('Share Post!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
  
      // Delay page refresh to allow Snackbar to show
      setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
      closeModal(setShareModalOpen); // Close the modal
    } else {
      // Handle error
      setSnackbarMessage('Failed to share post');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.reload(); // Refresh the current page
    }, 2000); // Delay in milliseconds (2000ms)
    }
  })
  .catch(error => {
    console.error('Error while sharing post:', error);
    alert('An error occurred while sharing the post');
  });
};



const [userProfile, setUserProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);

useEffect(() => {
      const userId = localStorage.getItem('user_id'); // Retrieve the admin ID from local storage
  
      if (userId) {

          fetch(`http://localhost:8081/user/${userId}`) // Adjusted endpoint to fetch by ID
              .then(res => {
                  if (!res.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return res.json();
              })
              .then(data => setUserProfile(data[0] || null)) // Assuming the response is an array
              .catch(err => console.log(err));
      } else {
          console.log("User ID not found in local storage");
      }
  }, []);
  

  const [postDescription, setPostDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setImage(e.target.files[0]);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve user_id from local storage
    const userId = localStorage.getItem('user_id');
    
    // Create form data object
    const formData = new FormData();
    formData.append('user_id', userId || ''); // Append user_id to formData
    formData.append('post_description', postDescription);
    formData.append('status', status);
    if (image) formData.append('image', image);

    try {
        // Send POST request to the backend
        const response = await axios.post('http://localhost:8081/add_post', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(response.data);

        setSnackbarMessage('Post Successfully Created!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        setPostDescription('');
        setStatus('Active');
        setImage(null);

        // Delay navigation to allow Snackbar to show
        setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
      

    } catch (error) {
        console.error('Error creating post:', error);
        setSnackbarMessage('Failed to create post');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);

        // Delay navigation in case of error too, if needed
        setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
      
    }
};


const submitComment = async (comment: any) => {
  const commentInput = document.querySelector('.comment-input') as HTMLInputElement;
  const commentDescription = commentInput.value.trim(); // Use trim() to avoid empty spaces
  const userId = localStorage.getItem('user_id'); // Get user ID from local storage
  const postId = comment.id;

  // Debugging log to see the values
  console.log('User ID:', userId);
  console.log('Post ID:', postId);
  console.log('Comment Description:', commentDescription);

  if (!userId || !postId || !commentDescription) {
    console.error('All fields are required');
    return; // Exit if any field is missing
  }

  try {
    const response = await axios.post('http://localhost:8081/comment', {
      userId,
      postId,
      commentDescription,
    });

    if (response.status === 201) {
      console.log(response.data.message);
      setSnackbarMessage('Comment Posted');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
  
      // Delay page refresh to allow Snackbar to show
      setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
      
      commentInput.value = ''; // Clear the input field after submission
  }
  
  } catch (error) {
    console.error('Error adding comment:', error);
    setSnackbarMessage('Failed to comment post');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload(); // Refresh the current page
      }, 2000); // Delay in milliseconds (2000ms)
  }
};







const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
const navigate = useNavigate();
const [snackbarOpen, setSnackbarOpen] = useState(false);

const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
      return;
  }
  setSnackbarOpen(false);
};

 

const { id } = useParams<{ id: string }>(); // Get the user ID from the URL params
const [data, setData] = useState([]); // State to hold fetched posts

useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8081/fetch_post_profile?user_id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result); // Set the response data to the state
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    fetchPosts(); // Call the fetch function
}, [id]); // Add id to the dependency array



const [totalReactions, setTotalReactions] = useState<{ [key: string]: number }>({}); // Define a state for reactions

    useEffect(() => {
        const fetchReactions = async (postId: number) => { // Specify the type for postId
            try {
                const response = await axios.get(`http://localhost:8081/reactions/${postId}`);
                setTotalReactions(prev => ({ ...prev, [postId]: response.data.total })); // Update state with reaction count
            } catch (err) {
                console.error('Error fetching reactions:', err);
            }
        };

        // Fetch reactions for each post
        data.forEach(post => {
            fetchReactions(post['id']);
        });
    }, [data]);


    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!currentPostId) return; // Exit if no post ID is provided
            try {
                const response = await fetch(`http://localhost:8081/fetch_comment?post_id=${currentPostId}`);
                const data = await response.json();
                setComments(data); // Set comments from the response
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments(); // Call without arguments
    }, [currentPostId]); // Dependency array includes currentPostId

    


    const [totalComments, setTotalComments] = useState<{ [key: string]: number }>({}); // Define a state for reactions

    useEffect(() => {
        const fetchComments = async (postId: number) => { // Specify the type for postId
            try {
                const response = await axios.get(`http://localhost:8081/fetch_comment_count/${postId}`);
                setTotalComments(prev => ({ ...prev, [postId]: response.data.total })); // Update state with reaction count
            } catch (err) {
                console.error('Error fetching reactions:', err);
            }
        };

        // Fetch reactions for each post
        data.forEach(post => {
            fetchComments(post['id']);
        });
    }, [data]);


    const [totalShares, setTotalShares] = useState<{ [key: string]: number }>({}); // Define a state for reactions

    useEffect(() => {
        const fetchShares = async (postId: number) => { // Specify the type for postId
            try {
                const response = await axios.get(`http://localhost:8081/fetch_share_count/${postId}`);
                setTotalShares(prev => ({ ...prev, [postId]: response.data.total })); // Update state with reaction count
            } catch (err) {
                console.error('Error fetching reactions:', err);
            }
        };

        // Fetch reactions for each post
        data.forEach(post => {
            fetchShares(post['id']);
        });
    }, [data]);


    const [replies, setReplies] = useState<{ [key: number]: any[] }>({});

    // Fetch replies for a specific comment
const fetchReplies = (comment_id: any) => {
  axios.get('http://localhost:8081/fetch_replies', { params: { comment_id } })
    .then(response => {
      setReplies(prevReplies => ({
        ...prevReplies,
        [comment_id]: response.data // Store replies under the comment's ID
      }));
    })
    .catch(error => {
      console.error('Error fetching replies:', error);
    });
};

// Automatically fetch replies for all comments when the component mounts
useEffect(() => {
  comments.forEach(comment => {
    fetchReplies(comment['id']); // Fetch replies for each comment
  });
}, [comments]);


interface User {
  id: number;
  address?: string; // Make it optional if it may not be present
  phone?: string;
  email?: string;
  gender?: string;
  birthdate?: string;
  bio?:string;
  age?:string;
  first_name?: string;
  last_name?: string;
  image?: string;
}


const [userData, setUserData] = useState<User | null>(null);

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/user/${id}`);
            setUserData(response.data[0]); // Assuming response is an array of objects
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    fetchUserData();
}, [id]); // Fetch user data when the ID changes


  return (
    <body>
      
  
    <div className="container">
    <div className="sidebar-lef1">
    <div className="imp-links">
      <a href="/"><img src={news} alt="News" />Latest News</a>
      <Link to="/ecommerce" className="link">
        <img src={marketplace} alt="Fish Shopping" />
        Store
      </Link>
    </div>

      </div>

      <div className="main-content">
 
      <div className="write-post-container1" style={{ marginBottom: '4%' }}>
    <div className="profile-card">
        <div className="profile-header">
            {userProfile?.image ? (
          <img style={{width: '100px'}} alt="Profile" className="profile-image"
            src={`http://localhost:8081/uploads/${userData?.image}`}
       
          />  
        ) : (
          <img
            src={profile_pic} // Fallback image if userProfile.image is not available
            alt="Default Profile"
          />
        )}
            <h3 style={{textAlign: 'center'}}>{userData?.first_name + ' ' + userData?.last_name}</h3>
            <p>{userData?.bio}</p>
        </div>
        <div className="profile-info">
              <div className="info-item">
                  <i className="bx bxs-home"></i>
                  <span>Lives in <strong>{userData?.address|| "Unknown City"}</strong></span>
              </div>
              <div className="info-item">
                  <i className="bx bxs-user-plus"></i>
                  <span>Age: <strong>{userData?.age}</strong></span>
              </div>
              <div className="info-item">
                  <i className="bx bxs-envelope"></i>
                  <span>Email: <strong>{userData?.email}</strong></span>
              </div>
              <div className="info-item">
                  <i className="bx bxs-user"></i>
                  <span>Gender: <strong>{userData?.gender}</strong></span>
              </div>
              <div className="info-item">
                  <i className="bx bxs-calendar"></i>
                  <span>Birthdate: <strong>{userData?.birthdate}</strong></span>
              </div>



        </div>
        {/* <div className="edit-profile-container">
        <Link to={`/profile_settings/${userData?.id}`} style={{ textDecoration: 'none' }}>
    <button className="edit-profile-btn" style={{ padding: '10%', margin: '-15px 0' }}>
      Edit Profile
    </button>
  </Link>
</div> */}


    </div>
</div>



<Snackbar 
    open={openSnackbar} 
    autoHideDuration={2000}
    onClose={() => setOpenSnackbar(false)}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning
>
<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant='filled'>
                    {snackbarMessage}
                </Alert>
</Snackbar>
 

        {/* <div className="write-post-container">
          <div className="user-profile">
           
{userProfile?.image ? (
    <img
      src={`http://localhost:8081/uploads/${userProfile.image}`} // Use dynamic image
      alt="Profile"
    />
  ) : (
    <img
      src={profile_pic} // Fallback image if userProfile.image is not available
      alt="Default Profile"
    />
  )}
            <div>
            <p style={{   fontSize: '17px',color: 'black', }}>{userProfile?.first_name + ' ' + userProfile?.last_name}</p>
            </div>
          </div>

          <div className="post-input-container">
            <textarea
              id="post-textarea"
              cols={80}
              rows={1}
              placeholder={`What's on your mind, ${userProfile?.first_name}?`}
              onClick={showTextPostModal}
            ></textarea>
          </div>
          <div className="add-post-links">
            <a href="#" onClick={showPhotoVideoModal}><img src={photo} alt="Photo/Video" />Photo</a>
          </div>
        </div> */}

       {/* Text Post Modal */}
{isTextPostModalOpen && (
  <div id="textPostModal" className="modal">
    <div className="modal-content">
      <h1 style={{ textAlign: 'center', fontSize: '16px' }}>Create Post</h1>
      <span className="close" onClick={() => closeModal(setTextPostModalOpen)}>&times;</span>
      <div className="user-profile" style={{ padding: '12px' }}>
        {userProfile?.image ? (
          <img
            src={`http://localhost:8081/uploads/${userProfile.image}`} // Use dynamic image
            alt="Profile"
          />
        ) : (
          <img
            src={profile_pic} // Fallback image if userProfile.image is not available
            alt="Default Profile"
          />
        )}
        <div>
          <p style={{ fontSize: '17px',color: 'black', }}>{userProfile?.first_name + ' ' + userProfile?.last_name}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="textPostContent"
          cols={62}
          rows={3}
          placeholder={`What's on your mind, ${userProfile?.first_name}?`}
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
        
        {/* Status Dropdown */}
        {/* <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          <option value="Public">Public</option>
          <option value="Friends">Friends</option>
          <option value="Only Me">Only Me</option>
        </select> */}

        <input
          type="file"
          id="photoVideoUpload"
          onChange={handleImageChange}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  </div>
)}

{/* Photo/Video Post Modal */}
{isPhotoVideoModalOpen && (
  <div id="photoVideoModal" className="modal">
    <div className="modal-content">
      <h1 style={{ textAlign: 'center', fontSize: '16px' }}>Create Post</h1>
      <span className="close" onClick={() => closeModal(setPhotoVideoModalOpen)}>&times;</span>
      <div className="user-profile" style={{ padding: '12px' }}>
        {userProfile?.image ? (
          <img
            src={`http://localhost:8081/uploads/${userProfile.image}`} // Use dynamic image
            alt="Profile"
          />
        ) : (
          <img
            src={profile_pic} // Fallback image if userProfile.image is not available
            alt="Default Profile"
          />
        )}
        <div>
          <p style={{   fontSize: '17px',color: 'black', }}>{userProfile?.first_name + ' ' + userProfile?.last_name}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="photoVideoContent"
          cols={60}
          rows={3}
          placeholder="Say something about this photo/video..."
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
        
        {/* Status Dropdown */}
        {/* <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          <option value="Public">Public</option>
          <option value="Friends">Friends</option>
          <option value="Only Me">Only Me</option>
        </select> */}

        <input
          type="file"
          id="photoVideoUpload"
          onChange={handleImageChange}
          multiple // Allow multiple files for photo/video posts
        />
          <button type="submit">Post</button>
      </form>
    </div>
  </div>
)}


       

<div className="post-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
  {data.map((post, key) => {
    const selectedEmoji = PostselectedEmojis[post['id']]; // Get the selected emoji for this post
    const reactionsCount = totalReactions[post['id']] || 0; // Get the count of reactions for this post
    const commentsCount = totalComments[post['id']] || 0;
    const sharesCount = totalShares[post['id']] || 0;
    const formattedTime = formatDistanceToNow(new Date(post['created_at']), { addSuffix: true });
    const formattedTimeshare = formatDistanceToNow(new Date(post['share_created_at']), { addSuffix: true });
    return (
      <div key={key} className="single-post-container" style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
        
        {/* User Profile Section */}
        <div className="post-row">
          <div className="user-profile">
            <img 
              src={post['creator_image'] ? `http://localhost:8081/uploads/${post['creator_image']}` : profile_pic} 
              alt="Profile" 
              style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
            />
            <div>
              <p style={{ fontSize: '17px', color: 'black' }}>{post['creator_first_name'] + ' ' + post['creator_last_name'] || 'Unknown User'}</p>
              <p style={{ fontSize: '11px', color: 'black', padding: '4px' }}>{formattedTime}</p>
            </div>
          </div>
          
          {/* Post Content Section */}
          <div className="post-text" style={{ fontSize: '16px', color: 'black' }}>
            <p style={{ paddingBottom: '10px' }}>
              {post['post_description'] || 'Betta Splender high breed!'}
            </p>
            {post['image'] && (
              <img 
                style={{
                  width: '100%',
                  height: 'auto',
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }} 
                src={`http://localhost:8081/uploads/${post['image']}`} 
                alt="Post Image" 
              />
            )}
          </div>

     {/* Shared Content Section */}
{post['share_id'] && (  // Check if there is a share_id for the post
  <div className="share-content" style={{ margin: '20px 0' }}>
    <div className="user-profile">
      <img 
        src={post['sharer_image'] ? `http://localhost:8081/uploads/${post['sharer_image']}` : profile_pic} 
        alt="Profile" 
        style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
      />
      <div>
        <p style={{ fontSize: '17px', color: 'black' }}>
          {post['sharer_first_name'] + ' ' + post['sharer_last_name'] || 'Unknown User'}
        </p>
        <p style={{ fontSize: '11px', color: 'black', padding: '4px' }}>
          {formattedTime} {/* You can replace this with actual formatted time if needed */}
        </p>
      </div>
    </div>

    <div className="share-text" style={{ fontSize: '16px', color: 'black', marginTop: '10px' }}>
      <p style={{ paddingBottom: '10px' }}>
        {post['share_description'] || ''} {/* Display share description only if exists */}
      </p>
      {post['share_image'] && (
        <img
          style={{
            width: '100%',
            height: 'auto',
            marginBottom: '10px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          src={`http://localhost:8081/uploads/${post['share_image']}`}
          alt="Shared Image"
        />
      )}
    </div>
    
    <small style={{ color: 'gray' }}>
      Shared on {formattedTime}  {/* Assuming formattedTime shows when the share happened */}
    </small>
  </div>
)}

          <hr />

          {/* Post Engagement Section */}
          <div className="post-engagement">
            <div className="engagement-item">
              <i className="fa fa-thumbs-up"></i> {reactionsCount} Likes
            </div>
            <div className="engagement-item">
              <i className="fa fa-comment"></i> {commentsCount} Comments
            </div>
            <div className="engagement-item">
              <i className="fa fa-share"></i> {sharesCount} Shares
            </div>
          </div>

          <hr />

          {/* Post Actions Section */}
          <div className="activity-icons">
            {/* Reaction Button */}
            <div
              className="reaction-button"
              onMouseEnter={() => PostsetShowEmojis(true)}
              onMouseLeave={() => PostsetShowEmojis(false)}
              data-user-id={localStorage.getItem('user_id')} // Add user_id as a data attribute
            >
              <a href="#" className="like-reply1">
                {selectedEmoji ? (
                  <div className="selected-emoji-container">
                    <img
                      src={selectedEmoji.emojiSrc}
                      alt="Selected Emoji"
                      className="selected-emoji"
                    />
                    <span className="emoji-name">{selectedEmoji.emojiName}</span>
                  </div>
                ) : (
                  <div>
                    <i className="fa fa-thumbs-up"></i> Like
                  </div>
                )}
              </a>

              {PostshowEmojis && (
                <div className="emoji-options">
                  <img src={like} alt="Like" onClick={() => PostchangeEmoji(like, 'Like', post)} />
                  <img src={haha} alt="Haha" onClick={() => PostchangeEmoji(haha, 'Haha', post)} />
                  <img src={sad} alt="Sad" onClick={() => PostchangeEmoji(sad, 'Sad', post)} />
                  <img src={wow} alt="Wow" onClick={() => PostchangeEmoji(wow, 'Wow', post)} />
                  <img src={heart} alt="Heart" onClick={() => PostchangeEmoji(heart, 'Heart', post)} />
                  <img src={angry} alt="Angry" onClick={() => PostchangeEmoji(angry, 'Angry', post)} />
                  <img src={care} alt="Care" onClick={() => PostchangeEmoji(care, 'Care', post)} />
                </div>
              )}
            </div>

            {/* Comment Button */}
            <div className="comment-button">
              <a 
                href="#" 
                className="comment-reply" 
                onClick={() => {
                  setCurrentPostId(post['id']); // Set the current post ID
                  setCommentModalOpen(true); // Open the comment modal
                }}
              >
                <i className="fa fa-comment"></i> Comment
              </a>
            </div>

            {/* Share Button */}
            <div className="share-button">
              <a href="#" className="share-reply" onClick={() => {
                setCurrentPostId(post['id']);
                setShareModalOpen(true);
              }}>
                <i className="fa fa-share"></i> Share
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>





       

 {/* Share Post Modal */}
{isShareModalOpen && (
  <div id="shareModal" className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => closeModal(setShareModalOpen)}>&times;</span>
      
      <h1 style={{ textAlign: 'center', fontSize: '16px' }}>Share Post</h1>

      {data
        .filter(post => post['id'] === currentPostId) // Filter based on post ID
        .reduce((uniquePosts, post) => {
          // Check if the post is already in the uniquePosts array
          const isPostExist = uniquePosts.some(p => p['id'] ===p['id']);
          if (!isPostExist) {
            uniquePosts.push(post); // Add post if it does not exist
          }
          return uniquePosts; // Return the array of unique posts
        }, [])
        .map((post) => {
          const formattedTime = formatDistanceToNow(new Date(post['created_at']), { addSuffix: true });
          let shareContent = ''; // Variable to store the textarea content

          return (
            <div key={post['id']}>
              {/* User Profile Section */}
              <div className="user-profile" style={{ marginBottom: '2%' }}>
              <img src={userProfile?.image ? `http://localhost:8081/uploads/${userProfile.image}` : profile_pic} alt="User Image" />
                <div>
                  <p>{userProfile?.first_name + ' ' + userProfile?.last_name}</p>
                </div>
              </div>

              {/* Textarea for Share Comment */}
              <textarea 
                id="shareContent" 
                placeholder="Say something about this..." 
                cols={75} 
                rows={4}
                onChange={(e) => shareContent = e.target.value} // Update shareContent with textarea input
              ></textarea>

              {/* Post Image */}
              <img src={post['image'] ? `http://localhost:8081/uploads/${post['image']}` : betta} alt="Post Image" className="post-img" />

              {/* Share Button */}
              <button 
                type="button" 
                onClick={() => submitSharePost(post['id'], shareContent)} // Pass the post ID and share content to the function
              >
                Share Post
              </button>
            </div>
          );
        })}
    </div>
  </div>
)}


</div>


      {isCommentModalOpen && (
  <div id="commentModal" className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setCommentModalOpen(false)}>&times;</span>

      {data
        .filter(comment => comment['id'] === currentPostId)
        .map((comment) => {
          const formattedTime = formatDistanceToNow(new Date(comment['created_at']), { addSuffix: true });
          const reactionsCount = totalReactions[comment['id']] || 0; // Get the count of reactions for this post
          const commentsCount = totalComments[comment['id']] || 0;
          const sharesCount = totalShares[comment['id']] || 0;

          return (
            <div key={comment['id']}>
              {/* User Profile Section */}
              <div className="user-profile" style={{ marginBottom: '2%' }}>
                {userData?.image ? (
                  <img src={`http://localhost:8081/uploads/${userData?.image}`} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : (
                  <img src={profile_pic} alt="Default Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                )}
                <div>
                  <p style={{ fontSize: '17px', color: 'black' }}>
                    {userData?.first_name + ' ' +  userData?.last_name || 'Unknown User'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'black', padding: '4px' }}>
                    {formattedTime}
                  </p>
                </div>
              </div>

              {/* Post Image */}
              <img src={`http://localhost:8081/uploads/${comment['image']}`} alt="Post Image" className="comment-img" />

              {/* Likes, Comments, and Shares Section */}
              <div className="post-interaction">
                <div className="engagement-item">
                  <i className="fa fa-thumbs-up"></i> {reactionsCount} Likes
                </div>
                <div className="engagement-item">
                  <i className="fa fa-comment"></i> {commentsCount} Comments
                </div>
                <p><i className="bx bx-share"></i> {sharesCount} Shares</p>
              </div>

              {/* Fetch and Display User Comments */}
              <div className="comments-section">
  {comments.map(comment => {
    const formattedTime = formatDistanceToNow(new Date(comment['created_at']), { addSuffix: true });

    return (
      <div className="comment-item" key={comment['id']}>
        <img src={`http://localhost:8081/uploads/${comment['user_image']}`} alt="User Icon" className="comment-user-icon" />
        <div className="comment-details">
          <p className="comment-user-name">{`${comment['first_name']} ${comment['last_name']}`}</p>
          <p className="comment-text">{comment['comment_description']}</p>
          <div className="comment-actions">
            <small>{formattedTime}</small>
            <a href="#" className="like-reply" onClick={() => handleReplyClick(comment['post_id'], comment['id'])}>Reply</a>
          </div>
        </div>

        {/* Conditionally Render Reply Input Section */}
        {showReplyInput?.commentId === comment['id'] && (
          <div className="input-container1" style={{ marginTop: '15%' }}>
            <img src={`http://localhost:8081/uploads/${userProfile?.image}`} alt="User Icon" className="comment-user-icon" />
            <input 
              type="text" 
              placeholder={`Reply as ${userProfile?.first_name}`}
              value={replyInputValue}
              onChange={(e) => setReplyInputValue(e.target.value)} 
              className="reply-input"
            />
            <i className="bx bx-send send-icon" onClick={replyComment}></i>
          </div>
        )}

        {/* Fetch and Display Replies ONLY when input is NOT shown */}
        {showReplyInput?.commentId !== comment['id'] && (
          <div className="replies-section">
            {replies[comment['id']]?.map(reply => (
              <div className="input-container2" key={reply['id']}>
                <img src={`http://localhost:8081/uploads/${reply['user_image']}`} alt="User Icon" className="comment-user-icon" />
                <div className="reply-details">
                  <p className="reply-user-name">{`${reply['first_name']} ${reply['last_name']}`}</p>
                  <p className="reply-text">{reply['reply_description']}</p>
                  <small>{formatDistanceToNow(new Date(reply['created_at']), { addSuffix: true })}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })}




                {/* Comment Input */}
                <div className="input-container">
                  {userProfile?.image ? (
                    <img
                      src={`http://localhost:8081/uploads/${userProfile.image}`} // Use dynamic image
                      alt="Profile"
                      className="comment-user-icon"
                    />
                  ) : (
                    <img
                      src="/path/to/default/profile_pic.png" // Fallback image
                      alt="Default Profile"
                    />
                  )}
                  <input 
                    type="text" 
                    placeholder={`Comment as ${userProfile?.first_name} ${userProfile?.last_name}`} 
                    className="comment-input"
                  />
                  <i 
                    className="bx bx-send send-icon" 
                    onClick={() => submitComment(comment)}>
                  </i>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
)}


<div className="sidebar-right" style={{ backgroundColor: 'transparent' }}>

    
      </div>
    </div>
    </body>
  );
};

export default UserProfile;
