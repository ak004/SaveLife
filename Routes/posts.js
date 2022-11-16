const express = require('express')
const mongoose      = require('mongoose');
const PostMessage   = require('../models/postMessage'); 
const auth          = require('../middleware/authss');  

// import {commentPost, getPost, getPostBySearch, getposts, createPost, updatePost, deletePost, likePost  } from "../controllers/posts.js";
// import auth from "../Middleware/auth.js";
const router = express.Router();



    /// get post by search
router.get('/search', async (req, res) => {
    console.log("seared ----" ,req.query)
    const { searchQuery, tags} = req.query
    const aaa = searchQuery.trim();
    console.log(aaa);
    

    try {
        const title = new RegExp(aaa, 'i');
            console.log("----",  new RegExp(`${searchQuery}`, 'i'));
        const post =  await PostMessage.find({ $or: [{ title }, {tags: { $in: tags.split(',') }}]});

        res.json({ data: post });
    } catch (error) {
        console.log("error in api section getpostbysearch(controller)", error);
        res.status(404).json({ message: error.message})
    }
});

//  get all post
router.get('/', async (req, res) => {
    console.log("1111111111111");
    const { page } = req.query;
    try {
     const LIMIT = 8;
     const startIndex = (Number(page) -1 ) * LIMIT;
     const total = await PostMessage.countDocuments({});
     const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

     res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
     res.status(404).json({message: error.message});
    }
});


// get post by id
router.get('/:id', async (req, res) => {
    console.log("the whole bodddyyy is: ", req.body);
    const { id }  = req.params;
    try {
        const post  = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        console.log("in error in api to get postdetails : " , error);
    }
});



// create post
router.post('/', auth, async (req,res) => {
    console.log("222222222222");
    const post = req.body;
    let title =  req.body.title.trim();
    const message = req.body.message
    let tags = req.body.tags
    const selectedFile = req.body.selectedFile
    const name = req.body.name
    tags.map(s => s.trim());
    let trimedArr = tags.map(str => str.trim());
    const newPostMessage = new PostMessage({title: title, message: message, name: name, selectedFile: selectedFile, tags: trimedArr,  creator: req.userId, createdAt:new Date().toISOString()})
    // const newPostMessage = new PostMessage({...post, creator: req.userId, createdAt:new Date().toISOString()})
    
    try {
        console.log("22")
        await newPostMessage.save();
        console.log("2222")

        res.status(201).json(newPostMessage );
    } catch (error) {
        console.log("ther is an error in createing post", error);
        res.status(409).json({ message: error.message });
    }
});


// update post
router.patch('/:id',auth, async(req,res) => {
    console.log("33333333333");

    const { id: _id } = req.params;
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post with that id exits');

   
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id}, { new: true} );

    res.json(updatedPost)
});

// delete post
router.delete('/:id',auth, async(req,res) => {
    console.log("455555555555555555");
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id exits');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'post deleted successfully'})
    
});

// like post
router.patch('/:id/likePost', auth, async(req,res) => {
    console.log("6666666666666");

    const { id } = req.params;

    if(!req.userId) return res.json({ message: "unauthenticated User"})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post with that id exits');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1 ) {
        //like the post
        post.likes.push(req.userId)
    }else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new : true})

    res.json(updatedPost)

});


// comment on post
router.post('/:id/commentPost', auth, async(req,res) => {
    console.log("88888888888888888");
    const {id} = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post , {new: true});

    res.json(updatedPost);
});


module.exports = router

