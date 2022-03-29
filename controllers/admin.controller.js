const moment = require("moment");

const Movie = require("../models/movie.model");
const Theatre = require("../models/theatre.model");
const Show = require("../models/show.model");
const validateUtil = require("../util/validation");

async function getAllMovies(req, res, next) {
  let resultedMovies;
  try {
    resultedMovies = await Movie.getAllMovies();
  } catch (error) {
    next(error);
    return;
  }
  res.json(resultedMovies);
}

async function addNewMovie(req, res, next) {
  if (!validateUtil.isAddMovieFormValid(req.body)) {
    res.status(400).json();
    return;
  }
  try {
    req.body.release_date = new Date(moment(req.body.release_date));
    req.body.image = req.file.filename;

    const movie = new Movie(req.body);
    await movie.addNewMovie();
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

async function updateMovie(req, res, next) {
  try {
    req.body.release_date = new Date(moment(req.body.release_date));

    if (req.file) {
      req.body.image = req.file.filename;
    } else {
      req.body.image = null;
    }
    if (req.body.is_active == 0) {
      try {
        const data = await Movie.getShowsWithCurrentDateAndBookings(
          req.body.id
        );
        console.log(data);
        if (data.length > 0) {
          if (req.body.image) {
            await Movie.deleteImage(req.body.image);
          }
          res.json({
            error:
              "Can not deactivate the movie now. It might have a show which is started to book or a show on today itself!",
          });
          return;
        }
      } catch (error) {
        throw error;
      }
    }
    const movie = new Movie(req.body);
    await movie.updateMovie();
  } catch (error) {
    next(error);
    return;
  }
  res.json({ msg: "Success", error: null });
}

async function deleteMovie(req, res, next) {
  try {
    await Movie.deleteMovie(req.body);
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

async function getAllTheatres(req, res, next) {
  let resultedTheatres;
  try {
    resultedTheatres = await Theatre.getAllTheatres();
  } catch (error) {
    next(error);
    return;
  }
  res.json(resultedTheatres);
}

async function addNewTheatre(req, res, next) {
  if (!validateUtil.isAddTheatreFormValid(req.body)) {
    res.status(400).json();
    return;
  }
  try {
    const theatre = new Theatre(req.body);
    await theatre.addNewTheatre();
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

async function deleteTheatre(req, res, next) {
  try {
    await Theatre.deleteTheatre(req.body);
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

async function updateTheatre(req, res, next) {
  try {
    const theatre = new Theatre(req.body);
    await theatre.updateTheatre();
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

async function getAllShows(req, res, next) {
  let resultedShows;
  try {
    resultedShows = await Show.getAllShows();
  } catch (error) {
    next(error);
    return;
  }
  res.json(resultedShows);
}

async function addNewShow(req, res, next) {
  try {
    req.body.timing = new Date(
      moment(req.body.show_date + "T" + req.body.show_time)
    );
    const show = new Show(req.body);
    await show.addNewShow();
  } catch (error) {
    next(error);
    return;
  }
  res.json({ msg: "Success", error: null });
}

async function updateShow(req, res, next) {
  try {
    req.body.timing = new Date(
      moment(req.body.show_date + "T" + req.body.show_time)
    );
    const show = new Show(req.body);
    await show.updateShow();
  } catch (error) {
    next(error);
    return;
  }
  res.json({ msg: "Success", error: null });
}

async function addUpdateShowValidator(req, res, next) {
  if (!validateUtil.isAddShowFormNonEmpty(req.body)) {
    res.json({ error: "Please fill all input fields!" });
    return;
  }

  if (!validateUtil.isCapacityValid(req.body.total_capacity)) {
    res.json({ error: "Please enter capacity from 10 to 100!" });
    return;
  }

  if (!validateUtil.isPriceValid(req.body.price)) {
    res.json({ error: "Please enter price from 60 to 300!" });
    return;
  }

  try {
    req.body.movie_release_date = await Movie.getMovieReleaseDate(
      req.body.movie_id
    );
  } catch (error) {
    next(error);
    return;
  }

  if (!validateUtil.isShowdateValid(req.body)) {
    res.json({
      error:
        "Please enter show date from tomorrow and from movie release date!",
    });
    return;
  }
  if (!validateUtil.isShowtimeValid(req.body)) {
    res.json({ error: "Please enter show time from 8:00 AM to 10:00 PM" });
    return;
  }

  if (req.body.id) {
    updateShow(req, res, next);
    return;
  }
  addNewShow(req, res, next);
}

async function deleteShow(req, res, next) {
  try {
    await Show.deleteShow(req.body);
  } catch (error) {
    next(error);
    return;
  }
  res.json();
}

module.exports = {
  getAllMovies: getAllMovies,
  addNewMovie: addNewMovie,
  updateMovie: updateMovie,
  deleteMovie: deleteMovie,
  getAllTheatres: getAllTheatres,
  addNewTheatre: addNewTheatre,
  deleteTheatre: deleteTheatre,
  updateTheatre: updateTheatre,
  getAllShows: getAllShows,
  addUpdateShowValidator: addUpdateShowValidator,
  deleteShow: deleteShow,
};
