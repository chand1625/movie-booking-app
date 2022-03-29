import * as movieModel from "../../models/admin/F.movie.admin.model.js";
import movieAdminView from "../../views/admin/movies/F.movie.admin.view.js";
import addmovieAdminView from "../../views/admin/movies/F.addmovie.admin.view.js";
import errorAdminView from "../../views/admin/F.error.admin.view.js";
import moviecardAdminView from "../../views/admin/movies/F.moviecard.admin.view.js";

async function deleteMovie(e) {
  const movieid = e.target.parentElement.dataset.id;
  const image = e.target.parentElement.dataset.image;
  try {
    await movieModel.deleteMovie(movieid, image);
    await getAllMovies();
  } catch (error) {
    errorAdminView.renderServerError(
      "movie-okay-btn",
      2,
      "Deletion failed!",
      "There was some problem deleting selected movie. Please try again!"
    );
  }
}

async function onClickEditMovie(e) {
  const movieid = e.target.parentElement.dataset.id;
  const image = e.target.parentElement.dataset.image;
  const title = e.target.parentElement.dataset.title;
  const genre = e.target.parentElement.dataset.genre;
  const release_date = e.target.parentElement.dataset.releasedate;
  const is_active = e.target.parentElement.dataset.isactive;
  const data = {
    movieid: movieid,
    image: image,
    title: title,
    genre: genre,
    release_date: release_date,
    is_active: is_active,
  };
  await addmovieAdminView.render(true, data);
  addmovieAdminView.addHandler(updateMovie);
}

async function updateMovie(e) {
  try {
    if (
      e.target.classList.contains("edit-submit") &&
      e.target.classList.contains("movie")
    ) {
      e.preventDefault();
      const formData = addmovieAdminView.getInputData();
      const info = await movieModel.updateMovie(formData);
      if (info.error) {
        errorAdminView.renderClientError(info.error, true);
        return;
      }
      await getAllMovies();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "movie-okay-btn",
      3,
      "Updating the selected movie failed!",
      "There was some problem updating movie data in database. Please try again!"
    );
    await getAllMovies();
  }
}

async function getAllMovies() {
  try {
    const movies = await movieModel.loadAllMovies();
    if (movies.length == 0) {
      errorAdminView.renderServerError(
        "movie-okay-btn",
        1,
        "No movies to show!",
        "Currently you do not have any movies added. Please add some!"
      );
      return;
    }
    await moviecardAdminView.render(true, movies);
    moviecardAdminView.setBtnName(".movie-deletebtn");
    moviecardAdminView.addHandler(deleteMovie);
    moviecardAdminView.setBtnName(".movie-editbtn");
    moviecardAdminView.addHandler(onClickEditMovie);
    await addmovieAdminView.render(false);
  } catch (error) {
    errorAdminView.renderServerError(
      "movie-okay-btn",
      2,
      "An error occured!",
      "There was some problem fetching the list of movies. Please try again!"
    );
  }
}

async function addmovie(e) {
  try {
    if (
      e.target.classList.contains("add-submit") &&
      e.target.classList.contains("movie")
    ) {
      e.preventDefault();
      const formData = addmovieAdminView.getInputData();
      const movieAdded = await movieModel.saveNewMovie(formData);
      if (!movieAdded) {
        errorAdminView.renderClientError("Please fill all input fields!");
        return;
      }
      await getAllMovies();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "movie-okay-btn",
      3,
      "Adding the new movie failed!",
      "There was some problem adding new movie in database. Please try again!"
    );
  }
}

async function onClickOkay(e) {
  if (e.target.classList.contains("movie-okay-btn")) {
    const errorId = errorAdminView.getErrorId();
    errorAdminView.clear();
    if (errorId == 1 || errorId == 3) {
      await addmovieAdminView.render(false);
    } else if (errorId == 2) {
      await getAllMovies();
    }
  }
}

const init = function () {
  movieAdminView.addHandler(getAllMovies);
  addmovieAdminView.addHandler(addmovie);
  errorAdminView.addHandler(onClickOkay);
};

export default init;
