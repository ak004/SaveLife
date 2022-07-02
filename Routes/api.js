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


router.post('/all_urgent_Chartiy',(req,res)=>{
    console.log("in api session");
    Chartiy.aggregate([
        {
            $match:{
                status: {$ne: 'suspend'},
                need_type: {$eq: '2'},
                $expr:{$gt:['$des_price','$current_price']}

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


//modeifed  alittle
router.post('/all_Chartiy',(req,res)=>{
    console.log("isdfsd" , req.body);

    var filter = {
        $match: {},
    };
    if (req.body.type != undefined && req.body.type != ""){
        const typee = req.body.type
        filter["$match"]["type"] = mongoose.Types.ObjectId(typee)
    }
    Chartiy.aggregate([
        filter,
        {
            $match:{
                status: {$ne: 'suspend'},
                $expr:{$gt:['$des_price','$current_price']}
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

// @POST/api/Charity_detail
router.post('/Charity_detail',(req,res)=>{
    console.log("in details --- " , req.body)
    const Charity_id = req.body.Charity_id
    Chartiy.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(Charity_id),
                $expr:{$gt:['$des_price','$current_price']}
             }

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
                org_image: "$organaitazation.image",
                org_id: "$organaitazation._id",
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
})


router.post('/orgDetails', (req, res) => {
    console.log("in org details, " , req.body);
    const org_id = req.body.org_id

    Oraganizations.aggregate([
        {
            $match: {_id: mongoose.Types.ObjectId(org_id) }
         },
    ], (err, organaitazation) => {
        if(!err) {
            res.send({
                success:true,
                record: {
                    organaitazation
                }
            })
        }
    })
    
})


// filter 
router.post('/filter',(req,res)=>{
    console.log("isdfsd" , req.body);

    var filter = {
        $match: {},
    };
    // if (req.body.type != undefined && req.body.type != ""){
    //     const typee = req.body.type
    //     filter["$match"]["type"] = mongoose.Types.ObjectId(typee)
    // }

    if (req.body.searchtxt != undefined && req.body.searchtxt != "") {
        const searchtxt = req.body.searchtxt
        filter["$match"]["title"] = { $regex: new RegExp( searchtxt, 'si') };
    }

    Chartiy.aggregate([
        filter,
        {
            $match:{
                status: {$ne: 'suspend'},
                $expr:{$gt:['$des_price','$current_price']}
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
        const size = charotyy.length
        if(!err){
        res.send({
            success:true,
            record:{
                charotyy,
                size
            },
           
        })
        }
    })



});

router.post('/donate', (req,res) => {
    const charity_id = req.body.charity_id
    const amount = req.body.amount

    Chartiy.findByIdAndUpdate({_id:charity_id}, {$set:{current_price:amount }}, (err, success) => {
        if(success) {
            res.send({
                success:true
            })
        }else {
            res.send({
                success: false
            })
        }
    })
})

module.exports = router;