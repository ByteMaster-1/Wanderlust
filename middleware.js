const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.IsLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
   if( req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
    next();
}

module.exports.IsOwner=async(req,res,next)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}; 

module.exports.IsAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};