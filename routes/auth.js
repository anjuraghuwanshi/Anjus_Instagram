const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model("USER");
const jwt = require('jsonwebtoken');
const { Jwt_secret } = require('../keys');



router.post('/signup', (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(422).json({ error: "Please add all the fields." });
    }
    USER.findOne({ $or: [{ email: email }, { username: username }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or username" });
        }
        const user = new USER({
            name,
            email,
            username,
            password
        })
        user.save()
            .then(user => { res.json({ message: "Registered successfully" }) })
            .catch(err => { console.log(err) });
    }).catch(err => { console.log(err) });
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" });
    }
    USER.findOne({ email: email, password: password })
        .select('_id name email username photo') // Include the photo field in the selection
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" });
            }
            const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);
            const { _id, name, email, username, photo } = savedUser; // Destructure photo from savedUser
            console.log(token);
            return res.status(200).json({ token, user: { _id, name, email, username, photo }, message: "Signed in successfully" });
        })
        .catch(err => console.log(err));
});


module.exports = router;
