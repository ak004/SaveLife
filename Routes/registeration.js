const express       = require('express')
const session       = require('express-session');
const mongoose      = require('mongoose');
const passport      = require("passport");
const bcrypt        = require('bcrypt');
const flash         = require("express-flash");
const User          = require("../models/User")
const Chartiy       = require("../models/chartiy");
const Oraganizations= require("../models/organaitazation")
const Reports       = require("../models/Reports")
const fs            = require('fs')
const multer        = require('multer')
const methodOverride= require("method-override");
const { checkAuthenticated,
    checkNotAuthenticated} = require("../middleware/auth")

    const initializePassport = require("../passport-config");
initializePassport(
  passport,
  async (email) => {
    const userFound = await User.findOne({ email });
    return userFound;
  },
  async (id) => {
    const userFound = await User.findOne({ _id: id });
    return userFound;
  }
);
// DBs
const Catagory = require('../Models/catagory.js');
const res = require('express/lib/response');







const router = express.Router()

router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride("_method"));
router.use(express.static("../public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {


      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
  }
})

const upload = multer({
  storage
})

router.get("/", checkAuthenticated, (req, res) => {
    res.render("dashboard", { name: req.user.name });
  });
  
  router.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register");
  });

  router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login");
  });
  
  // router.get("/catagories", checkNotAuthenticated, (req, res) => {
  //   res.render("../views/catagories.ejs");
  // });



  router.get("/chartiy_registration", (req, res) => {
    console.log("hit chata_regiser")

    Catagory.find({ status: { $ne: 'suspend' } }, (err, Catagory) => {
      if (!err) {
        Oraganizations.find({}, (err,Oraganizations) => {
          if (!err) {
            res.render('../views/chartiy_registration.ejs', {
              Catagory,
              Oraganizations
          })
          }
        })
      }else {
        console.log('Error', err)
      }
    })

    // res.render("../views/chartiy_registration.ejs");
    // // res.render("/chartiy_registration.ejs");

  });

  
  
  
  router.get("/dashboard", checkNotAuthenticated, (req, res) => {
    Catagory.aggregate([
      {
          $match:{
              status: {$ne: 'suspend'}
          },
      },
          {
            $lookup:{
                from: "chartiys",
                localField: "_id",
                foreignField: "type",
                as: "chartiys"
            }
        },
        {
            $unwind: "$chartiys"
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
    res.render("dashboard");
  });
  router.get("/organization", (req, res) => {
    res.render('../views/organization.ejs');
  });
  
  
  
  router.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );
  
  router.post("/register", checkNotAuthenticated, async (req, res) => {
    const userFound = await User.findOne({ email: req.body.email });
  
    if (userFound) {
      req.flash("error", "User with that email already exists");
      res.redirect("/register");
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
  
        await user.save();
        res.redirect("/login");
      } catch (error) {
        console.log(error);
        res.redirect("/register");
      }
    }
  });
  
  router.delete("/logout", checkNotAuthenticated,(req, res) => {
    console.log("here in logout");
    req.logOut();
    res.redirect("/login");
  });

  router.get("/catagories", (req, res) => {
    Catagory.find({}, (err, Catagory) => {
      if (!err) {
        Oraganizations.find({}, (err,Oraganizations) => {
          if (!err) {
            res.render('../views/catagories.ejs', {
              Catagory,
              Oraganizations
          })
          }
        })
      }else {
        console.log('Error', err)
      }
    })
  })

  router.post("/update_catagory", async (req, res) => {
    console.log("upadecatagory-----: ", req.body);
      var cat_id = req.body.cat_id
      var cat_type = req.body.catagory_name1
      var cat_status = req.body.catagory_status1

    Catagory.findByIdAndUpdate(cat_id, { type: cat_type, status: cat_status },
    function (err, docs) {
    if (err){
      console.log(err)
    }
      else{
        res.redirect("/catagories");
        // res.render("../views/catagories.ejs");

          console.log("Updated User : ", docs);
        }
});


  })

  router.get("/chartiy_registration", (req, res) => {

  })



  router.post('/catagory', async (req, res) => {

    const type = req.body.catagory_name;
    const status = req.body.catagory_status

    console.log("yeppp-------", req.body);

    Catagory.findOne({ type: type }, (err, success) => {
        if (success) {
            res.send('error')
        } else if (!success) {

            const catagoryData = new Catagory({
               type: type,
                status,

            })

            catagoryData.save().then(success => {
                // res.redirect('/admin/registrations')
                res.send('success')
            }).catch(err => {
                console.log('Error', err)
            })
        }
    })

})


router.post('/charty_item',upload.array('floor'),(req, res) => {
  console.log("all_items: --" , req.body);
  const type = req.body.catagories_type
  const title = req.body.titles
  const description = req.body.Descriptionss
  const current_price = req.body.current_amount
  const des_price = req.body.amount_needed
  const end_date = req.body.enddate
  const need_type = req.body.need_type
  const image = req.files
  const organaitazation = req.body.Oraganizations
  const status = req.body.status

  const floor_imagesss = new Array();

  image.forEach((imagess) => {
    var url = "";
        var liner2 = "";
        var image_name =tokenGenerator(29);
        url = "./uploads/" + image_name + '.jpg';
        liner2 = "uploads/" + image_name + '.jpg';
        fs.readFile(imagess.path, function(err, data) {
            fs.writeFile(url, data, 'binary', function(err) {});
            // fs.unlink(req.files[0].path, function (err, file) {

            // });
        });
        console.log("check------------", liner2);
        floor_imagesss.push(liner2)
  })
    // console.log("check me out--------------", liner)
  const ChartiyData   = new Chartiy({
    type: type,
     title,
     description,
     current_price,
     des_price,
     end_date,
     need_type,
     image: floor_imagesss,
     organaitazation,
     status,



 })

 ChartiyData.save().then(success => {
     // res.redirect('/admin/registrations')
     res.redirect('/chartiy_registration')
 }).catch(err => {
     console.log('Error', err)
 })

})





router.post('/orginazation',upload.fields([{
  name: 'logo', maxCount: 1
}, 
{
  name: 'floor', maxCount: 10
},
{
  name: 'owner_img', maxCount: 1
},
]),(req, res) => {
  console.log("all_orgazitaztion: --" , req.body);

  const name = req.body.Organizations_name
  const description = req.body.Descriptionss
  const ownder_name = req.body.owner_name
  const phone = req.body.phone_number
  const contact = req.body.contact
  const Address = req.body.address
  const image = req.files.floor
  const owner_img = req.files.owner_img
  const logo_img = req.files.logo
  const status = req.body.status


  console.log(req.files.owner_img)
  const floor_imagesss = new Array();

  image.forEach((imagess) => {
    var url = "";
        var liner2 = "";
        var image_name =tokenGenerator(29);
        url = "./uploads/" + image_name + '.jpg';
        liner2 = "uploads/" + image_name + '.jpg';
        fs.readFile(imagess.path, function(err, data) {
            fs.writeFile(url, data, 'binary', function(err) {});
            // fs.unlink(req.files[0].path, function (err, file) {

            // });
        });
        console.log("check------------", liner2);
        floor_imagesss.push(liner2)
  })
  const owner_imagesss = new Array();

  owner_img.forEach((imagess) => {
    var url = "";
        var liner2 = "";
        var image_name =tokenGenerator(29);
        url = "./uploads/" + image_name + '.jpg';
        liner2 = "uploads/" + image_name + '.jpg';
        fs.readFile(imagess.path, function(err, data) {
            fs.writeFile(url, data, 'binary', function(err) {});
            // fs.unlink(req.files[0].path, function (err, file) {

            // });
        });
        console.log("check------------", liner2);
        owner_imagesss.push(liner2)
  })

  const logo_imagesss = new Array();

  logo_img.forEach((imagess) => {
    var url = "";
        var liner2 = "";
        var image_name =tokenGenerator(29);
        url = "./uploads/" + image_name + '.jpg';
        liner2 = "uploads/" + image_name + '.jpg';
        fs.readFile(imagess.path, function(err, data) {
            fs.writeFile(url, data, 'binary', function(err) {});
            // fs.unlink(req.files[0].path, function (err, file) {

            // });
        });
        console.log("check------------", liner2);
        logo_imagesss.push(liner2)
  })

  const OrganizationData   = new Oraganizations({
     name,
     description,
     ownder_name,
     phone,
     contact,
     Address,
     image:floor_imagesss ,
     status,
     owner_image: owner_imagesss,
     org_logo: logo_imagesss

 })

  OrganizationData.save().then(success => {
     // res.redirect('/admin/registrations')
     res.redirect('/organization')
 }).catch(err => {
     console.log('Error', err)
 })


})


router.get('/ViewCharity',  async (req, res) => {
    Chartiy.aggregate([
      {
        $lookup: {
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
      $lookup: {
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
      type:1,
      des_price:1,
      title:1,
      organaitazation: "$organaitazation.name",
      end_date:1,
      current_price:1,
      catagory: "$catagories.type",
      status:1
    }
  }


    ],(err, charity) => {
      if(!err) {
        res.render('../views/ViewCharity.ejs', {
          charity
        })
      }
    })

})

router.get("/AddReports", (req, res) => {
//   res.render('../views/catagories.ejs', {
//     Catagory,
//     Oraganizations
// })
 Oraganizations.find({}, (err, organaitazationss) => {
  if(!err) {
    Catagory.find({ status: { $ne: 'suspend' } },(err, catagory) => {
      if(!err) {
        res.render('../views/AddReports.ejs', {
          organaitazationss,
          catagory
        })
      }
    })
  }
 })






})


router.post('/add_report',upload.fields([{
    name: 'imagess', maxCount: 10
  }, 
  {
    name: 'recipt_img', maxCount: 10
  },
  ]), (req, res) => {
    console.log("all info on report: ", req.body)
 
    const report = req.body.titles
    const description = req.body.Descriptionss
    const org_ids = req.body.Oraganizations
    const recipt_img = req.files.recipt_img
    const images = req.files.imagess
    const catagory_id = req.body.catagories_type

 



    const lists_of_items = [];
    var school_name =  new Array();
    var qunatity =  new Array();

    var name_hold =req.body.txt_items
    var school_lat_hd = req.body.txt_items_quantity

    school_name =  name_hold;
    qunatity =  school_lat_hd;

  
    for(var i in school_name) {
        var new_item = {};
        new_item.name = school_name[i]
        new_item.qunatity = qunatity[i]

    lists_of_items.push(new_item)
    }

    console.log("items---------" ,lists_of_items)
 
 
   const imagesss = new Array();

                                  images.forEach((imagess) => {
                                    var url = "";
                                        var liner2 = "";
                                        var image_name =tokenGenerator(29);
                                        url = "./uploads/" + image_name + '.jpg';
                                        liner2 = "uploads/" + image_name + '.jpg';
                                        fs.readFile(imagess.path, function(err, data) {
                                            fs.writeFile(url, data, 'binary', function(err) {});
                                            // fs.unlink(req.files[0].path, function (err, file) {

                                            // });
                                        });
                                        console.log("check------------", liner2);
                                        imagesss.push(liner2)
                                  })
 

  //////////////////////////////////////////////
  const recipt_images = new Array();

                          recipt_img.forEach((imagess) => {
                          var url = "";
                              var liner2 = "";
                              var image_name =tokenGenerator(29);
                              url = "./uploads/" + image_name + '.jpg';
                              liner2 = "uploads/" + image_name + '.jpg';
                              fs.readFile(imagess.path, function(err, data) {
                                  fs.writeFile(url, data, 'binary', function(err) {});
                                  // fs.unlink(req.files[0].path, function (err, file) {

                                  // });
                              });
                              console.log("check------------", liner2);
                              recipt_images.push(liner2)
                        })

 
                        const Reportss   = new Reports({
                          report: report,
                          discrition: description,
                          images: imagesss,
                          recipts_imgs:recipt_images ,
                          lists_of_items: lists_of_items,
                          org_id: org_ids,
                          catagory_id: catagory_id,
                          
                      })
                     
                      Reportss.save().then(success => {
                          // res.redirect('/admin/registrations')
                          res.redirect('../views/AddReports.ejs')
                      }).catch(err => {
                          console.log('Error', err)
                      })
 
  })



















tokenGenerator = function (length) {
  if (typeof length == "undefined") length = 32;
  var token = "";
  var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
      token += possible.charAt(Math.floor(Math.random() * possible.length));
  return token;
};





module.exports = router