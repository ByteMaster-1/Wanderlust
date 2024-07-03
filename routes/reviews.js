const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const { reviewSchema } = require('../schema.js');
const Review=require('../models/review');
const ExpressError=require('../utils/ExpressErrors');
const Listing=require('../models/listing');
const { IsLoggedIn,IsAuthor } = require('../middleware.js');
const reviewController=require('../controllers/review');
//merge params
let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,msg);
    }else{
        next();
    
    }
}
//reviews route
router.post("/",IsLoggedIn ,validateReview,wrapAsync(reviewController.createReview));
 
 // reviews delete route
 router.delete("/:reviewId",IsLoggedIn,IsAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;