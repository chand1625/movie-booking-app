const express = require("express");

const userController = require("../controllers/user.controller");
const checkAuth = require("../middlewares/checkAuth.middleware");
const csrfTokenMiddleware = require("../middlewares/csrfToken.middleware");

const router = express.Router();

router.get(
  "/explore",
  checkAuth.checkUserAuthorization,
  userController.exploreMovies
);

router.get(
  "/:movieid/movie-details",
  checkAuth.checkUserAuthorization,
  userController.getMovieDetails
);

router.get(
  "/:movietitle/:movieid/shows",
  checkAuth.checkUserAuthorization,
  userController.getMovieShowDetails
);

router.post(
  "/book-show/:showid/:totaltickets",
  checkAuth.checkUserAuthorization,
  userController.bookShow
);

router.get(
  "/user/bookings",
  checkAuth.checkUserAuthorization,
  userController.getMyBookings
);

router.post(
  "/cancel-booking/:bookingid",
  checkAuth.checkUserAuthorization,
  userController.cancelBooking
);

module.exports = router;
