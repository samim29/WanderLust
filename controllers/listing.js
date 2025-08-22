const Listing = require("../models/listing.js");

/**
 * Show all listings, with optional search and category filter.
 * If no results, flashes a message and redirects to /listings.
 */
module.exports.index = async(req,res) => {
     const { search, filter } = req.query;
     let query = {};
     // Search by title, location, country, or category (case-insensitive)
     if (search) {
         query.$or = [
             { title: { $regex: search, $options: "i" } },
             { location: { $regex: search, $options: "i" } },
             { country: { $regex: search, $options: "i" } },
             { category: { $regex: search, $options: "i" } }
         ];
     }
     // Filter by category if provided
     if (filter) {
         query.category = filter;
     }
     const allListings = await Listing.find(query);
     // If no listings found for search/filter, show flash and redirect
     if ((filter || search) && allListings.length === 0) {
         req.flash("error", "No listings found for your search or category.");
         return res.redirect("/listings");
     }
     res.render("./listings/index.ejs", { allListings });
}

/**
 * Render the form to create a new listing.
 */
module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs");
}

/**
 * Show details for a single listing, including reviews and owner.
 * If not found, flashes a message and redirects.
 */
module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    console.log(listing); // For debugging
    res.render("./listings/show.ejs",{listing});
}

/**
 * Create a new listing from form data.
 * Handles custom category if "Other" is selected.
 * Saves image info and owner.
 */
module.exports.createListing = async (req,res,next) => {
    if(!req.file){
        req.flash("error", "Image upload failed");
        return res.redirect("/listings/new");
    }
    let listingData = req.body.listing;
    // Replace "Other" with custom category if provided
    if (listingData.category === "Other" && listingData.customCategory) {
        listingData.category = listingData.customCategory;
    }
    console.log('Saving listing with category:', listingData.category); // Debug
    delete listingData.customCategory;
    const newlisting =  new Listing(listingData);
    newlisting.owner = req.user._id;
    newlisting.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    await newlisting.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}

/**
 * Render the edit form for a listing.
 * Shows a resized image preview using Cloudinary transformation.
 */
module.exports.editListing = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    // Ensure transformation is inserted correctly after /upload/
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/h_300,w_300/");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

/**
 * Update a listing with new data.
 * Handles custom category and image update.
 */
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listingData = req.body.listing;
    // Replace "Other" with custom category if provided
    if (listingData.category === "Other" && listingData.customCategory) {
        listingData.category = listingData.customCategory;
    }
    console.log('Updating listing with category:', listingData.category); // Debug
    delete listingData.customCategory;
    const newlisting = await Listing.findByIdAndUpdate(id, listingData);
    // Update image if a new file was uploaded
    if(typeof req.file !=="undefined" && req.file !== null){
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await newlisting.save();
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}

/**
 * Delete a listing by ID.
 */
module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}
