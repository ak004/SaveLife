const express = require('express')
const session       = require('express-session');
const mongoose      = require('mongoose');
const passport      = require("passport");
const bcrypt        = require('bcrypt');
const flash         = require("express-flash");
const User          = require("../models/User")
const Chartiy       = require("../models/chartiy");
const crypto =  require('crypto')
const Oraganizations= require("../models/organaitazation")
const fs            = require('fs')
const Catagory      = require('../models/catagory.js');
const Review        = require("../models/review")
const Payment        = require("../models/payment")
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
            $addFields: {
                dateField: {
                    $dateToParts: { date: new Date(),}
                }
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
                description:1,
                need_type:1,
                dateField:1,
                end_date:1,
                createdAt: 1,
                updatedAt:1
            }
        }
   
    ], (err, charotyy) => {
        console.log("date Left",charotyy[0].end_date);
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
//api to get all categoeies
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
                owner_name: "$organaitazation.ownder_name",
                owner_phone: "$organaitazation.phone",
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

// api to get all organization details
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

// api to donate 
router.post('/donate', (req,res) => {
    console.log("sadfasdfasdf", req.body);
    const charity_id = req.body.charity_id
    const amount = req.body.amount
    const current_amount = req.body.current_amount
    const user_id = req.body.user_id
    var added  =  current_amount + amount

    Chartiy.findByIdAndUpdate({_id:mongoose.Types.ObjectId(charity_id)}, {$set:{current_price:added }}, (err, success) => {
        if(success) {

            const paymentbyuser = new Payment({
                User_id: user_id,
                amount: amount,
                charaty_id: charity_id
            })

            paymentbyuser.save().then(success => {
                if(success) {
                    res.send({
                        success:true
                    })
                }
                
            })
        }else {
            res.send({
                success: false
            })
        }
    })
})
// api tp add a review
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

// api to get all reviews
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
                 }else {

                 }
    })
})
// to dlete reviews
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

// to get reports
router.post('/get_reports', (req, res) => {
    Reports.find({status: "active"}, (err, reports) => {
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

//to get report details
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

//fav api 
router.post('/getFav_Charaity', (req, res) => {
    var arr1 = new Array();
    arr1 = req.body;
    console.log(req.body);
    var ids = [];
    arr1.forEach(function(item) {
        
        ids.push(mongoose.Types.ObjectId(item.Charaty_id));
      });
      console.log("ids: ",ids)
      Chartiy.aggregate([
        {
            $match:{
                _id: {
                    $in: ids
                },
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

})


router.post('/login_user', async (req, res) => {
    console.log("inlogin", req.body)
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({email:username})
    if(user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch) {
            res.send({
                success: true,
                data: user,
                token: user.token,
                _id:user._id.toString(),
                name: user.name,
                username: user.email,
                type: user.type

            })
            console.log("the user_id", user._id.toString());
        }else {
            res.send({
                success: false,
                message: "wrong password",
                
            })
        }
    }else {
        res.send({
            success: false,
            message: "no user with this username exits"
        })
    }
});



router.post('/register_user', async(req, res) => {
    console.log("sdfsdfsdf", req.body)
    const userFound = await User.findOne({ email: req.body.email });
  
    if (userFound) {
        console.log("1111111111111111");
        res.send({
            success: "fasle",
            message: "wrong password"
        })
    } else {
        console.log("222222222222222222222");
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var token = crypto.randomBytes(32).toString('hex');
        const userr = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          type: "user",
          token: token
        });
  
        await userr.save();
        console.log("yesssssssssssssss");
        res.send({
            success: true,
            record:{
                success: "true"
            }
           
        })
      } catch (error) {
        console.log("nooooooooo", error);
        res.send({
            success: false,
            message: "wrong password",
            record:{
                success: "false"
            }
        })
        
      }
    } 
    
})


router.post('/setprofile_pic', async(req, res) => {
    console.log("the image", req.body);
})


router.post('/paymentbyuser', async(req, res) => {
    console.log("payment by user _id", req.body);
    const user_id = req.body.user_id

    Payment.aggregate([
        {
            $match:{
                User_id: mongoose.Types.ObjectId(user_id)
        
            },
        },
        {
            $lookup:{
                from: "chartiys",
                localField: "charaty_id",
                foreignField: "_id",
                as: "chartiys"
            }
        },
        {
            $unwind: "$chartiys"
        },
        {
            $lookup:{
                from: "catagories",
                localField: "chartiys.type",
                foreignField: "_id",
                as: "catagories"
            }
        },
        {
            $unwind: "$catagories"
        },
        {
            $group: {
                _id: "$User_id",
                Total_amount: {$sum: "$amount"},
                type: { $first: "$catagories.type"},
                payments: {
                    $push: { 
                        _id: "$_id",
                        amount: "$amount",
                        charaty_id: "$charaty_id",
                        createdAt: "$createdAt",
                        User_id: "$User_id",
                        updatedAt: "$updatedAt",
                        amount: "$amount",
                        type: "$catagories.type"
                          }
                        }
                },
        },
        // {
        //     $project:{
        //         _id:1,
        //         type:"$catagories.type",
        //         amount:1,
        //         charaty_id:1,
        //         createdAt: 1,
        //         User_id:1,
        //         updatedAt:1
        //     }
        // }
   
    ], (err, paymentss) => {
        var payments = paymentss[0].payments;
        var Total_amount = paymentss[0].Total_amount;
        if(!err){
        res.send({
            success:true,
            record:{
                payments,
                Total_amount

            }
        })
        }
    })

})



module.exports = router;