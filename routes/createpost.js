const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../requireLogin');
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");

// Route
router.get("/allposts", requireLogin, async (req, res) => {
    try {
        const posts = await POST.find()
            .populate("postedBy", "_id name username photo")
            .populate({
                path: 'comments.postedBy',
                select: '_id name username photo'
            })
            .populate("likes", "username photo") // Assuming likes reference User and you want to populate the photo too
            .sort('-createdAt')
            .exec();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Failed to load posts' });
    }
});

router.post("/createpost",requireLogin,(req,res)=>{
    const {body,pic} = req.body;
    if(!pic || !body){
        return res.status(422).json({error:"Please add all the fields"})

    }
    req.user
    const post = new POST({
        body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then((result) =>{
        return res.json({post: result})
    }).catch(error=> console.log(error));
})

router.get("/myposts", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Fetch posts and user details concurrently
      const [myposts, user] = await Promise.all([
        POST.find({ postedBy: userId })
          .populate("postedBy", "_id name username")
          .populate({
            path: 'comments.postedBy',
            select: '_id name username'
          })
          .sort('-createdAt'), // Sort posts by creation date
        USER.findById(userId)
          .select('-password') // Exclude password field
          .populate('followers', '_id name username')
          .populate('following', '_id name username')
      ]);
  
      // Construct the response object
      const response = {
        myposts,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      };
  
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts or user details' });
    }
  });
  

router.put('/like', requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,

          { $addToSet: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id username photo")
        .populate("likes", "_id username photo")
        .exec();

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(422).json({ error: err });
    }
})

router.put('/unlike', requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id username photo")
        .populate("likes", "_id username photo")
        .exec();

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(422).json({ error: err });
    }
})

router.put('/comment', requireLogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id
        };

        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate("comments.postedBy", "_id username photo")
         .populate("postedBy", "_id username photo")
         .populate("likes", "_id username photo")
         .exec();

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(422).json({ error: err });
    }
})


// Api to delete post
router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await POST.findOne({ _id: req.params.postId }).populate("postedBy", "_id");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user is authorized to delete the post
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await POST.deleteOne({ _id: req.params.postId });
            res.json({ message: "Post deleted successfully" });
        } else {
            res.status(403).json({ error: "You are not authorized to delete this post" });
        }
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
module.exports = router;