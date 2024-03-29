require('dotenv').config;
const express       = require('express');
const session       = require('express-session');
const mongoose      = require('mongoose');
const passport      = require("passport");
const bcrypt        = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser')
var cons = require('consolidate');
const flash         = require("express-flash");
const User          = require("./models/User")
const methodOverride = require("method-override");
const postRoutes = require('./Routes/posts');
const userRoutes = require('./Routes/users');
const Api = require('./Routes/api');
const RegistrationRoute = require('./Routes/registeration')
const { checkAuthenticated,
    checkNotAuthenticated} = require("./middleware/auth")



const app           = express();
const initializePassport = require("./passport-config");
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

app.engine('html', require('ejs').renderFile, cons.swig);
app.set('view engine', 'html');
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: "123321",
    resave: false,
    saveUninitialized: false,
  })
);
//  app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({limit: "40mb",  extended: true }))
app.use(bodyParser.json({limit: "40mb",  extended: true }));
app.use(cors());
//from the laptop me
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/api', Api)
app.use(RegistrationRoute)

mongoose
  .connect("mongodb://localhost:27017/project1", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on Port 5000");
    });
  });
