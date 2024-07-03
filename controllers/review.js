const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        // If no listing is found, return a 404 error
        return next(new ExpressError(404, "Listing not found"));
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);

    listing.reviews.push(review);
    await review.save();
    await listing.save();
    console.log("Review Added");
    req.flash("success", "Successfully added a new review");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview= async (req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
}