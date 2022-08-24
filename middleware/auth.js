const User          = require("../models/User")


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // var _id = req.session.passport.user
      // User.findById(_id).then((uservalue) => {
      //   var user_typpe = uservalue.type
      //   if(user_typpe == 'org_user'){
      //     res.render('org_home_page',  {
      //       user_typpe
      //     })
      //   }else {
      //     return res.redirect("/", {
      //       user_typpe
      //     });
      //   }
      // })
  
    }
    next();
  }
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
  module.exports = {
    checkNotAuthenticated,
    checkAuthenticated,
  };