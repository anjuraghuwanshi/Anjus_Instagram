const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../requireLogin'); // Middleware to ensure the user is logged in
const USER = mongoose.model('USER');
const POST = mongoose.model('POST'); // Assuming your post model is named 'POST'
const STORY = mongoose.model('STORY');

// Route to get another user's profile by their ID or username
router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        // Find the user by ID or username
        const user = await USER.findById(req.params.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find posts made by the user
        const posts = await POST.find({ postedBy: req.params.id })
            .populate('postedBy', '_id name username')
            .populate('comments.postedBy', '_id name username')
            .sort('-createdAt');
        res.json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
// route to seach user profile
router.post('/search', requireLogin, async (req, res) => {
    try {
        const query = req.body.query;

        // Create a regular expression to match usernames
        const userPattern = new RegExp(query, "i");

        // First find exact matches (starting with query) and then partial matches
        const users = await USER.find({name: userPattern }).select('-password');

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Sort users by relevance: exact matches first, then partial matches
        const sortedUsers = users.sort((a, b) => {
            const aStartsWithQuery = a.username.toLowerCase().startsWith(query.toLowerCase());
            const bStartsWithQuery = b.username.toLowerCase().startsWith(query.toLowerCase());

            if (aStartsWithQuery && !bStartsWithQuery) {
                return -1;
            } else if (!aStartsWithQuery && bStartsWithQuery) {
                return 1;
            } else {
                // If both start with the query or both do not, sort alphabetically
                return a.username.localeCompare(b.username);
            }
        });

        return res.json({ users: sortedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//to follow user
router.put('/follow', requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.body.followId,
            { $addToSet: { followers: req.user._id } },
            { new: true }
        );

        if (!result) {
            return res.status(422).json({ error: 'User not found' });
        }

        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { following: req.body.followId } },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


//to unfollow user
router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        if (!result) {
            return res.status(422).json({ error: 'User not found' });
        }

        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


// to upload profile pic
router.put("/uploadprofilepic",requireLogin,async(req,res)=>{
    try{
 const user = await USER.findByIdAndUpdate(req.user._id,{
    $set:{photo:req.body.pic}
},{
    new: true
}).exec();

res.json(user);
    }
    catch(err){
    return res.status(422).json({error:err})
    }
})

// top apload story
router.post('/story', requireLogin, async (req, res) => {
    const { imageUrl } = req.body;
  
    if (!imageUrl) {
      return res.status(422).json({ error: 'Please provide an image URL' });
    }
  
    const story = new STORY({
      postedBy: req.user._id,
      imageUrl
    });
  
    try {
      const savedStory = await story.save();
      res.json({ story: savedStory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload story' });
    }
  });



  // Route to fetch stories of followed users
router.get('/stories', requireLogin, async (req, res) => {
    try {
      const user = await USER.findById(req.user._id).populate('following', '_id');
      const followedUserIds = user.following.map(user => user._id);
      const stories = await STORY.find({ postedBy: { $in: followedUserIds } }).populate('postedBy', 'username photo');
      res.json({ stories });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  // Get logged-in user's info and story
router.get('/profile', requireLogin, async (req, res) => {
    try {
      // Fetch the user info
      const user = await USER.findById(req.user._id).select('-password');
  
      // Fetch the user's story if available
      const story = await STORY.findOne({ postedBy: req.user._id }).populate('postedBy', 'username photo');
  
      res.json({ user, story });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user profile and story" });
    }
  });
  
// Delete a story
router.delete('/story/:storyId', requireLogin, (req, res) => {
    const { storyId } = req.params;
  
    STORY.findOneAndDelete({ _id: storyId, postedBy: req.user._id })
      .then(story => {
        if (!story) {
          return res.status(404).json({ error: "Story not found or you are not authorized to delete this story" });
        }
        res.json({ message: "Successfully deleted" });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Failed to delete the story" });
      });
  });
  



  router.get('/users', requireLogin, (req, res) => {
    USER.find()
      .select('_id username photo')  // Adjust the fields you want to return
      .then(users => {
        res.json({ users });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
      });
  });


module.exports = router;
