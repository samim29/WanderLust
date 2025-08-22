const User = require("../models/user.js");
const passport = require("passport");
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    await User.register(user, password);

    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully signed up!");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      return res.redirect(redirectUrl); // add redirect
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("users/signup"); // fixed path
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};
