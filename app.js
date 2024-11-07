if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;

main()
    .then( () => {
    console.log("Connected to DB!");
    })  
    .catch( (err) => { 
    console.log(err);
    });

async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store =  MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
//+The below expries options is set to expire in 7 days(In MilliSeconds)
//+          Date(ms)    week  hours  mins   seconds  milliseconds
    expires: Date.now() + 7  *  24  *  60  *  60  *  1000,

//+ As the name suggests it the maxAge of cookie
    maxAge: 7  *  24  *  60  *  60  *  1000,
  
    httpOnly: true
  },
};


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

//+ Initialize is a middleware that initializes passport.
app.use(passport.initialize());
//+ Session is a middleware that stores the user in the session.
app.use(passport.session());
//+ This middleware is used to check if the user is authenticated or not.
passport.use(new LocalStrategy(User.authenticate()));

//+ Serialize user is a function that is called when the user logs in.
passport.serializeUser(User.serializeUser());
//+ Deserialize user is a function that is called when the user logs out.
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
//+ This res.locals is kind of a temporary storage for the flash msg
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});

//+ Error Handling
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something Went Wrong!"} = err;

  res.status(statusCode).render("error.ejs",{err});
  // res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log(`Listening to port 8080`);
});
