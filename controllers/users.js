const User = require("../models/user.js");


//+Callback For New User Routes
//+Get 
module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};
//+Post
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

//+ User.register adds a new user with their info and password, saves them to DB.
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to TravelTribe");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};



//+Callback For Login Routes
//+Get
module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};
//+Post
module.exports.login = async (req, res) => {
    //+passport.authenticate is a middleware which is used for authentication in post route before login

    req.flash("success","Welcome Back To Travel Tribe!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};



//+Callback For Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) =>{
        if (err) {
            return next(err);
        }
        req.flash("success", "You Are Logged Out Now!");
        res.redirect("/listings");
    });
};


