const User = require('../models/user');

module.exports.signup=(req,res)=>{
    // res.send("Signup page");
     res.render("users/signup");
 }

module.exports.signupPost=async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        // Use the HTTP referer header to redirect back to the page from which the logout was initiated
        const redirectUrl = req.header('Referer') || "/listings";
        res.redirect(redirectUrl);
    });
}

module.exports.login =(req,res)=>{
    //res.send("Login page");
    res.render("users/login");
}

module.exports.loginPost=async (req,res)=>{
    req.flash("success","Welcome back");
    const redirect=res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}
