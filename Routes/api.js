const express = require('express')
const session       = require('express-session');
const mongoose      = require('mongoose');
const passport      = require("passport");
const bcrypt        = require('bcrypt');
const flash         = require("express-flash");
const User          = require("../models/User")
const Chartiy       = require("../models/chartiy");
const Oraganizations = require("../models/organaitazation")
const fs            = require('fs')
const Catagory = require('../Models/catagory.js');

const multer = require('multer')
const methodOverride = require("method-override");


const router = express.Router()


router.post('/all_Chartiy',(req,res)=>{
    console.log("in api session");
    Chartiy.aggregate([
        {
            $match:{
                status: {$ne: 'suspend'}
            },
        },
        {
            $lookup:{
                from: "organaizations",
                localField: "organaitazation",
                foreignField: "_id",
                as: "organaitazation"
            }
        },
        {
            $unwind: "$organaitazation"
        },
        {
            $lookup:{
                from: "catagories",
                localField: "type",
                foreignField: "_id",
                as: "catagories"
            }
        },
        {
            $unwind: "$catagories"
        },
        {
            $project:{
                _id:1,
                type:"$catagories.type",
                organaitazation_name:"$organaitazation.name",
                image:1,
                des_price:1,
                current_price:1,
                title:1,
                description:1,
                need_type:1,
                end_date:1,
                createdAt: 1,
                updatedAt:1
            }
        }
   
    ], (err, charotyy) => {
        if(!err){
        res.send({
            success:true,
            record:{
                charotyy
            }
        })
        }
    })



});

router.post('/all_Categories',(req, res) => {
    Catagory.aggregate([
        {
            $match:{
                status: {$ne: 'suspend'}
            },
        },
    ], (err, catagories) => {
        if(!err) {
            res.send({
                success: true,
                record: {
                    catagories
                }
            })
        }
    })
})
module.exports = router;