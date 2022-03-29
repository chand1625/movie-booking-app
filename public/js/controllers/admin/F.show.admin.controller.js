import * as showModel from "../../models/admin/F.show.admin.model.js";
import { loadAllMovies } from "../../models/admin/F.movie.admin.model.js";
import { loadAllTheatres } from "../../models/admin/F.theatre.admin.model.js";
import showAdminView from "../../views/admin/shows/F.show.admin.view.js";
import addshowAdminView from "../../views/admin/shows/F.addshow.admin.view.js";
import errorAdminView from "../../views/admin/F.error.admin.view.js";
import showcardAdminView from "../../views/admin/shows/F.showcard.admin.view.js";

let main_data;

async function deleteShow(e) {
  const showid = e.target.parentElement.dataset.id;
  try {
    await showModel.deleteShow(showid);
    await getAllShows();
  } catch (error) {
    errorAdminView.renderServerError(
      "show-okay-btn",
      2,
      "Deletion failed!",
      "There was some problem deleting selected show. Please try again!"
    );
  }
}

async function onClickEditShow(e) {
  console.log("edit clicked");
  const id = e.target.parentElement.dataset.id;
  const movie_id = e.target.parentElement.dataset.movieid;
  const theatre_id = e.target.parentElement.dataset.theatreid;
  const show_date = e.target.parentElement.dataset.showdate;
  const show_time = e.target.parentElement.dataset.showtime;
  const total_capacity = e.target.parentElement.dataset.totalcapacity;
  const price = e.target.parentElement.dataset.price;
  const is_active = e.target.parentElement.dataset.isactive;
  const data = {
    id: id,
    movie_id: movie_id,
    theatre_id: theatre_id,
    show_date: show_date,
    show_time: show_time,
    total_capacity: total_capacity,
    price: price,
    is_active: is_active,
  };
  await addshowAdminView.render(true, main_data, data);
  addshowAdminView.addHandler(updateShow);
}

async function updateShow(e) {
  try {
    if (
      e.target.classList.contains("edit-submit") &&
      e.target.classList.contains("show")
    ) {
      e.preventDefault();
      const formData = addshowAdminView.getInputData();
      const info = await showModel.updateShow(formData);
      if (info.error) {
        errorAdminView.renderClientError(info.error, true);
        return;
      }
      await getAllShows();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "show-okay-btn",
      3,
      "Updating the selected show failed!",
      "There was some problem updating show data in database. Please try again!"
    );
    getAllShows();
  }
}

async function getAllShows() {
  try {
    const shows = await showModel.loadAllShows();
    if (shows.length == 0) {
      errorAdminView.renderServerError(
        "show-okay-btn",
        1,
        "No shows to show!",
        "Currently you do not have any shows added. Please add some!"
      );
      return;
    }
    console.log(shows);
    await showcardAdminView.render(true, shows[0]);
    if (shows.length > 1) {
      showcardAdminView.removeLastBorderBreaker();
      await showcardAdminView.render(false, shows[1]);
    }
    showcardAdminView.setBtnName(".show-editbtn");
    showcardAdminView.addHandler(onClickEditShow);
    showcardAdminView.setBtnName(".show-deletebtn");
    showcardAdminView.addHandler(deleteShow);
    await addShowRenderer();
  } catch (error) {
    errorAdminView.renderServerError(
      "show-okay-btn",
      2,
      "An error occured!",
      "There was some problem fetching the list of shows. Please try again!"
    );
  }
}

async function addshow(e) {
  try {
    if (
      e.target.classList.contains("add-submit") &&
      e.target.classList.contains("show")
    ) {
      e.preventDefault();
      const formData = addshowAdminView.getInputData();
      const info = await showModel.saveNewShow(formData);
      if (info.error) {
        errorAdminView.renderClientError(info.error, true);
        return;
      }
      await getAllShows();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "show-okay-btn",
      3,
      "Adding the new show failed!",
      "There was some problem adding new show in database. Please try again!"
    );
  }
}

async function onClickOkay(e) {
  if (e.target.classList.contains("show-okay-btn")) {
    const errorId = errorAdminView.getErrorId();
    errorAdminView.clear();
    if (errorId == 1 || errorId == 3) {
      try {
        await addShowRenderer();
      } catch (error) {}
    } else if (errorId == 2) {
      getAllShows();
    }
  }
}

async function addShowRenderer() {
  const movies = await loadAllMovies();
  const theatres = await loadAllTheatres();
  if (movies.length == 0) {
    errorAdminView.renderServerError(
      "movie-okay-btn",
      1,
      "No movies added yet!",
      "Currently you do not have any movies added to create a show for it. Please add some!"
    );
    return;
  } else if (theatres.length == 0) {
    errorAdminView.renderServerError(
      "theatre-okay-btn",
      1,
      "No theatres added yet!",
      "Currently you do not have any theatres added to create a show in it. Please add some!"
    );
    return;
  } else {
    main_data = { movies: movies, theatres: theatres };
    await addshowAdminView.render(false, main_data);
  }
}

const init = function () {
  showAdminView.addHandler(getAllShows);
  addshowAdminView.addHandler(addshow);
  errorAdminView.addHandler(onClickOkay);
};

export default init;
