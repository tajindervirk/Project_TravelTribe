const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding.js');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { cloudinary } = require("../cloudConfig.js");



//+Callback For Index Route
module.exports.index = async (req, res) => {
  let filter = req.query.filter  
  let allListings;

  if(!filter || typeof filter === "undefined" || filter ==="" || filter ==="all"){
    allListings = await Listing.find({});
  } else if(filter ==="trending"){
    allListings = await Listing.find({category:"trending"});
  } else if(filter ==="river"){
    allListings = await Listing.find({category:"river"});
  } else if(filter ==="iconic-cities"){
    allListings = await Listing.find({category:"iconic-cities"});
  } else if(filter ==="mountains"){
    allListings = await Listing.find({category:"mountains"});
  } else if(filter ==="castles"){
    allListings = await Listing.find({category:"castles"});
  } else if(filter ==="amazing-pools"){
    allListings = await Listing.find({category:"amazing-pools"});
  } else if(filter ==="camping"){
    allListings = await Listing.find({category:"camping"});
  } else if(filter ==="farms"){
    allListings = await Listing.find({category:"farms"});
  } else if(filter ==="arctic"){
    allListings = await Listing.find({category:"arctic"});
  } else if(filter ==="beach"){
    allListings = await Listing.find({category:"beach"});
  } else if(filter ==="lake"){
    allListings = await Listing.find({category:"lake"});
  }

  res.render("listings/index.ejs", { allListings });
};

//+Search 
module.exports.searchListings = async (req, res) => {
    try {
    const { q } = req.query; // get search query from URL parameter
    
    if (!q) {
      return res.redirect("/listings");
    }

    const searchResults = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { price: q.match(/^[0-9]+$/) ? q : null }
      ]
    });

    if (searchResults.length === 0) {
      req.flash("error", "No listings found matching your search");
      return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: searchResults });
    
  } catch (error) {
    req.flash("error", "Error processing your search");
    res.redirect("/listings");
  }

};

//+Callback For New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//+Callback For Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.redirect("/listings");
  }
  
  res.render("listings/show.ejs", { listing });
};

//+Callback For Create Route
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()
    

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  // console.log(savedListing);
  
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//+Callback For Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.redirect("/listings");
  }

  let originalImgUrl =  listing.image.url;
  if(originalImgUrl.includes("https://res.cloudinary.com")){
    originalImgUrl = originalImgUrl.replace("/upload","/upload/h_150,w_250");
  }

  if(originalImgUrl.includes("https://images.unsplash.com")){
    originalImgUrl = originalImgUrl.replace("crop&w=800", "crop&h=150&w=250");
  }
  
  res.render("listings/edit.ejs", { listing , originalImgUrl});
};

//+Callback For Update Route
module.exports.updateListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()

  let geometry = response.body.features[0].geometry;
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, geometry});
  


  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };        
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//+Callback For Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  cloudinary.uploader.destroy(deletedListing.image.filename);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
