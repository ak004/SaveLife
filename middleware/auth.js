const User          = require("../models/User")


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      var _id = req.session.passport.user
      User.findById(_id).then((uservalue) => {
        var user_typpe = uservalue.type
        var user_id = uservalue._id
        if(user_typpe == 'org_user'){
          if(uservalue.status == 2) {
            res.render('tessttt',  {
              user_id
            })
          }else if (uservalue.status === 3){
            res.render('org_home_page',  {
              user_typpe
            })
          }
          res.render('org_home_page',  {
            user_typpe
          })
        }else {
          return res.redirect(200,"/", {
            user_typpe
          });
        }
      })
  
    }
    next();
  }
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }else {

      res.redirect('/login')
    }
 
  }
  
  module.exports = {
    checkNotAuthenticated,
    checkAuthenticated,
  };