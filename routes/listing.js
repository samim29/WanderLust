const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { route } = require("./user.js");

const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });
router
    .route("/")
    .get(wrapAsync(listingController.index))// Index Route
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing));//Create Route


//New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))//Show Route
    .put(validateListing,isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))//Update Route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));//Delete Route


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports = router;