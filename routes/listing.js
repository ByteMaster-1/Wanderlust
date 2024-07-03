const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const {listingSchema}=require('../schema');
const Listing=require('../models/listing');
const ExpressError=require('../utils/ExpressErrors');
const {IsLoggedIn, IsOwner}=require('../middleware');

const listingController=require('../controllers/listing');
const multer=require('multer');
const {storage}=require('../cloudConfig');
const upload=multer({storage});


let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,msg);
    }else{
        next();
    
    }
};
//Index route && post route
router
  .route("/")
  .get(wrapAsync(listingController.index))
    .post(
        IsLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.postListing)
    );
//new route
router.get("/new",IsLoggedIn, listingController.newListing);
//update route
router.put("/:id",IsLoggedIn ,IsOwner,upload.single("image"),wrapAsync(listingController.updateListing));
//delete route
router.delete("/:id",IsLoggedIn, IsOwner,wrapAsync(listingController.deleteListing));
//show listing route
router.get("/:id",wrapAsync(listingController.showListing));

//edit listing route
router.get("/:id/edit",IsLoggedIn,IsOwner, wrapAsync( listingController.renderEditForm));

module.exports=router;