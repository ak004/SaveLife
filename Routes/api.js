const express = require('express')
const session       = require('express-session');
const mongoose      = require('mongoose');
const passport      = require("passport");
const bcrypt        = require('bcrypt');
const flash         = require("express-flash");
const User          = require("../models/User")
const Chartiy       = require("../models/chartiy");
const Oraganizations= require("../models/organaitazation")
const fs            = require('fs')
const Catagory      = require('../Models/catagory.js');
const Review        = require("../models/review")

const multer = require('multer')
const methodOverride = require("method-override");
const Reports = require('../models/Reports');


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
        if(!err) {
            Review.find({type_id: charotyy[0]._id }, (err, reviews) => {

                if(!err){
                    res.send({
                        success:true,
                        record:{
                            charotyy,
                            reviews
                        }
                    })
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
            Review.find({type_id: organaitazation[0]._id }, (err, reviews) => {
                 if(!err) {
            res.send({
                success:true,
                record: {
                    organaitazation,
                    reviews
                }
            })
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

router.post('/add_review', (req, res) => {
    console.log("aaaa", req.body)
    const username = req.body.username
    const comment = req.body.comment
    const type_id = req.body.type_id
    const divice_id = req.body.divice_id

    const Reviewdata = new Review({
        username: username,
        type_id: type_id,
        comment: comment,
        divice_id: divice_id
    }) 

    Reviewdata.save().then(success => {
        res.send({
            success: true
        })
    })


    // if(req.body.user_image != undefined && req.body.user_image != "") {
    // }
})

router.post('/get_reviews', (req, res) => {
    const type_id = req.body.type_id
    Review.find({type_id:type_id}, (err, reviews) => {
        if(!err) {
            const size = reviews.length
            res.send({
                success:true,
                record: {
                    reviews,
                    size
                }
            })
                 }
    })
})

router.post('/delete_review', (req, res) => {
    const _id = req.body._id
    
    Review.findByIdAndDelete({ _id: _id }, (err, data) => {
        if (!err) {
            res.send('success')
        } else {
            res.send('error')
        }
    })
})


router.post('/get_reports', (req, res) => {
    Reports.find({}, (err, reports) => {
        if(!err) {
            res.send({
                success: true,
                record: {
                    reports
                }
            })
        }
    })
})


router.post('/report_detail', async (req, res) => {

    const _id = req.body.report_id


    Reports.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(_id)
             }

         },
         {
            $lookup:{
                from: "organaizations",
                localField: "org_id",
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
                localField: "catagory_id",
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
                report:1,
                discrition:1,
                images:1,
                recipts_imgs:1,
                lists_of_items:1,
               
                org_id: "$organaitazation._id",
                owner_name:"$organaitazation.ownder_name",
                owner_image: "$organaitazation.owner_image",
                org_phone: "$organaitazation.phone",
                org_contact: "$organaitazation.contact",
                createdAt: 1,
                updatedAt:1
            }
        }
    ], (err, reporrt) => {
        if(!err) {
                    res.send({
                        success:true,
                        record:{
                            reporrt,
                        }
                    })

        }
    })

            // Reports.aggregate([
            //     {
            //         $match: {
            //             $match: {_id: mongoose.Types.ObjectId(_id) }
            //         }
            //     },
            //     // {
            //     //     $lookup:{
            //     //         from: "organaizations",
            //     //         localField: "org_id",
            //     //         foreignField: "_id",
            //     //         as: "organaitazation"
            //     //     }
            //     // },
            //     // {
            //     //     $unwind: "$organaitazation"
            //     // },
            //     // {
            //     //     $lookup:{
            //     //         from: "catagories",
            //     //         localField: "catagory_id",
            //     //         foreignField: "_id",
            //     //         as: "catagories"
            //     //     }
            //     // },
            //     // {
            //     //     $unwind: "$catagories"
            //     // },

            //     {
            //         $project: {
            //             _id:1,
            //             report:1,
            //             discrition:1,
            //             images:1,
            //             recipts_imgs:1,
            //             lists_of_items:1,
            //         //     organaitazation_name: "$organaitazation.name",
            //         //     org_id:1,
            //         //     owner_name:"$organaitazation.ownder_name",
            //         //     owner_image: "$organaitazation.owner_image",
            //         //     org_phone: "$organaitazation.phone",
            //         //     org_contact: "$organaitazation.contact",
            //         //     catagory:"$catagories.type"
            //         }
            //     }

            //   ], (err, reportss) => {
            //     if(!err) {
            //         res.send({
            //             success: true,
            //             record: {
            //                 reportss
            //             }
            //         })
                    
            //     }else {
            //         res.send({
            //             success: false,
            //             message: err
            //         })
            //     }
            // })

   
})




module.exports = router;