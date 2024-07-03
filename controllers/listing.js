const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allLists=  await Listing.find({});
     res.render("listing/index.ejs",{ allLists});
  }

module.exports.newListing=(req,res)=>{ 
    res.render("listing/new.ejs");
}

module.exports.showListing= async (req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id)
        .populate({
            path:'reviews',
        populate:{
        path:'author'
        },
    })
    .populate('owner');
    if(!listing){
        req.flash("error", "Cannot find the listing");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
};

module.exports.postListing= async (req,res,next)=>{ 
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    console.log(newListing);
    await newListing.save();
    req.flash('success','Successfully added a new listing');
    res.redirect("/listings");
}

module.exports.renderEditForm= async (req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find the listing");
        return res.redirect("/listings");
    }
    // let original=listing.image.url;
    // orignal=original.replace("upload/","upload/w_250");
    res.render("listing/edit.ejs",{listing});
}

module.exports.updateListing=async (req, res) => {
    let response= await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();
    const { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    listing.geometry=response.body.features[0].geometry;
    await listing.save();
    console.log(listing);
    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
}
