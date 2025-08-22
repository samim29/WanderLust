const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/users/login"); // fixed path
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((listing) => {
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
      }
      next();
    })
    .catch((err) => {
      req.flash("error", "Something went wrong");
      res.redirect("/listings");
    });
};
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async (req,res,next) => {
  const { id, reviewId } = req.params;
  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
      }
      if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
      }
      next();
    })
    .catch((err) => {
      req.flash("error", "Something went wrong");
      res.redirect("/listings");
    });
};
