const express = require('express')
const MUser = require('../models/muser');
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/signin', async(req,res) => {
    console.log("999999999999999");

    const { email, password} = req.body;

    try {

        const existingUser = await MUser.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exits."})
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, "test", { expiresIn: "1h"});

        res.status(200).json({ result: existingUser, token})

    } catch (error) {
        console.log("the error in sign up is:", error);
        res.status(500).json({message: "Something went wrong "})
    }  
})
router.post('/signup', async(req,res) => {
    console.log("in signup", req.body)
    const { email, password, firstName, lastName, confirmPassword } = req.body;

    try {
        const existingUser = await MUser.findOne({ email });
        console.log("1");

        if(existingUser) return res.status(400).json({ message: "User already exits."})
        console.log("2");

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords dont match"})
        console.log("3");

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await MUser.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        console.log("4");

        const token = jwt.sign({ email: result.email, id: result._id}, "test", { expiresIn: "1h"});
        console.log("5");

        res.status(200).json({ result: result, token})
        console.log("6");

    } catch (error) {
        
    }
});

module.exports = router
