const { json } = require("express/lib/response");
const Movie = require("../models/movie.model");
const Show = require("../models/show.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");

async function exploreMovies(req, res, next) {
  try {
    const current_movies = await Movie.getCurrentMovies();
    const upcoming_movies = await Movie.getUpcomingMovies();
    if (current_movies.length == 0 && upcoming_movies.length == 0) {
      res.render("./normal-users/explore.ejs", {
        current_movies: null,
        upcoming_movies: null,
      });
      return;
    } else if (current_movies.length == 0) {
      res.render("./normal-users/explore.ejs", {
        current_movies: null,
        upcoming_movies: upcoming_movies,
      });
      return;
    } else if (upcoming_movies.length == 0) {
      res.render("./normal-users/explore.ejs", {
        current_movies: current_movies,
        upcoming_movies: null,
      });
      return;
    } else {
      res.render("./normal-users/explore.ejs", {
        current_movies: current_movies,
        upcoming_movies: upcoming_movies,
      });
    }
  } catch (error) {
    next(error);
    return;
  }
}

async function isMovieValid(req, res, next) {
  try {
    const movieId = +req.params.movieid;
    if (isNaN(movieId)) {
      res.status(400).render("./shared/404.ejs");
      return;
    }
    const movie = await Movie.getMovieWithId(movieId);
    if (!movie.length > 0) {
      res.status(400).render("./shared/404.ejs");
      return;
    }
    return movie;
  } catch (error) {
    next(error);
    return;
  }
}

async function getMovieDetails(req, res, next) {
  const movie = await isMovieValid(req, res, next);
  if (movie) res.redirect(`/${movie[0].title}/${movie[0].id}/shows`);
}

async function getMovieShowDetails(req, res, next) {
  try {
    const movieId = req.params.movieid;
    const movie = await isMovieValid(req, res, next);
    if (movie) {
      const shows = await Show.getSelectedMovieShows(movieId);
      if (!shows.length > 0) {
        res.status(404).render("./normal-users/shows-not-found.ejs", {
          movieTitle: movie[0].title,
        });
      }
      res.render("./normal-users/show-details.ejs", {
        shows: shows,
        movie: movie[0],
      });
    }
  } catch (error) {
    next(error);
    return;
  }
}

async function bookShow(req, res, next) {
  const userId = +req.session.uid;
  const showId = +req.params.showid;
  const totalTickets = +req.params.totaltickets;

  if (isNaN(showId)) {
    errorResponseForBookShow(
      res,
      "Requested show is not found. <br>Please do not manipulate HTML data!"
    );
    return;
  }
  if (isNaN(totalTickets) || totalTickets > 5 || totalTickets < 1) {
    errorResponseForBookShow(
      res,
      "Number of tickets is not valid. <br>Only select tickets between 1 to 5!"
    );
    return;
  }

  try {
    const isShowBookable = await Show.isShowBookable(showId, totalTickets);
    if (isShowBookable == -1) {
      errorResponseForBookShow(
        res,
        "Requested show is not found. <br>Please do not manipulate HTML data!"
      );
      return;
    } else if (isShowBookable == 0) {
      errorResponseForBookShow(
        res,
        "Requested show has been already started.<br>Or the bookings for it might not have opened yet. <br>Please try booking other shows!"
      );
      return;
    } else if (isShowBookable == -2) {
      errorResponseForBookShow(
        res,
        `Requested show does not have ${totalTickets} tickets left. <br>Please reduce number of tickets or try booking other show!`
      );
      return;
    }
    if (isShowBookable == 1) {
      const showDetails = await Show.getShowwithId(showId);
      const booking = [
        showDetails[0].show_id,
        userId,
        showDetails[0].movie_title,
        showDetails[0].theatre_name,
        totalTickets,
        showDetails[0].price * totalTickets,
        showDetails[0].show_timing,
      ];
      await Booking.addNewBooking(booking);
      successResponseForBookShow(
        res,
        `Booking successfull!<br>Please visit "My bookings" section to find all details about it.<br>Thank you for using book your show!`
      );
      return;
    }
  } catch (error) {
    next(error);
    return;
  }
}

function errorResponseForBookShow(res, message) {
  res.status(400).json({
    message: message,
  });
}

function successResponseForBookShow(res, message) {
  res.status(200).json({
    message: message,
  });
}

async function getMyBookings(req, res, next) {
  try {
    const userId = +req.session.uid;
    const username = await User.getUserwithId(userId);
    const bookings = await Booking.getBookingWithUserId(userId);
    res.render("./normal-users/my-bookings.ejs", {
      bookings: bookings,
      username: username,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  const bookingId = +req.params.bookingid;
  const userId = +req.session.uid;

  try {
    const booking = await Booking.isBookingValid(bookingId, userId);
    if (isNaN(bookingId) || !booking.length > 0) {
      bookingCancellationErrors(
        res,
        "Invalid booking",
        "Invalid booking",
        "You are trying to cancel a booking which does not even exist!<br>Or you might not be authorized to cancel requested booking!"
      );
      return;
    }
    const isBookingCancellable = await Booking.isBookingCancellable(bookingId);
    if (!isBookingCancellable) {
      bookingCancellationErrors(
        res,
        "Not allowed for cancellation",
        "Booking is not refundable",
        "The requested booking can not be cancelled or refunded.<br>It might have been already refunded <br>Or there is less than 1 hour of time left before the show starts<br>Or the show might have been already done!"
      );
      return;
    }
    await Booking.cancelBooking(bookingId);
    res.redirect("/user/bookings");
  } catch (error) {
    next(error);
    return;
  }
}

function bookingCancellationErrors(
  res,
  titleOfPage,
  errorTitle,
  errorDescription
) {
  res.status(400).render("./shared/400.ejs", {
    titleOfPage: titleOfPage,
    errorTitle: errorTitle,
    errorDescription: errorDescription,
  });
}

module.exports = {
  exploreMovies: exploreMovies,
  getMovieDetails: getMovieDetails,
  getMovieShowDetails: getMovieShowDetails,
  bookShow: bookShow,
  getMyBookings: getMyBookings,
  cancelBooking: cancelBooking,
};
